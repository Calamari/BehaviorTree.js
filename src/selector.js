/*globals Base */

(function(exports) {
  var Selector = exports.BranchNode.extend({
    success: function() {
      this.base();
      this._control.success();
    },
    fail: function() {
      this.base();
      ++this._actualTask;
      if (this._actualTask < this.children.length) {
        this._run();
      } else {
        this._control.fail();
      }
    }
  });

  exports.Selector = Selector;
}(BehaviorTree));
