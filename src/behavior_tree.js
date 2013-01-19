/*globals Base */

(function(exports) {
  var BehaviorTree = Base.extend({
    constructor: function() {},
    step: function() {}
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
