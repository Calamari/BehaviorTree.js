/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var Random = exports.BranchNode.extend({
    start: function() {
      this.base();
      if (!this._nodeRunning) {
        this._actualTask = Math.floor(Math.random()*this.children.length);
      }
    },
    success: function() {
      this.base();
      this._control.success();
    },
    fail: function() {
      this.base();
      this._control.fail();
    },
    _run: function() {
      if (!this._runningNode) {
        this.base();
      } else {
        this._runningNode.run(this._object);
      }
    }
  });

  exports.Random = Random;
}(BehaviorTree));
