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
