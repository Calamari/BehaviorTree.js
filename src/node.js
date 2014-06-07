/* globals BehaviorTree */
(function(exports) {
  'use strict';
  var Node = function(config){
    config = config || {}
    this.title = config.title;
    if(config.nodes){
      this.nodes = config.nodes;
    }
    if(config.success){
      this.success = config.success
    }
    if(config.fail){
      this.fail = config.fail
    }
    if(config.running){
      this.running = config.running
    }
    if(config.start){
      this.start = config.start
    }
    if(config.end){
      this.end = config.end
    }
    if(config.run){
      this.run = config.run
    }
  }

  Node.prototype.start = function(){}
  Node.prototype.end = function(){}

  Node.prototype.run = function(){
    console.log('Warning: run of ' + this.title + ' not implemented!'); this.fail();
  }

  Node.prototype.setControl = function(control){
    this._control = control;
  }

  Node.prototype.running = function(){
    this._control.running(this);
  }
  
  Node.prototype.success = function(){
    this._control.success();
  }

  Node.prototype.fail = function(){
    this._control.fail();
  }

  exports.Node = Node;
}(BehaviorTree));
