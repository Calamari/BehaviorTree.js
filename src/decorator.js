/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var Decorator = function(config){
    config = config || {}
    exports.Node.call(this, config);
    if (config.node) {
      this.node = BehaviorTree.getNode(config.node);
    }
  }
  Decorator.prototype = new exports.Node();

  Decorator.prototype.setNode = function(node){
    this.node = BehaviorTree.getNode(node);
  }

  Decorator.prototype.start = function(){
    this.node.setControl(this);
    this.node.start();
  }

  Decorator.prototype.end = function(){
    this.node.end();
  }

  Decorator.prototype.run = function(blackboard){
    this.node.run(blackboard);
  }

  exports.Decorator = Decorator;
}(BehaviorTree));
