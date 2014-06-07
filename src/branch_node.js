/* global BehaviorTree */
(function(exports) {
  'use strict';

  var BranchNode = function(config){
    exports.Node.call(this, config);
  }
  BranchNode.prototype = new exports.Node();

  BranchNode.prototype.start = function(){
    this._actualTask = 0;
  }

  BranchNode.prototype.run = function(object){
    this._object = object;
    this.start();
    if (this._actualTask < this.nodes.length) {
      this._run();
    }
    this.end();
  }

  BranchNode.prototype._run = function(){
    var node = exports.getNode(this.nodes[this._actualTask]);
    this._runningNode = node;
    node.setControl(this);
    node.start(this._object);
    node.run(this._object);
  }

  BranchNode.prototype.running = function(node){
    this._nodeRunning = node;
    this._control.running(node);
  }

  BranchNode.prototype.success = function(){
    this._nodeRunning = null;
    this._runningNode.end(this._object);
    this._runningNode = null;
  }

  BranchNode.prototype.fail = function(){
    this._nodeRunning = null;
    this._runningNode.end(this._object);
    this._runningNode = null;
  }

  exports.BranchNode = BranchNode;
}(BehaviorTree));
