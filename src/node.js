/*globals Base */

(function(exports) {
  var Node = Base.extend({
    constructor: function(config) {
      // let config override instance properties
      this.base(config);
    },
    canRun: function() {},
    start: function() {},
    end: function() {},
    run: function() {}
  });

  exports.Node = Node;
}(BehaviorTree));
