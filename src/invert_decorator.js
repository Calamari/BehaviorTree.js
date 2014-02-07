/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var InvertDecorator = function(config){
    exports.Decorator.call(this, config);
  }
  InvertDecorator.prototype = new exports.Decorator();

  InvertDecorator.prototype.success = function(){
    this._control.fail();
  }

  InvertDecorator.prototype.fail = function(){
    this._control.success();
  }

  exports.InvertDecorator = InvertDecorator;
}(BehaviorTree));
