/* global BehaviorTree */
(function(exports) {
  'use strict';

  var Sequence = function(config){
    exports.BranchNode.call(this, config);
  }
  Sequence.prototype = new exports.BranchNode();

  Sequence.prototype._run = function(){
    if (this._nodeRunning) {
      this._nodeRunning.run(this._object);
      this._nodeRunning = null;
    } else {
      exports.BranchNode.prototype._run.apply(this, arguments);
    }
  }

  Sequence.prototype.success = function(){
    exports.BranchNode.prototype.success.apply(this, arguments);
    this._actualTask += 1;
    if (this._actualTask < this.children.length) {
      this._run(this._object);
    } else {
      this._control.success();
    }
  }

  Sequence.prototype.fail = function(){
    exports.BranchNode.prototype.fail.apply(this, arguments);
    this._control.fail();
  }

  exports.Sequence = Sequence;
}(BehaviorTree));
