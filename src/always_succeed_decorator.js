/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var AlwaysSucceedDecorator = exports.Decorator.extend({
    success: function() {
      this._control.success();
    },
    fail: function() {
      this._control.success();
    },
  });

  exports.AlwaysSucceedDecorator = AlwaysSucceedDecorator;
}(BehaviorTree));
