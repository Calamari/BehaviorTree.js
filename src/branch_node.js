/*globals Base */

(function(exports) {
  var BranchNode = exports.Node.extend({
    constructor: function(config) {
      this.base(config);
      this.children = this.nodes || [];
    },
    canRun: function() {
      return this.children.length > 0;
    }
  });

  exports.BranchNode = BranchNode;
}(BehaviorTree));
