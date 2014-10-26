
module.exports = require('./decorator').extend({
  success: function() {
    this._control.fail();
  },
  fail: function() {
    this._control.success();
  },
});
