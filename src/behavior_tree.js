/*globals Base */

/**
  TODO next things:
    - rename Selector to Priority
    - random selector
    - decorator node
    - condition node
    - make/script for minifying and compiling
*/
(function(exports) {
  var countUnnamed = 0;
  var BehaviorTree = Base.extend({
    constructor: function(config) {
      this.title = config.title || 'btree' + (++countUnnamed);
      this._rootNode = config.tree;
      this._object = config.object;
    },
    setObject: function(obj) {
      this._object = obj;
    },
    step: function() {
      if (this._started) {
        console.log('the BehaviorTree "' + this.title + '" did call step but one Task did not finish on last call of step.');
      }
      this._started = true;
      var node = BehaviorTree.getNode(this._rootNode);
      this._actualNode = node;
      node.setControl(this);
      node.start(this._object);
      node.run(this._object);
    },
    running: function(runningNode) {
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
      console.log('The node "' + name + '" could not be looked up. Maybe it was never registered?');
    }
    return node;
  };

  exports.BehaviorTree = BehaviorTree;
}(window));
