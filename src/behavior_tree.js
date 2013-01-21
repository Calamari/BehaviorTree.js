/*globals Base */

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
        var node = this._rootNode;
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
      this._rootNode.end();
      this._started = false;
    },
    fail: function() {
      this._rootNode.end();
      this._started = false;
    }
  });
  BehaviorTree = Object.extend(BehaviorTree, {
    _registeredNodes: {},
    register: function(name, node) {
      this._registeredNodes[name] = node;
    },
    getNode: function(name) {
      return this._registeredNodes[name];
    }
  });

  exports.BehaviorTree = BehaviorTree;
}(window));
