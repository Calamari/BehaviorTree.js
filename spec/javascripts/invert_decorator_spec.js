/* globals BehaviorTree */

describe('InvertDecorator', function() {
  var invertDecorator, node, calledStart, calledEnd, calledRun;
  beforeEach(function() {
    calledStart = calledEnd = calledRun = false;
    node = new BehaviorTree.Node({
      title: 'aNode',
      start: function() { calledStart = true; },
      end: function() { calledEnd = true; },
      run: function(cb) { calledRun = true; cb && cb.call(this); }
    });
    invertDecorator = new BehaviorTree.InvertDecorator({
      title: 'defaultDecorator',
      node: node
    });
  });

  describe('just', function() {
    var isRunning, hasFailed, didSucceed;
    beforeEach(function() {
      isRunning = hasFailed = didSucceed = false;
      invertDecorator.setControl({
        running: function() { isRunning = true; },
        fail: function() { hasFailed = true; },
        success: function() { didSucceed = true; }
      });
      invertDecorator.start();
    });

    it('inverts the success state', function() {
      node.run(function() { this.success(); });
      expect(didSucceed).to.be.false;
      expect(hasFailed).to.be.true;
    });

    it('inverts the fail state', function() {
      node.run(function() { this.fail(); });
      expect(didSucceed).to.be.true;
      expect(hasFailed).to.be.false;
    });

    it('passes through the running state', function() {
      node.run(function() { this.running(); });
      expect(isRunning).to.be.true;
    });
  });
});
