---
title: "Quick Python Guide"
description: "My notes on minimal Python, only leveraging pip and pyenv."
pubDate: "Jul 22 2022"
banner: "/planet03.png"
---

Python is quite a big landscape, it can be intimidating to know
how to manage projects.

Here is my ultra minimal Python setup. It
only requires the installation of one non-standard tool.

---

# Project Management

## Install pyenv

Very often we want to have multiple versions of Python installed on our
systems. For this I recommend `pyenv`.

If you are fine with the system Python you can skip this step.

On macos:

```bash
brew install pyenv
```

Others:

```bash
curl https://pyenv.run | bash
```

Update your `.bashrc` file to load pyenv:

```bash
export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
```

Source your `.bashrc` to load the changes:

```bash
source ~/.bashrc
```

---

## Getting Started

Lets create a new folder for our test project:

```bash
mkdir test-project
cd test-project
```

Lets use python 3.9. We can use pyenv to install it:

```bash
pyenv install 3.9.16
```

We can create a `.python-version` file in the project which will auto
load and set us on 3.9 when we cd into this directory with:

```bash
pyenv local 3.9.16
cat .python-version
```

We can verify that we are using the correct python version:

```bash
python --version
```

## Creating a virtualenv with venv

Before we can write code and install packages we need to create what's called a virtualenv. In the Python world
you can sorta think of this like a sandbox where anything you do in it is contained just in the virtual environment.

This will let us maintain separate versions of various packages if we need to.

Create the virtualenv:

```bash
python -m venv .venv
```

This creates a folder called `.venv` which contains our virtual environment. We can activate it with the following:

```bash
source .venv/bin/activate
```

Now all our python tools should be scoped to the virtualenv. Running:

```bash
which python
```

Should show that our python is being sourced by the .venv folder. If you ever want to break free from the virtual environment
you can run:

```bash
deactivate
```

## Using pip inside the virtual environment

Pip is used to install packages. It's important to note that if you have not activated the virtual environment you will be using your
global pip/python environment.

It is common to create a file called `requirements.txt` which contains our list of dependencies.

```bash
touch requirements.txt
```

Lets install numpy, so add the following to `requirements.txt`:

```bash
numpy==1.24.4
```

If you don't care about the version you could just say `numpy` but I recommend freezing the deps then which I describe later in this document. Now we can install things to the virtual environment with:

```bash
pip install -r requirements.txt
```

We can validate that this worked by dropping into a python shell:

```bash
python
```

Now lets import numpy:

```python
import numpy as np
exit()
```

Another way we can do this is by installing directly with pip, lets install a code formatter called `black`:

```bash
pip install black
```

The issue here though is if we want to pull the project down again we need to remember we installed this. We can leverage
a command called `pip freeze` to export our environment back to the `requirements.txt` file.

Go ahead and run:

```bash
pip freeze
```

You'll see it also dumps out the transitive dependencies we would like to install as well. To avoid polluting our main `requirements.txt` file
I like to store the frozen deps in a different file, but that's up to you:

```bash
pip freeze > requirements-frozen.txt
```

## Using VS Code

If you use VS code things should just work out of the box. You need to open the project while the virtual environment is activated:

```bash
code .
```

The correct python version as well as the virtual environment should be shown at the bottom right. If you create a new python file called `main.py`
you should be able to insert the following program:

```python
import numpy as np
a = np.arange(15).reshape(3, 5)
print(a)
```

You should have auto complete setup automatically at this point.

---

# Common tools and libraries


## Code formatting

I recommend using `black`. You can install/use it with:

```bash
pip install black
black .
```

Don't forget to freeze it in your requirements file!

---

## Linting

I like `ruff`. You can install/use it with:

```bash
pip install ruff
ruff .
```

Don't forget to freeze it in your requirements file!

---

## Tests

I recommend `pytest`. Install it with:

```bash
pip install pytest
mkdir test
touch test/my_test.py
```

Inside `my_test.py` add:

```python
def test_failure():
    assert False
```

Now you can run:

```bash
pytest
```

And you should see failures.

### Adding src paths

Let say you had the following code in `src/main.py`:

```python
def add_one(x):
    return x + 1
```

Now lets say we had the following test in `test/test_main.py`:

```python
from main import add_one

def test_add_one():
    assert add_one(1) == 2
```

You'll notice that the import fails to resolve. Historically in Python you would need to update
the PYTHONPATH environment variable to fix the path issues. As of pytest v7+ you can now use
a `pyproject.toml` file in your project root to accomplish this.

```bash
touch pyproject.toml
```

And inside put:

```toml
[tool.pytest.ini_options]
pythonpath = [
  "src"
]
```

Now `pytest` should work.

---

## Typechecking

Lets use `mypy` to test do typechecking. VS Code ships with its own which works well but here's how we can
check things via the CLI:

```bash
pip install mypy
```

Lets add this function to our `main.py` file:

```python
def type_checker_fail() -> int:
    return "Hello World"
```

Now run:

```bash
mypy .
```

And you should see the type error.

---

## Debugging

Python ships with a library called pdb, you can use it in your code like:

```python
import pdb; pdb.set_trace()
```

Now just run your code and you'll drop into the debugger when you hit the trace point.
