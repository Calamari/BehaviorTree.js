/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var InvertDecorator = exports.Decorator.extend({
    success: function() {
      this._control.fail();
    },
    fail: function() {
      this._control.success();
    },
  });

  exports.InvertDecorator = InvertDecorator;
}(BehaviorTree));
