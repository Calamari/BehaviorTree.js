/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var AlwaysFailDecorator = exports.Decorator.extend({
    success: function() {
      this._control.fail();
    },
    fail: function() {
      this._control.fail();
    },
  });

  exports.AlwaysFailDecorator = AlwaysFailDecorator;
}(BehaviorTree));
