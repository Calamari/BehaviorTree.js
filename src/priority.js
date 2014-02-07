/* global BehaviorTree */
(function(exports) {
  'use strict';

  var Priority = function(config){
    exports.BranchNode.call(this, config);
  }
  Priority.prototype = new exports.BranchNode();

  Priority.prototype.success = function(){
    exports.BranchNode.prototype.success.apply(this, arguments);
    this._control.success();
  }

  Priority.prototype.fail = function(){
    exports.BranchNode.prototype.fail.apply(this, arguments);
    this._actualTask += 1;
    if (this._actualTask < this.children.length) {
      this._run(this._object);
    } else {
      this._control.fail();
    }
  }

  exports.Priority = Priority;
}(BehaviorTree));
