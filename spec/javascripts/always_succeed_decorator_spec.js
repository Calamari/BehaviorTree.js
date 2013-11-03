describe('AlwaysSucceedDecorator', function() {
  var alwaysDecorator, node, calledStart, calledEnd, calledRun;
  beforeEach(function() {
    calledStart = calledEnd = calledRun = false;
    node = new BehaviorTree.Node({
      title: 'aNode',
      start: function() { calledStart = true; },
      end: function() { calledEnd = true; },
      run: function(cb) { calledRun = true; cb && cb.call(this); }
    });
    alwaysDecorator = new BehaviorTree.AlwaysSucceedDecorator({
      title: 'defaultDecorator',
      node: node
    });
  });

  describe('always', function() {
    var isRunning, hasFailed, didSucceed;
    beforeEach(function() {
      isRunning = hasFailed = didSucceed = false;
      alwaysDecorator.setControl({
        running: function() { isRunning = true; },
        fail: function() { hasFailed = true; },
        success: function() { didSucceed = true; }
      });
      alwaysDecorator.start();
    });

    it('returns success on success state', function() {
      node.run(function() { this.success(); });
      expect(didSucceed).toBe(true);
      expect(hasFailed).toBe(false);
    });

    it('returns success on fail state', function() {
      node.run(function() { this.fail(); });
      expect(didSucceed).toBe(true);
      expect(hasFailed).toBe(false);
    });

    it('passes through the running state', function() {
      node.run(function() { this.running(); });
      expect(isRunning).toBe(true);
    });
  });
});
