/*globals Base */

(function(exports) {
  var BehaviorTree = Base.extend({
    constructor: function() {},
    step: function() {}
  });
  BehaviorTree.registeredNodes = [];
  BehaviorTree.register = function() {};

  exports.BehaviorTree = BehaviorTree;
}(window));
