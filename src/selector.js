/*globals Base */

(function(exports) {
  var Selector = Base.extend({
    constructor: function(config) {
      this.children = [];
    },
    canRun: function() {},
    start: function() {},
    end: function() {},
    run: function() {}
  });

  exports.Selector = Selector;
}(BehaviorTree));
