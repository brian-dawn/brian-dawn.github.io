---
title: "My Neovim Setup"
description: "My notes my neovim config"
pubDate: "Nov 26 2023"
banner: "/planet03.png"
---

You can find my neovim config on
[Github](https://github.com/brian-dawn/dotfiles-simple/tree/main/.config/nvim).


## Generic shortcuts

| Generic Shortcuts        | Description                                            |
|--------------------------|--------------------------------------------------------|
| `<leader>y`              | Yank to system clipboard.                              |
| `<leader>Y`              | Yank to system clipboard (whole line).                 |
| `<leader>p`              | Paste from system clipboard.                           |
| `<leader>P`              | Paste from system clipboard.                           |
| `<C-p>`                  | Find files (similar to the one provided by Telescope). |
| `J` (Visual mode)        | Move selected lines down.                              |
| `K` (Visual mode)        | Move selected lines up.                                |
| `<C-=>` (Neovide)        | Increase Neovide scale factor.                         |
| `<C-->` (Neovide)        | Decrease Neovide scale factor.                         |
| `<CMD-s>`                | Save file.                                             |
| `<CMD-c>`                | Copy to clipboard.                                     |
| `<CMD-v>`                | Paste from clipboard in various modes.                 |



## Plugins and their shortcuts


| Plugin or Feature | Description                                       | Shortcut              | Explanation                              |
|-------------------|---------------------------------------------------|-----------------------|------------------------------------------|
| `mason`           | Package manager for Neovim. `:Mason` to use.      |                       |                                          |
| `cmp`             | Autocompletion plugin.                            | `<C-p>`               | Select previous item in completion menu. |
|                   |                                                   | `<C-n>`               | Select next item in completion menu.     |
|                   |                                                   | `<tab>`               | Confirm the current completion item.     |
|                   |                                                   | `<enter>`             | Confirm the current completion item.     |
|                   |                                                   | `<C-space>`           | Trigger completion manually.             |
| `nvim_lsp`        | Configures LSP for different languages.           | `gd`                  | Go to definition.                        |
|                   |                                                   | `K`                   | Show hover information.                  |
|                   |                                                   | `<leader>vco`         | LSP outgoing calls.                      |
|                   |                                                   | `<leader>vci`         | LSP incoming calls.                      |
|                   |                                                   | `<leader>vws`         | LSP workspace symbols.                   |
|                   |                                                   | `<leader>vd`          | Open diagnostics float.                  |
|                   |                                                   | `[d`                  | Go to next diagnostic.                   |
|                   |                                                   | `]d`                  | Go to previous diagnostic.               |
|                   |                                                   | `<leader>vca`         | Trigger code action.                     |
|                   |                                                   | `<leader>vrr`         | LSP references.                          |
|                   |                                                   | `<leader>vrn`         | Rename symbol.                           |
|                   |                                                   | `<C-h>` (Insert mode) | Show signature help.                     |
| `telescope`       | Fuzzy finder plugin.                              | `<leader>ff`          | Find files.                              |
|                   |                                                   | `<leader>fg`          | Live grep.                               |
|                   |                                                   | `<leader>fb`          | List buffers.                            |
|                   |                                                   | `<leader>fh`          | Help tags.                               |
|                   |                                                   | `<leader>r`           | Resume last telescope.                   |
|                   |                                                   | `<leader>gs`          | git status.                              |
|                   |                                                   | `<leader>gc`          | git commits.                             |
|                   |                                                   | `<leader>gb`          | git branches.                            |
|                   |                                                   | `<C-p>`               | Find files (Ctrl + p).                   |
|                   |                                                   | `<leader>u`           | Telescope undo.                          |
| `copilot`         | GitHub Copilot integration.                       | `<Tab>` (Insert mode) | Accept Copilot suggestion.               |
|                   |                                                   | `C-n` or `C-p`        | Navigate up/down completion menu.        |
| `gitsigns`        | Git integration in the gutter.                    | `]c`                  | Next git hunk.                           |
|                   |                                                   | `[c`                  | Previous git hunk.                       |
|                   |                                                   | `<leader>ghs`         | Stage git hunk.                          |
|                   |                                                   | `<leader>ghr`         | Reset git hunk.                          |
|                   |                                                   | `<leader>ghS`         | Stage git buffer.                        |
|                   |                                                   | `<leader>ghu`         | Undo stage git hunk.                     |
|                   |                                                   | `<leader>ghR`         | Reset git buffer.                        |
|                   |                                                   | `<leader>ghb`         | Blame git line.                          |
| `toggleterm`      | Terminal within Neovim.                           | `<esc>` (Normal mode) | Hide the hover terminal.                 |
|                   |                                                   | `<leader>t`           | Toggle terminal.                         |
| `neo-tree`        | File explorer. `:Neotree` to open.                |                       |                                          |
| `Comment`         | Commenting plugin.                                | `gc` (Visual mode)    |                                          |
| `hop`             | Easymotion-like navigation.                       | `<leader>w`           | Quick jump anywhere in the current view. |
| `aerial`          | Navigate code symbols. `:AerialToggle` to toggle. | `<leader>va`          | Open Aerial in Telescope.                |


## Generating the table in a naive way
I generated this config by running the following code inside `~/.config/nvim`:

```bash
# Swap pbcopy for your preferred clipboard tool.
find . -name "*.lua" | xargs cat | pbcopy
```

Then slam the results into `GPT4`. Ask it to generate a markdown table of the shortcuts/plugins. For updates
provide it the existing list.
