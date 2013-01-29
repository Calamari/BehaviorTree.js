# BehaviorTree.js

An JavaScript implementation of Behavior Trees. They are useful for implementing AIs. If you need more information about Behavior Trees, look on [GameDevAI](http://aigamedev.com), there is a nice [video about Behavior Trees from Alex Champandard](http://aigamedev.com/open/article/behavior-trees-part1/). There is also a nice read of [Björn Knafla](http://www.altdevblogaday.com/author/bjoern-knafla/) explaining how [explaining how Behavior Trees work](http://www.altdevblogaday.com/2011/02/24/introduction-to-behavior-trees/).

## Features

* Only 2.5 kb minifed JavaScript code
* The needed: Sequences selector, Priority selectors, Tasks
* The extended (coming soon): Decorators, Filters, Lookup tables, Conditions

## Installation

There is a `btree.min.js` file in the root directory of this package. You can use this in your project, like so:

    <script src="btree.min.js"></script>

If you happen to fiddle around in the codebase and need a minified version of your modified version, you can minify the code through a rake task provided in this package.

    bundle
    rake minify

Or if you do not have `bundler` installed, you can install the needed gem for minification by yourself and then run the rake task:

  gem install uglifier
  rake minify

## Dependency

This behavior tree implementation depends on [Dean Edward](http://dean.edwards.name/)'s [base class](http://dean.edwards.name/base/Base.js). You need to load this prior to loading the `btree.min.js`. Thanks Dean for that great class implementation.

## How to use

### Creating a simple task

A task is a simple `Node` (to be precise a leafnode), which takes care of all the dirty wirk in it's `run` method, which calls `success()`, `fail()` or `running()` in the end.

    var mytask = new BehaviorTree.Task({
      // (optional) this function is called directly before the run method
      // is called. It allows you to setup things before starting to run
      // Beware: if task is resumed after calling this.running(), start is not called.
      start: function(obj) { obj.isStarted = true; },

      // (optional) this function is called directly after the run method
      // is completed with either this.success() or this.fail(). It allows you to clean up
      // things, after you run the task.
      end: function(obj) { obj.isStarted = false; },

      // This is the meat of your task. The run method does everything you want it to do.
      // Finish it with one of these method calls:
      // this.success() - The task did run successfully
      // this.fail()    - The task did fail
      // this.running() - The task is still running and will be called directly from parent sequence
      run: function(obj) {
        this.success();
      }
    });

The methods:

* `start`  - Called before run is called. But not if task is resuming after ending with this.running().
* `end`    - Called after run is called. But not if task finished with this.running().
* `run`    - Contains the main things you want the task is doing.

The interesting part:

* the argument for all this methods is the object you pass in into the instance of `BehaviorTree` with the `setObject` method. This could be the object you want the behavior tree to control.

### Creating a sequence

A `Sequence` will call every of it's subnodes one after each other until one node calls `fail()` or all nodes were called. If one node calls `fail()` the `Sequence` will call `fail()` too, else it will call `success()`.

    var mysequence = new BehaviorTree.Sequence({
      title: 'my sequence',
      nodes: [
        // here comes in a list of nodes (Tasks, Sequences or Selectors)
        // as objects or as registered strings
      ]
    });

### Creating a selector

A `Selector` calls every node in it's list until one node calls `success()`, then itself calls success internally. If none subnode calls `success()` the selector itself calls `fail()`.

    var myselector = new BehaviorTree.Selector({
      title: 'my selector',
      nodes: [
        // here comes in a list of nodes (Tasks, Sequences or Selectors)
        // as objects or as registered strings
      ]
    });

### Creating a behavior tree

Creating a behavior tree is fairly simple. Just instantiate the `BehaviorTree` class and put in a `Node` (or more probably a `BranchingNode`, like a `Sequence` or `Selector`) in the `tree` parameter.

    var mytree = new BehaviorTree({
      title: 'tree1',  // this is optional but useful if error happens
      tree: 'a selector' // the value of tree can be either string (which is the registered name of a node), or any node
    });

### Run through the behavior tree

Before you let the tree do it's work you can add an object to the tree. This object will be passed into every `start()`, `end()` and `run()` method as first argument. You can use it, to let the Behavior tree know, on which object (e.g. artificial player) it is running. After this just call `step()` whenever you have time for some AI calculations in your game loop.

    mytree.setObject(someBot);
    // do this in a loop:
    mytree.step();

### Using a lookup table for your tasks

If you need the same nodes multiple times in a tree (or even in different trees), there is an easy method to register this nodes, so you can simply reference it by given name.

    // register a task:
    BehaviorTree.register('testtask', mytask);
    // or register a sequence or selector:
    BehaviorTree.register('test sequence', mysequence);

Now you can simply use

### Now putting it all together

And now an example of how all could work together.

    BehaviorTree.register('bark', new BehaviorTree.Task({
      title: 'bark',
      run: function(dog) {
        dog.bark();
        this.success();
      }
    }));

    var btree = new BehaviorTree({
      title: 'dog behaviors',
      tree: new Behavior.Sequence({
        nodes: [
          'bark',
          new BehaviorTree.Task({
            title: 'walk',
            run: function(dog) {
              dog.randomlyWalk();
              this.success();
            }
          }),
          'bark',
          new BehaviorTree.Task({
            title: 'mark tree',
            run: function(dog) {
              if (dog.standBesideATree()) {
                dog.liftALeg();
                dog.pee();
                this.success();
              } else {
                this.fail();
              }
            }
          }),

        ]
      })
    });

    var dog = new Dog(/*...*/); // the nasty details of a dog are omitted

    btree.setObject(dog);
    setInterval(function() {
      btree.step();
    }, 1000/60);

In this example the following happens: each pass on the setInterval (our game loop), the dog barks – we implemented this with a registered node, because we do this twice – then it walks randomly around, then it barks again and then if it find's itself standing beside a tree it pees on the tree.

## Contributing

If you want to contribute? If you have some ideas or critics, just open an issue, here on github. If you want to get your hands dirty, you can fork this repo. But note: If you write code, don't forget to write tests. And then make a pull request. I'll be happy to see what's coming.

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
