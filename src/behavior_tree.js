/**
 * BehaviorTree.js
 * https://github.com/Calamari/BehaviorTree.js
 *
 * Copyright 2013, Georg Tavonius
 * Licensed under the MIT license.
 *
 * Version: 0.9.3
 */

var countUnnamed = 0,
    BehaviorTree;

BehaviorTree = require('../lib/base').extend({
  constructor: function(config) {
    countUnnamed += 1;
    this.title = config.title || 'btree' + (countUnnamed);
    this._rootNode = config.tree;
    this._object = config.object;
  },
  setObject: function(obj) {
    this._object = obj;
  },
  step: function() {
    if (this._started) {
      throw new Error('the BehaviorTree "' + this.title + '" did call step but one Task did not finish on last call of step.');
    }
    this._started = true;
    var node = BehaviorTree.getNode(this._rootNode);
    this._actualNode = node;
    node.setControl(this);
    node.start(this._object);
    node.run(this._object);
  },
  running: function() {
    this._started = false;
  },
  success: function() {
    this._actualNode.end(this._object);
    this._started = false;
  },
  fail: function() {
    this._actualNode.end(this._object);
    this._started = false;
  }
});
BehaviorTree._registeredNodes = {};
BehaviorTree.register = function(name, node) {
  if (typeof name === 'string') {
    this._registeredNodes[name] = node;
  } else {
    // name is the node
    this._registeredNodes[name.title] = name;
  }
};
BehaviorTree.getNode = function(name) {
  var node = name instanceof BehaviorTree.Node ? name : this._registeredNodes[name];
  if (!node) {
    throw new Error('The node "' + name + '" could not be looked up. Maybe it was never registered?');
  }
  return node;
};

module.exports = BehaviorTree;
