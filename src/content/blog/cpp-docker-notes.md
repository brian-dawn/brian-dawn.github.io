---
title: "Docker C++ Notes"
description: "Lorem ipsum dolor sit amet"
pubDate: "Dec 17 2020"
banner: "/planet05.png"
---

This document assumes you know docker, cmake, and use VS code for development.

# Why use docker for local development?

Here's how I manage a C++ application with docker containers. It's very important to me that I get
auto complete within vs code for this.

# The project

We're just going to be running the Ceres [helloworld](https://ceres-solver.googlesource.com/ceres-solver/+/master/examples/helloworld.cc).

First create a folder we can work in. Create `src/main.cpp` with the following contents:

```cpp
// Ceres Solver - A fast non-linear least squares minimizer
// Copyright 2015 Google Inc. All rights reserved.
// http://ceres-solver.org/
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
// * Neither the name of Google Inc. nor the names of its contributors may be
//   used to endorse or promote products derived from this software without
//   specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
// Author: keir@google.com (Keir Mierle)
//
// A simple example of using the Ceres minimizer.
//
// Minimize 0.5 (10 - x)^2 using jacobian matrix computed using
// automatic differentiation.
#include "ceres/ceres.h"
#include "glog/logging.h"
using ceres::AutoDiffCostFunction;
using ceres::CostFunction;
using ceres::Problem;
using ceres::Solve;
using ceres::Solver;
// A templated cost functor that implements the residual r = 10 -
// x. The method operator() is templated so that we can then use an
// automatic differentiation wrapper around it to generate its
// derivatives.
struct CostFunctor {
  template <typename T>
  bool operator()(const T* const x, T* residual) const {
    residual[0] = 10.0 - x[0];
    return true;
  }
};
int main(int argc, char** argv) {
  google::InitGoogleLogging(argv[0]);
  // The variable to solve for with its initial value. It will be
  // mutated in place by the solver.
  double x = 0.5;
  const double initial_x = x;
  // Build the problem.
  Problem problem;
  // Set up the only cost function (also known as residual). This uses
  // auto-differentiation to obtain the derivative (jacobian).
  CostFunction* cost_function =
      new AutoDiffCostFunction<CostFunctor, 1, 1>(new CostFunctor);
  problem.AddResidualBlock(cost_function, nullptr, &x);
  // Run the solver!
  Solver::Options options;
  options.minimizer_progress_to_stdout = true;
  Solver::Summary summary;
  Solve(options, &problem, &summary);
  std::cout << summary.BriefReport() << "\n";
  std::cout << "x : " << initial_x << " -> " << x << "\n";
  return 0;
}
```

Next create `CMakeLists.txt` with the following contents:

```cmake
cmake_minimum_required (VERSION 2.8.11)
project (Example)

FIND_PACKAGE(Eigen3 REQUIRED)
FIND_PACKAGE(OpenMP REQUIRED)
FIND_PACKAGE(BLAS REQUIRED)
FIND_PACKAGE(Ceres REQUIRED)

INCLUDE_DIRECTORIES(${CERES_INCLUDE_DIRS})
INCLUDE_DIRECTORIES(${EIGEN3_INCLUDE_DIR})

FILE(GLOB SOURCES "src/*.cpp")

ADD_EXECUTABLE(example ${SOURCES})

TARGET_LINK_LIBRARIES(example ${CERES_LIBRARIES})
```

You can try building this if you wish, but we'll be using Docker to do it that way we can gurantee
we have all the correct dependencies.

# The dockerfile

I fully take advantage of multi-stage docker builds. This lets use have a lean(er) result image.
If you're not familiar with them check this [out](https://docs.docker.com/develop/develop-images/multistage-build/).

Next lets create our `Dockerfile`.

```dockerfile
# Setup the base image. This is where we'll setup
# dependencies necessary for building our project.

FROM ubuntu:20.04 AS dev-base

RUN apt-get update                             \
    && DEBIAN_FRONTEND=noninteractive          \
    apt-get install --no-install-recommends -y \
    build-essential                            \
    gdb                                        \
    gcc                                        \
    g++                                        \
    cmake                                      \
    libeigen3-dev                              \
    libblas-dev                                \
    libceres-dev                               \
    libgoogle-glog-dev                         \
    && apt-get clean autoclean                 \
    && apt-get autoremove --yes                \
    && rm -rf /var/lib{apt,dpkg,cache,log}

# This is the lean and mean release image. Ideally
# we would use something like alpine instead of
# Ubuntu but here we are.

FROM ubuntu:20.04 AS release-base

RUN apt-get update                             \
    && DEBIAN_FRONTEND=noninteractive          \
    apt-get install --no-install-recommends -y \
    libblas3                                   \
    libceres1                                  \
    && apt-get clean autoclean                 \
    && apt-get autoremove --yes                \
    && rm -rf /var/lib{apt,dpkg,cache,log}

# The compile step.

FROM dev-base AS compiled

COPY . /code
WORKDIR /code/build
RUN cmake .. && make -j$(nproc --all)

# The release step.

FROM release-base AS release

COPY --from=compiled /code/build/example /usr/local/bin/example
CMD /usr/local/bin/example
```

We should be able to use docker to build it at this point:

    docker build -t example .

And when that completes we should be able to run it:

    docker run -it example

# The dev container

Now we ideally want to be able to run VS code with the CPP extension setup so we get
autocomplete.

To do this we'll utilize [dev containers](https://code.visualstudio.com/docs/remote/containers).

Create `.devcontainer/devcontainer.json` with the following contents:

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the README at:
// https://github.com/microsoft/vscode-dev-containers/tree/v0.154.0/containers/docker-existing-dockerfile
{
  "name": "Example dev project",

  // Sets the run context to one level up instead of the .devcontainer folder.
  "context": "..",

  // Update the 'dockerFile' property if you aren't using the standard 'Dockerfile' filename.
  "dockerFile": "../Dockerfile",

  // Set *default* container specific settings.json values on container create.
  "settings": {
    "terminal.integrated.shell.linux": null
  },

  // Add the IDs of extensions you want installed when the container is created.
  "extensions": ["ms-vscode.cpptools", "ms-vscode.cmake-tools"],

  "build": {
    "target": "dev-base"
  },

  // Uncomment when using a ptrace-based debugger like C++, Go, and Rust
  "runArgs": ["--cap-add=SYS_PTRACE", "--security-opt", "seccomp=unconfined"]
}
```

Now when you launch vs code from this project you should get the option to start things in
a dev container. Alternatively you can run the `Remote-Containers: Reopen in Container` command.

You should now have a full CPP dev environment good to go. You should even be able to set breakpoints and run the debugger with the `CMake: Debug` command.

For a full example I have a repo [here](https://github.com/brian-dawn/cpp-dev-container-demo).
