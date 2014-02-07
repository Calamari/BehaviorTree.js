/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var AlwaysFailDecorator = function(config){
    exports.Decorator.call(this, config);
  }
  AlwaysFailDecorator.prototype = new exports.Decorator();

  AlwaysFailDecorator.prototype.success = function(){
    this._control.fail();
  }

  AlwaysFailDecorator.prototype.fail = function(){
    this._control.fail();
  }

  exports.AlwaysFailDecorator = AlwaysFailDecorator;
}(BehaviorTree));
