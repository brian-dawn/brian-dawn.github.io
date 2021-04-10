+++
title = "NixPkg Notes"
date = 2020-11-28
+++

# What is Nix

Nix is a package management tool.

Here are some [helpful](https://nixos.org/guides/nix-pills/) beginner
[resources](https://github.com/justinwoo/nix-shorts).

# Nix CLI Basics

### How do I search for packages?

You can use the new nix command:

    nix search ripgrep

Or:

    nix-env -qa ripgrep

### How do I install a package?

Install:

    nix-env -i ripgrep

Uninstall:

    nix-env -u ripgrep

### How do I test out a package?

The following command will drop you into a shell with `ripgrep` and `vim` installed:

    nix-shell -p ripgrep -p vim

You can also use `nix run` to do this:

    nix run nixpkgs.python38 -c python

### How do I upgrade all packages for which there is a newer version?

    nix-env -u

### I screwed up with nix-env what do I do?

Any nix-env operation can be rolled back with:

    nix-env --rollback

### How do I clean the store?

    nix-collect-garbage -d

# More complex examples

## Using nixpkg to manage a python project

Make a file called `default.nix` in the root of your python project. Inside put:

```nix
with import<nixpkgs> {};
stdenv.mkDerivation rec {
  src = ./.;
  name = "mypythonproject";

  buildInputs = with pkgs; [
    # basic python dependencies
      python38
      python38Packages.numpy
      python38Packages.scikitlearn
      python38Packages.scipy
      python38Packages.matplotlib
  ];
}
```

Now you can run:

    nix-shell

And you'll drop into a shell with python and the above dependencies installed.
You can also run:

    nix-shell --run "python main.py"

If you don't want an interactive shell.

You can get more info [here](https://josephsdavid.github.io/nix.html).

## Using nix as a script interpreter

You can use nix as a shell interpreter to allow for arbitrary scripts to fetch their own dependencies:

```python
#! /usr/bin/env nix-shell
#! nix-shell -i python -p python pythonPackages.prettytable

import prettytable

# Print a simple table.
t = prettytable.PrettyTable(["N", "N^2"])
for n in range(1, 10): t.add_row([n, n * n])
print t
```

More info [here](https://nixos.org/manual/nix/unstable/command-ref/nix-shell.html).

## Running a python repl with some dependencies

    nix-shell \
        -p 'python38.withPackages(ps: with ps; [pyrealsense2WithoutCuda ])' \
        --run python

## Nix Flakes

One of the issues so far with using Nix to manage a projects resources is that in things can still
change between users depending on the Nix channel they are using. There is an experimental feature
called Nix Flakes that a addresses these issues.

For a much more in depth blogpost check out [this](https://www.tweag.io/blog/2020-05-25-flakes/).

### A quick Nix Flakes demo

NOTE: this section is very much a WIP.

Create a new folder and inside it run:

    nix flake init

This will create a file called `flake.nix`. Lets update that file to look like:

```nix
{
  description = "Demo Python Example";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs?ref=nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }: (utils.lib.eachSystem ["x86_64-linux" ] (system: rec {

    packages = {
      pythonEnv = nixpkgs.legacyPackages.${system}.python3.withPackages(ps: with ps; [ numpy pandas ]);
    };

    defaultPackage = packages.pythonEnv;
    devShell = packages.pythonEnv.env;
  }));
}
```

Now lets drop into a shell with:

    nix develop

Nix should download the dependencies. You should eventually drop into a bash shell. From here you could open up your favorite IDE but for now lets check the current python path:

    bash-4.4$ which python
    /nix/store/p8s64wi8xbzspmfwpxach9dqvycz6ag2-python3-3.8.6-env/bin/python

Neat. You also should notice that there's now a flake.lock file. This is pinning the exact versions of things.

If you want to see a more comprehensive example involving poetry for easier python dependency management take a look [here](https://github.com/brian-dawn/nix-flake-poetry-example).
