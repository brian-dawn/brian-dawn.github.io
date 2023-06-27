+++
title = "Python Notes"
date = 2023-06-27
+++

# Guide

As good as tools like poetry are here is my ultra minimal python guide.

To make a long story short the only non-standard tool we'll depend on is pyenv to manage our versions of python.

# Project Management

## Install pyenv

On macos:

    brew install pyenv

Others:

    curl https://pyenv.run | bash

Update your `.bashrc` file to load pyenv:

```bash
# Pyenv shell integration
# Load pyenv automatically by appending
# the following to
export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
```

Source your `.bashrc` to load the changes:

    source ~/.bashrc

## Getting Started

Lets create a new folder for our test project:

    mkdir test-project
    cd test-project

Lets use python 3.9. We can use pyenv to install it:

    pyenv install 3.9.16

We can create a `.python-version` file in the project which will auto
load and set us on 3.9 when we cd into this directory with:

    pyenv local 3.9.16
    cat .python-version

We can verify that we are using the correct python version:

    python --version

## Creating a virtualenv with venv

Before we can write code and install packages we need to create what's called a virtualenv. In the Python world
you can sorta think of this like a sandbox where anything you do in it is contained just in the virtual environment.

This will let us maintain separate versions of various packages if we need to.

Create the virtualenv:

    python -m venv .venv

This creates a folder called `.venv` which contains our virtual environment. We can activate it with the following:

    source .venv/bin/activate

Now all our python tools should be scoped to the virtualenv. Running:

    which python

Should show that our python is being sourced by the .venv folder. If you ever want to break free from the virtual environment
you can run:

    deactivate

## Using pip inside the virtual environment

Pip is used to install packages. It's important to note that if you have not activated the virtual environment you will be using your
global pip/python environment.

It is common to create a file called `requirements.txt` which contains our list of dependencies.

    touch requirements.txt

Lets install numpy, so add the following to `requirements.txt`:

    numpy==1.24.4

If you don't care about the version you could just say `numpy` but I recommend freezing the deps then which I describe later in this document. Now we can install things to the virtual environment with:

    pip install -r requirements.txt

We can validate that this worked by dropping into a python shell:

    python

Now lets import numpy:

```python
import numpy as np
exit()
```

Another way we can do this is by installing directly with pip, lets install a code formatter called `black`:

    pip install black

The issue here though is if we want to pull the project down again we need to remember we installed this. We can leverage
a command called `pip freeze` to export our environment back to the `requirements.txt` file.

Go ahead and run:

    pip freeze

You'll see it also dumps out the transitive dependencies we would like to install as well. To avoid polluting our main `requirements.txt` file
I like to store the frozen deps in a different file, but that's up to you:

    pip freeze > requirements-frozen.txt

## Using VS Code

If you use VS code things should just work out of the box. You need to open the project while the virtual environment is activated:

    code .

The correct python version as well as the virtual environment should be shown at the bottom right. If you create a new python file called `main.py`
you should be able to insert the following program:

```python
import numpy as np
a = np.arange(15).reshape(3, 5)
print(a)
```

You should have auto complete setup automatically at this point.

# Common tools and libraries

## Code formatting

I recommend using `black`. You can install/use it with:

    pip install black
    black .

Don't forget to freeze it in your requirements file!

## Linting

I like `ruff`. You can install/use it with:

    pip install ruff
    ruff .

Don't forget to freeze it in your requirements file!

## Tests

I recommend `pytest`. Install it with:

    pip install pytest
    mkdir test
    touch test/my_test.py

Inside `my_test.py` add:

```python
def test_failure():
    assert False
```

Now you can run:

    pytest

And you should see failures.

## Typechecking

Lets use `mypy` to test do typechecking. VS Code ships with its own which works well but here's how we can
check things via the CLI:

    pip install mypy

Lets add this function to our `main.py` file:

```python
def type_checker_fail() -> int:
    return "Hello World"
```

Now run:

    mypy .

And you should see the type error.

## Debugging

Python ships with a library called pdb, you can use it in your code like:

    import pdb; pdb.set_trace()

Now just run your code and you'll drop into the debugger when you hit the trace point.
