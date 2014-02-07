/**
 * BehaviorTree.js
 * https://github.com/Calamari/BehaviorTree.js
 *
 * Copyright 2013, Georg Tavonius
 * Licensed under the MIT license.
 *
 * Version: 0.9.2
 */

(function(exports) {
  /*globals Base */
  'use strict';

  var countUnnamed = 0;

  function BehaviorTree(config){
    countUnnamed += 1;
    this.title = config.title || 'btree' + (countUnnamed);
    this._rootNode = config.tree;
    this._object = config.object;
  };

  BehaviorTree.prototype.setObject = function(obj){
    this._object = obj;
  }

  BehaviorTree.prototype.step = function(){
    if (this._started) {
      console.log('the BehaviorTree "' + this.title + '" did call step but one Task did not finish on last call of step.');
    }
    this._started = true;
    var node = BehaviorTree.getNode(this._rootNode);
    this._actualNode = node;
    node.setControl(this);
    node.start(this._object);
    node.run(this._object);
  }

  BehaviorTree.prototype.running = function(){
    this._started = false;
  }

  BehaviorTree.prototype.success = function(){
    this._actualNode.end(this._object);
    this._started = false;
  }

  BehaviorTree.prototype.fail = function(){
    this._actualNode.end(this._object);
    this._started = false;
  }

  var _registeredNodes = {};
  BehaviorTree.register = function(name, node) {
    if (typeof name === 'string') {
      _registeredNodes[name] = node;
    } else {
      // name is the node
      _registeredNodes[name.title] = name;
    }
  };

  BehaviorTree.getNode = function(name) {
    var node = name instanceof BehaviorTree.Node ? name : _registeredNodes[name];
    if (!node) {
      console.log('The node "' + name + '" could not be looked up. Maybe it was never registered?');
    }
    return node;
  };

  exports.BehaviorTree = BehaviorTree;
}(window));
(function(exports) {/* globals BehaviorTree */

  'use strict';
  var Node = function(config){
    config = config || {}
    this.title = config.title;
    if(config.nodes){
      this.nodes = config.nodes;
    }
    if(config.success){
      this.success = config.success
    }
    if(config.fail){
      this.fail = config.fail
    }
    if(config.running){
      this.running = config.running
    }
    if(config.start){
      this.start = config.start
    }
    if(config.end){
      this.end = config.end
    }
    if(config.run){
      this.run = config.run
    }
  }

  Node.prototype.start = function(){}
  Node.prototype.end = function(){}

  Node.prototype.run = function(){
    console.log('Warning: run of ' + this.title + ' not implemented!'); this.fail();
  }

  Node.prototype.setControl = function(control){
    this._control = control;
  }

  Node.prototype.running = function(){
    this._control.running(this);
  }
  
  Node.prototype.success = function(){
    this._control.success();
  }

  Node.prototype.fail = function(){
    this._control.fail();
  }

  exports.Node = Node;

/* global BehaviorTree */

  'use strict';

  var BranchNode = function(config){
    config = config || {}
    exports.Node.call(this, config);
    this.children = config.nodes || [];
  }
  BranchNode.prototype = new exports.Node();

  BranchNode.prototype.start = function(){
    this._actualTask = 0;
  }

  BranchNode.prototype.run = function(object){
    this._object = object;
    this.start();
    if (this._actualTask < this.children.length) {
      this._run();
    }
    this.end();
  }

  BranchNode.prototype._run = function(){
    var node = exports.getNode(this.children[this._actualTask]);
    this._runningNode = node;
    node.setControl(this);
    node.start(this._object);
    node.run(this._object);
  }

  BranchNode.prototype.running = function(node){
    this._nodeRunning = node;
    this._control.running(node);
  }

  BranchNode.prototype.success = function(){
    this._nodeRunning = null;
    this._runningNode.end(this._object);
  }

  BranchNode.prototype.fail = function(){
    this._nodeRunning = null;
    this._runningNode.end(this._object);
  }

  exports.BranchNode = BranchNode;

/* global BehaviorTree */

  'use strict';

  var Priority = function(config){
    exports.BranchNode.call(this, config);
  }
  Priority.prototype = new exports.BranchNode();

  Priority.prototype.success = function(){
    exports.BranchNode.prototype.success.apply(this, arguments);
    this._control.success();
  }

  Priority.prototype.fail = function(){
    exports.BranchNode.prototype.fail.apply(this, arguments);
    this._actualTask += 1;
    if (this._actualTask < this.children.length) {
      this._run(this._object);
    } else {
      this._control.fail();
    }
  }

  exports.Priority = Priority;

/* global BehaviorTree */

  'use strict';

  var Sequence = function(config){
    exports.BranchNode.call(this, config);
  }
  Sequence.prototype = new exports.BranchNode();

  Sequence.prototype._run = function(){
    if (this._nodeRunning) {
      this._nodeRunning.run(this._object);
      this._nodeRunning = null;
    } else {
      exports.BranchNode.prototype._run.apply(this, arguments);
    }
  }

  Sequence.prototype.success = function(){
    exports.BranchNode.prototype.success.apply(this, arguments);
    this._actualTask += 1;
    if (this._actualTask < this.children.length) {
      this._run(this._object);
    } else {
      this._control.success();
    }
  }

  Sequence.prototype.fail = function(){
    exports.BranchNode.prototype.fail.apply(this, arguments);
    this._control.fail();
  }

  exports.Sequence = Sequence;

/* globals BehaviorTree */

  'use strict';

  var Random = function(config){
    exports.BranchNode.call(this, config);
  }
  Random.prototype = new exports.BranchNode();

  Random.prototype.start = function(){
    exports.BranchNode.prototype.start.apply(this, arguments);
    if (!this._nodeRunning) {
      this._actualTask = Math.floor(Math.random()*this.children.length);
    }
  }

  Random.prototype._run = function(){
    if (!this._runningNode) {
      exports.BranchNode.prototype._run.call(this);
    } else {
      this._runningNode.run(this._object);
    }
  }

  Random.prototype.success = function(){
    exports.BranchNode.prototype.success.apply(this, arguments);
    this._control.success();
  }

  Random.prototype.fail = function(){
    exports.BranchNode.prototype.fail.apply(this, arguments);
    this._control.fail();
  }

  exports.Random = Random;

/* global BehaviorTree */

  'use strict';
  exports.Task = exports.Node;

/* globals BehaviorTree */

  'use strict';

  var Decorator = function(config){
    config = config || {}
    exports.Node.call(this, config);
    if (config.node) {
      this.node = BehaviorTree.getNode(config.node);
    }
  }
  Decorator.prototype = new exports.Node();

  Decorator.prototype.setNode = function(node){
    this.node = BehaviorTree.getNode(node);
  }

  Decorator.prototype.start = function(){
    this.node.setControl(this);
    this.node.start();
  }

  Decorator.prototype.end = function(){
    this.node.end();
  }

  Decorator.prototype.run = function(blackboard){
    this.node.run(blackboard);
  }

  exports.Decorator = Decorator;

/* globals BehaviorTree */

  'use strict';

  var InvertDecorator = function(config){
    exports.Decorator.call(this, config);
  }
  InvertDecorator.prototype = new exports.Decorator();

  InvertDecorator.prototype.success = function(){
    this._control.fail();
  }

  InvertDecorator.prototype.fail = function(){
    this._control.success();
  }

  exports.InvertDecorator = InvertDecorator;

/* globals BehaviorTree */

  'use strict';

  var AlwaysSucceedDecorator = function(config){
    exports.Decorator.call(this, config);
  }
  AlwaysSucceedDecorator.prototype = new exports.Decorator();

  AlwaysSucceedDecorator.prototype.success = function(){
    this._control.success();
  }

  AlwaysSucceedDecorator.prototype.fail = function(){
    this._control.success();
  }

  exports.AlwaysSucceedDecorator = AlwaysSucceedDecorator;

/* globals BehaviorTree */

  'use strict';

  var AlwaysFailDecorator = function(config){
    exports.Decorator.call(this, config);
  }
  AlwaysFailDecorator.prototype = new exports.Decorator();

  AlwaysFailDecorator.prototype.success = function(){
    this._control.fail();
  }

  AlwaysFailDecorator.prototype.fail = function(){
    this._control.fail();
  }

  exports.AlwaysFailDecorator = AlwaysFailDecorator;

}(BehaviorTree));