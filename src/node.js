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
    run: function() {},
    setControl: function(control) {
      this._control = control;
    },
    success: function() {
      this._control.success();
    },
    fail: function() {
      this._control.fail();
    }
  });

  exports.Node = Node;
}(BehaviorTree));
