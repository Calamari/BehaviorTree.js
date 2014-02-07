/* global BehaviorTree */
(function(exports) {
  'use strict';

  var BranchNode = function(config){
    config = config || {}
    exports.Node.call(this, config);
    this.children = config.nodes || [];
  }
  BranchNode.prototype = new exports.Node();

  BranchNode.prototype.start = function(){
    this._actualTask = 0;
  }

  BranchNode.prototype.run = function(object){
    this._object = object;
    this.start();
    if (this._actualTask < this.children.length) {
      this._run();
    }
    this.end();
  }

  BranchNode.prototype._run = function(){
    var node = exports.getNode(this.children[this._actualTask]);
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
  }

  BranchNode.prototype.fail = function(){
    this._nodeRunning = null;
    this._runningNode.end(this._object);
  }

  exports.BranchNode = BranchNode;
}(BehaviorTree));
