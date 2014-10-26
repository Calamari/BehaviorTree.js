
module.exports = require('./decorator').extend({
  success: function() {
    this._control.success();
  },
  fail: function() {
    this._control.success();
  },
});
