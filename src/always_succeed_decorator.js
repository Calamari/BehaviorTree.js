/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var AlwaysSucceedDecorator = function(config){
    exports.Decorator.call(this, config);
  }
  AlwaysSucceedDecorator.prototype = new exports.Decorator();

  AlwaysSucceedDecorator.prototype.success = function(){
    this._control.success();
  }

  AlwaysSucceedDecorator.prototype.fail = function(){
    this._control.success();
  }

  exports.AlwaysSucceedDecorator = AlwaysSucceedDecorator;
}(BehaviorTree));
