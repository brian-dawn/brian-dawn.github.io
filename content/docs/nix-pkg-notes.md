+++
title = "NixPkg Notes"
date = 2020-11-28
+++

# What is Nix

Nix is a package management tool.

# How do I search for packages?

You can use the new nix command:

    nix search ripgrep

Or:

    nix-env -qa ripgrep

# How do I install a package?

Install:

    nix-env -i ripgrep

Uninstall:

    nix-env -u ripgrep

# How do I test out a package?

The following command will drop you into a shell with `ripgrep` and `vim` installed:

    nix-shell -p ripgrep -p vim

# How do I upgrade all packages for which there is a newer version?

    nix-env -u

# I screwed up with nix-env what do I do?

Any nix-env operation can be rolled back with:

    nix-env --rollback

# How do I clean the store?

    nix-collect-garbage -d

# How do I live on the bleeding edge?

You can subscribe to the nix unstable channel:

    nix-channel --add https://nixos.org/channels/nixpkgs-unstable

# Using nixpkg to manage a python project

Make a file called `shell.nix` in the root of your python project. Inside put:

```nix
let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    name = "simpleEnv";
    buildInputs = with pkgs; [
      python38
      python38Packages.numpy
      python38Packages.scikitlearn
      python38Packages.scipy
      python38Packages.matplotlib
    ];
   shellHook = ''
      '';
  }
```

Now you can run:

    nix-shell

And you'll drop into a shell with python and the above dependencies installed.
You can also run:

    nix-shell --run "python main.py"

If you don't want an interactive shell.

You can get more info [here](https://josephsdavid.github.io/nix.html).

# Using nix as a script interpreter

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

## Testing a local python package example

    nix-shell /home/brian/repos/brian/nixpkgs -p 'python38.withPackages(ps: with ps; [pyrealsense2WithoutCuda ])'
