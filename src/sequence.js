/*globals Base */

(function(exports) {
  var Sequence = Base.extend({
    constructor: function(config) {
      this.children = [];
    },
    canRun: function() {},
    start: function() {},
    end: function() {},
    run: function() {}
  });

  exports.Sequence = Sequence;
}(BehaviorTree));
