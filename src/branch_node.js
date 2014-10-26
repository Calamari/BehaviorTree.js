
var BehaviorTree = require('./behavior_tree');

module.exports = require('./node').extend({
  constructor: function(config) {
    this.base(config);
    this.children = this.nodes || [];
  },
  start: function() {
    this._actualTask = 0;
  },
  run: function(object) {
    this._object = object;
    this.start();
    if (this._actualTask < this.children.length) {
      this._run();
    }
    this.end();
  },
  _run: function() {
    var node = BehaviorTree.getNode(this.children[this._actualTask]);
    this._runningNode = node;
    node.setControl(this);
    node.start(this._object);
    node.run(this._object);
  },
  running: function(node) {
    this._nodeRunning = node;
    this._control.running(node);
  },
  success: function() {
    this._nodeRunning = null;
    this._runningNode.end(this._object);
  },
  fail: function() {
    this._nodeRunning = null;
    this._runningNode.end(this._object);
  }
});
