---
title: "Updated Python Guide"
description: "Updated notes on minimal python"
pubDate: "Aug 17 2024"
---

# uv

`uv` is the current best way to manage python projects.
It is a replacement for pip, poetry, pyenv, etc. etc.

## Installation

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

You can also run things through uv without needing to source the virtual env.

```bash
uv run python
```

```bash
uv run code .
```

## Sync with the lock files

```bash
uv sync
```

## Fallback to pip

```bash
uv pip install -r requirements.txt
```

Output a `requirements.txt`:

```bash
uv pip compile pyproject.toml > requirements.txt
```

## Install the latest version of Python

```bash
uv python install
```

## Update uv

```bash
uv self update
```

---

# Ruff

`ruff` is a very fast and well thought out linter and code formatter for Python.

## Installation

```bash
uv add ruff --dev
```

Or run it via `uvx`:

```bash
uvx ruff
```

## Usage

Format your code:

```bash
ruff format .
```

Lint your code:

```bash
ruff check .
```

You can also attempt to have ruff fix lint issues for you:

```bash
ruff check --fix .
```

---

# Pydantic

[pydantic](https://docs.pydantic.dev/latest/) is a data validation library for Python. It provides
runtime validation of data through Python type hints.

## Usage

```bash
uv add pydantic
```

```python
from pydantic import BaseModel

class Location(BaseModel):

    latitude: float
    longitude: float

```

Now you can parse some json:


```json
{
    "latitude": 34.3,
    "longitude": 23.8
}
```

All that is needed to parse this is:

```python
location = Location.model_validate_json(json_string_data)
```

You can also emit it back out to json.

```python
print(location.model_dump_json())
```

Importantly if you pass in invalid data you will get an error message.
You should be validating data at the edges of your program ideally, any
inputs, and any outputs.
