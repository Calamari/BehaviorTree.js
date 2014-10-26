
module.exports = require('../lib/base').extend({
  constructor: function(config) {
    // let config override instance properties
    this.base(config);
  },
  start: function() {},
  end: function() {},
  run: function() { throw new Error('Warning: run of ' + this.title + ' not implemented!'); },
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
