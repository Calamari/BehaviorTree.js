
var BehaviorTree = require('./behavior_tree');

module.exports = require('./node').extend({
  constructor: function(config) {
    // let config override instance properties
    this.base(config);
    if (this.node) {
      this.node = BehaviorTree.getNode(this.node);
    }
  },
  setNode: function(node) {
    this.node = BehaviorTree.getNode(node);
  },
  start: function() {
    this.node.setControl(this);
    this.node.start();
  },
  end: function() {
    this.node.end();
  },
  run: function(blackboard) {
    this.node.run(blackboard);
  },
});
