---
title: "Quick Python Guide"
description: "Updated notes on minimal python"
pubDate: "Aug 17 2024"
---

In my opinion `uv` is the current best way to manage python projects.
It is a replacement for pip, poetry, pyenv, etc. etc.

# Installation

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Initialize a project

```bash
uv init my-project
```

## Create a venv

```bash
uv venv
source .venv/bin/activate
```

## Add a dependency

```bash
uv add numpy
uv add --dev ruff
```

## Run a command

```bash
uv run python
```

## Sync with the lock files

```bash
uv sync
```

## Fallback to pip

```bash
uv pip install -r requirements.txt
```
