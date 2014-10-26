
module.exports = require('./branch_node').extend({
  success: function() {
    this.base();
    this._control.success();
  },
  fail: function() {
    this.base();
    this._actualTask += 1;
    if (this._actualTask < this.children.length) {
      this._run(this._object);
    } else {
      this._control.fail();
    }
  }
});
