+++
title = "Some of my favorite things"
date = 2020-04-15
+++

This is a list of some of my favorite tools that are maybe lesser known. This file
exists mostly so I can keep track of all the things I need to remember I have in my
toolbelt.

# SingleFile

[firefox](https://addons.mozilla.org/en-US/firefox/addon/single-file/)
[chrome](https://chrome.google.com/webstore/detail/singlefile/mpiodijhokgodhhofbcjdecpffjipkle?hl=en)

A browser extension that saves a webpage into a single standalone HTML file. This includes resources such as images (as far as
I know it will base64 encode them into the html). I use this extension quite a bit. One of my least favorite things is when a webpage
I have bookmarked goes away from the internet, so I use this tool to save webpages I want to reference later. E.g. recipes, docs, etc.

# croc

[github](https://github.com/schollz/croc)

Send files/folders to someone else directly and easily.

Install with any of these:

    curl https://getcroc.schollz.com | bash
    sudo pacman -S croc

# nvtop

[github](https://github.com/Syllo/nvtop)

Like htop but for GPUs.

Install with:

    sudo pacman -S nvtop

# starship

[github](https://github.com/starship/starship)

A fancy and fast shell prompt.

Install via:

    curl -fsSL https://starship.rs/install.sh | bash

# sshb0t

[github](https://github.com/genuinetools/sshb0t)

Use this to keep authorized keys on servers for easier
ssh access. Run with docker:

```
docker run -d --restart always \
    --name sshb0t \
    -v ${HOME}/.ssh/authorized_keys:/root/.ssh/authorized_keys \
    r.j3ss.co/sshb0t --user [YOUR GITHUB USERNAME HERE] \
    --keyfile /root/.ssh/authorized_keys
```

# fd

[github](https://github.com/sharkdp/fd)

A convenient and fast alternative to `find`.

Installation options:

    cargo install fd-find

# fzf

[github](https://github.com/junegunn/fzf)

A fuzzy file finder that can integrate with your shell to give you fuzzy searching with ctrl-t and ctrl-r.

Installation options:

    brew install fzf && $(brew --prefix)/opt/fzf/install
    git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf && ~/.fzf/install
    sudo pacman -S fzf

# rg

[github](https://github.com/BurntSushi/ripgrep)

Extremely fast searching of files and directories.

Installation options:

    brew install ripgrep
    pacman -S ripgrep
    cargo install ripgrep

# dust

[github](https://github.com/bootandy/dust)

A better version of `du`. Run it just with:

    dust some-folder

To get a nice display of what's taking up space inside that folder.

Installation options:

    cargo install du-dust

# syncthing

[github](https://github.com/syncthing/syncthing)

Think of it like a peer to peer dropbox clone. Your files only ever live on
your devices.

# pandoc

Convert to and from a large number of markup formats. I like standalone html pages
with embedded CSS. You can do this with the following command:

    pandoc --self-contained --table-of-contents --to html5+auto_identifiers
           --standalone INPUT.md --output OUTPUT.html

This will even base64 encode included images and embed them into the resulting HTML.
If you don't want a table of contents just leave off the flag. If you want to embed a CSS file add the following to the above
command:

    --css=YOURCSS.css

For a good example of some nice CSS check out this [gist](https://gist.github.com/killercup/5917178). Also pandoc can generate HTML presentations from markdown.

# tealdeer

[github](https://github.com/dbrgn/tealdeer)

Fetch quick examples about particular unix commands.

Install with:

    cargo install tealdeer
