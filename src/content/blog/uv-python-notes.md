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

# Recommendations for Data Science

TODO, also test torch with uv

## VS Code

todo

## Jupyter

```bash
uv add --dev jupyter pandas plotly
```

---

# General principals and gotchas

## Avoiding tuples and dictionaries

While it's tempting to write something like:

```python
config_dict = {
    "happiness": "extreme"
}
```

Assuming your keys in your dictionary are not dynamic
use a dataclass (or Pydantic BaseModel) instead:

```python
from dataclasses import dataclass

@dataclass
class Config():
    happiness: str

config = Config(happiness="severe")
```

And using `enums` is even better too:

```python
from dataclasses import dataclass
from enum import Enum

class HappinessLevel(Enum):
    SEVERE = "severe"
    EXTREME = "extreme"

@dataclass
class Config():
    happiness: HappinessLevel

config = Config(happiness=HappinessLevel.SEVERE)
```

Now one issue with this is we can still incorrectly assign an invalid type to our
config dataclass.

```python
config = Config(happiness=12312312)
```

This is where `pydantic` comes in.

```python
from pydantic import BaseModel
from enum import Enum

class HappinessLevel(Enum):
    SEVERE = "severe"
    EXTREME = "extreme"

class Config(BaseModel):
    happiness: HappinessLevel

config = Config(happiness=HappinessLevel.SEVERE)
```

It's more code, but now we get:

1. **Editor support:** We can now jump to definition to our available options.
2. **Runtime checks:** Python is a **strongly** typed dynamic language. This means that
   we should expect things to explode at runtime if the types are wrong. If we don't select
   a valid happiness level in our enum we will fail.
3. **Optional static checks:** Modern Python editors will show you if you are utilizing types
   incorrectly at compile time.

## Utilizing type hints

todo

## Getting fancy with union types

todo
