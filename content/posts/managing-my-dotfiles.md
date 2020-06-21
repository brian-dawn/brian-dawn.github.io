+++
title = "How I manage my dotfiles"
date = 2020-06-12
+++

Over the years I've used several different methods of tracking my dotfiles. I've been using a specific method
of leveraging git that I have been using for many years now without change. Running `git init` inside your
home directory is not ideal because it means that your tools will always think you are inside a git repo
anywhere that you are. All credit for this method goes to user StreakyCobra on the
[dreaded orange site](https://news.ycombinator.com/item?id=11070797).

With that said here's what I did to start using this way of doing things:

    git init --bare $HOME/.dotfiles-repo
    alias config='/usr/bin/git --git-dir=$HOME/.dotfiles-repo/ --work-tree=$HOME'
    config config status.showUntrackedFiles no

Then add:

    alias config='/usr/bin/git --git-dir=$HOME/.dotfiles-repo/ --work-tree=$HOME'

To your bashrc to ensure you always get this alias. So we created a repo that's not at our home directory level, and then create a new alias command
that uses that hidden repo as the working tree. What does this let us do?

We can track new files with:

    config status
    config add .vimrc
    config commit -m "Add vimrc"
    config add .config/redshift.conf
    config commit -m "Add redshift config"
    config push

I use branches to track differences between my Linux and MacOS machines just like you would with regular git.

On new machines you can do:

    git clone --bare [your-dotfiles-repo] $HOME/.dotfiles-repo

We need to create the same alias as before:

    alias config='/usr/bin/git --git-dir=$HOME/.dotfiles-repo/ --work-tree=$HOME'

Now we are ready to initialize all our files from the repo. You can do this with:

    config checkout

You will probably have file conflicts since git will refuse to overwrite files that already exist. You can either delete/backup these files by hand, or if you are like me and need an adrenaline rush you can just force overwrite them:

    config checkout -f

Finally we need to make it so we don't see every other file in our home directory
that isn't tracked:

    config config status.showUntrackedFiles no

Now your system is ready to go!
