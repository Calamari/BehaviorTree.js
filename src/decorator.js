/* globals BehaviorTree */
(function(exports) {
  'use strict';

  var Decorator = exports.Node.extend({
    constructor: function(config) {
      // let config override instance properties
      this.base(config);
      if (this.node) {
        this.node = exports.getNode(this.node);
      }
    },
    setNode: function(node) {
      this.node = exports.getNode(node);
    },
    start: function() {
      this.node.setControl(this);
      this.node.start();
    },
    end: function() {
      this.node.end();
    },
    run: function() {
      this.node.run();
    },
  });

  exports.Decorator = Decorator;
}(BehaviorTree));
