(function(exports) {
  "use strict";
  var Priority = exports.BranchNode.extend({
    success: function() {
      this.base();
      this._control.success();
    },
    fail: function() {
      this.base();
      ++this._actualTask;
      if (this._actualTask < this.children.length) {
        this._run(this._object);
      } else {
        this._control.fail();
      }
    }
  });

  exports.Priority = Priority;
}(BehaviorTree));
