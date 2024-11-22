---
title: "Running Lots of Apps on Digital Ocean"
description: "This is a WIP."
pubDate: "Nov 17 2024"
---

This is a WIP guide that discusses how I host several different applications on a single Digital Ocean Droplet.


The only requirements for this is that you have docker compose.

```yaml
services:
  # Docker Registry Service
  registry:
    image: registry:2
    container_name: registry
    ports:
      - "5000:5000"
    volumes:
      - ./registry_data:/var/lib/registry
    environment:
      REGISTRY_HTTP_HEADERS_Access-Control-Allow-Origin: '[https://ui.registry.lab.dawn.lol]'
      REGISTRY_HTTP_HEADERS_Access-Control-Allow-Methods: '[HEAD,GET,OPTIONS,DELETE]'
      REGISTRY_HTTP_HEADERS_Access-Control-Allow-Credentials: '[true]'
      REGISTRY_HTTP_HEADERS_Access-Control-Allow-Headers: '[Authorization,Accept,Cache-Control]'
      REGISTRY_HTTP_HEADERS_Access-Control-Expose-Headers: '[Docker-Content-Digest]'
      REGISTRY_STORAGE_DELETE_ENABLED: 'true'
    restart: always

  # Docker Registry UI Service
  registry-ui:
    image: joxit/docker-registry-ui:2.5.7
    container_name: registry-ui
    environment:
      - REGISTRY_TITLE=My Private Registry
      - NGINX_PROXY_PASS_URL=http://registry:5000
        # - REGISTRY_URL=https://registry.lab.dawn.lol
      - SINGLE_REGISTRY=true
      - REGISTRY_SECURED=true
      - DELETE_IMAGES=true  # Optional: Enable image deletion
    restart: always

  # NOTE: This requires an image exists. You can cheat with:
  #     docker tag alpine registry.lab.dawn.lol/basic-go-web
  basic-web:
    container_name: basic-web
    image: registry.lab.dawn.lol/basic-go-web:latest
    restart: always

  # Caddy Reverse Proxy
  caddy:
    image: caddy:latest
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./caddy_config:/etc/caddy
      - ./caddy_data:/data
    environment:
      - CADDYFILE_PATH=/etc/caddy/Caddyfile
    command: caddy run --config /etc/caddy/Caddyfile

  docker-prune:
    image: docker:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    entrypoint: /bin/sh -c "while true; do sleep 3600; docker system prune -af; done"
    restart: unless-stopped

  # Watchtower for automatic updates on image pushes
  watchtower:
    image: containrrr/watchtower
    command: --interval 30 --include-stopped --revive-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  # Sync ssh keys from brian-dawn github to here.
  sshb0t:
    image: jessfraz/sshb0t
    restart: always
    volumes:
      - /root/.ssh/authorized_keys:/root/.ssh/authorized_keys
    command: --user brian-dawn --keyfile /root/.ssh/authorized_keys

  dozzle:
    container_name: dozzle
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - 8080:8080
```



```caddy

(basic_auth) {
    basicauth {
        # Put your user/auth here.
    }
}

registry.lab.dawn.lol {
    encode gzip
    reverse_proxy registry:5000
    tls your_email@example.com

    @internal {
        remote_ip 146.190.159.161/32 127.0.0.1/32
    }

    handle @internal {
        reverse_proxy registry:5000
    }

    handle {
        import basic_auth
        reverse_proxy registry:5000
    }
}

ui.registry.lab.dawn.lol {
    encode gzip
    reverse_proxy registry-ui:80
    tls your_email@example.com

    import basic_auth
}


logs.lab.dawn.lol {
    encode gzip
    reverse_proxy dozzle:8080

    import basic_auth
}



wow.lab.dawn.lol {
    encode gzip

    reverse_proxy basic-web:8080
}

test.lab.dawn.lol {

    respond "Success!"
}

```