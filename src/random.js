/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var Random = function(config){
    exports.BranchNode.call(this, config);
  }
  Random.prototype = new exports.BranchNode();

  Random.prototype.start = function(){
    exports.BranchNode.prototype.start.apply(this, arguments);
    if (!this._nodeRunning) {
      this._actualTask = Math.floor(Math.random()*this.children.length);
    }
  }

  Random.prototype._run = function(){
    if (!this._runningNode) {
      exports.BranchNode.prototype._run.call(this);
    } else {
      this._runningNode.run(this._object);
    }
  }

  Random.prototype.success = function(){
    exports.BranchNode.prototype.success.apply(this, arguments);
    this._control.success();
  }

  Random.prototype.fail = function(){
    exports.BranchNode.prototype.fail.apply(this, arguments);
    this._control.fail();
  }

  exports.Random = Random;
}(BehaviorTree));
