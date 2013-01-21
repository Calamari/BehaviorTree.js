/*globals Base */

(function(exports) {
  var Node = Base.extend({
    constructor: function(config) {
      // let config override instance properties
      this.base(config);
    },
    canRun: function() {
      return true;
    },
    start: function() {},
    end: function() {},
    run: function() { console.log("Warning: run of " + this.title + " not implemented!"); this.fail(); },
    setControl: function(control) {
      this._control = control;
    },
    running: function() {
      this._control.running(this);
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
