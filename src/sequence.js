/* global BehaviorTree */
(function(exports) {
  'use strict';
  var Sequence = exports.BranchNode.extend({
    _run: function() {
      if (this._nodeRunning) {
        this._nodeRunning.run(this._object);
      } else {
        this.base();
      }
    },
    success: function() {
      this.base();
      this._actualTask += 1;
      if (this._actualTask < this.children.length) {
        this._run(this._object);
      } else {
        this._control.success();
      }
    },
    fail: function() {
      this.base();
      this._control.fail();
    }
  });

  exports.Sequence = Sequence;
}(BehaviorTree));
