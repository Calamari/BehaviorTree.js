# BehaviorTree.js

An JavaScript implementation of Behavior Trees. They are useful for implementing AIs. If you want need more information about Behavior Trees, look on [GameDevAI](http://aigamedev.com), there is a nice [video about Behavior Trees from Alex Champandard](http://aigamedev.com/open/article/behavior-trees-part1/).

## Features

* The needed: Sequences, Selectors, Tasks
* The extended: Decorators, Filters, Lookup tables, Conditions

## Installation

*coming soon*

## How to use

*coming soon*

## Contributing

*coming soon*

## Running tests

To initialize the testing, you have two choices:

1. If you have `bundler` installed, just run the `bundle` command in your shell.
2. Or install [jasmine](http://pivotal.github.com/jasmine/) by hand: `gem install jasmine`. If you want to run your tests without a browser also install the headless webkit using: `gem install jasmine-headless-webkit`.

Done this you also have two choices. You can either run the **test in the browser**:

    rake jasmine
    open http://localhost:8888

or **directly in the shell** (if you have done step 1. or the full step 2.):

    jasmine-webkit-headless -c

## License

Copyright (C) 2013 Georg Tavonius

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
