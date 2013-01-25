/*globals Base */

/**
  TODO next things:
    - (allow returning constants instead of success, fail and running methods)
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
      if (this._nodeRunning) {
        // TODO: test with mutliple, because setControl might be neccessary to be called here
        this._nodeRunning.run(this._object);
        this._nodeRunning = null;
      } else {
        var node = BehaviorTree.getNode(this._rootNode);
        this._actualNode = node;
        if (node.canRun(this._object)) {
          node.setControl(this);
          node.start();
          node.run(this._object);
        }
      }
    },
    running: function(runningNode) {
      this._nodeRunning = runningNode;
      this._started = false;
    },
    success: function() {
      this._actualNode.end();
      this._started = false;
    },
    fail: function() {
      this._actualNode.end();
      this._started = false;
    }
  });
  BehaviorTree = Object.extend(BehaviorTree, {
    _registeredNodes: {},
    register: function(name, node) {
      this._registeredNodes[name] = node;
    },
    getNode: function(name) {
      var node = name instanceof BehaviorTree.Node ? name : this._registeredNodes[name];
      if (!node) {
        console.log('The node "' + name + '" could not be looked up. Maybe it was never registered?');
      }
      return node;
    }
  });

  exports.BehaviorTree = BehaviorTree;
}(window));
