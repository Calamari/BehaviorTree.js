describe('Decorator', function() {
  var decorator, node, lastBlackboard, calledStart, calledEnd, calledRun;
  beforeEach(function() {
    lastBlackboard = calledStart = calledEnd = calledRun = false;
    node = new BehaviorTree.Node({
      title: 'aNode',
      start: function() { calledStart = true; },
      end: function() { calledEnd = true; },
      run: function(blackboard, cb) { lastBlackboard = blackboard; calledRun = true; cb && cb.call(this); }
    });
  });

  describe('can be constructed with', function() {
    describe('an object containing it\'s title and the node', function() {
      beforeEach(function() {
        decorator = new BehaviorTree.Decorator({
          title: 'defaultDecorator',
          node: node
        });
      });

      it('and the title is saved on the instance', function() {
        expect(decorator.title).toBe('defaultDecorator');
      });

      it('and the node is saved on the instance', function() {
        expect(decorator.node).toBe(node);
      });
    });

    describe('an object containing it\'s title, but no node', function() {
      beforeEach(function() {
        BehaviorTree.register(node);
        decorator = new BehaviorTree.Decorator({
          title: 'defaultDecorator'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(decorator.title).toBe('defaultDecorator');
      });

      it('and the node is null', function() {
        expect(decorator.node).toBe(undefined);
      });

      it('and we can set the node afterwards', function() {
        decorator.setNode(node);
        expect(decorator.node).toBe(node);
      });

      it('and we can set the node afterwards by its title', function() {
        decorator.setNode('aNode');
        expect(decorator.node).toBe(node);
      });
    });

    describe('an object containing it\'s title and the title of the node', function() {
      beforeEach(function() {
        decorator = new BehaviorTree.Decorator({
          title: 'defaultDecorator',
          node: 'aNode'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(decorator.title).toBe('defaultDecorator');
      });

      it('and the node is saved on the instance', function() {
        expect(decorator.node.title).toBe(node.title);
        expect(decorator.node instanceof BehaviorTree.Node).toBe(true);
      });
    });
  });

  describe('when having a default Decorator', function() {
    beforeEach(function() {
      isRunning = hasFailed = didSucceed = false;
      decorator = new BehaviorTree.Decorator({
        title: 'defaultDecorator',
        node: node
      });
    });

    it('it just passes on start method', function() {
      decorator.start();
      expect(calledStart).toBe(true);
    });

    it('it just passes on end method', function() {
      decorator.end();
      expect(calledEnd).toBe(true);
    });

    it('it just passes on run method (with the blackboard object)', function() {
      var blackboard = 42;
      decorator.run(blackboard);
      expect(calledRun).toBe(true);
      console.log(lastBlackboard);
      expect(lastBlackboard).toBe(blackboard);
    });

    describe('it just passes through the', function() {
      var isRunning, hasFailed, didSucceed;
      beforeEach(function() {
        decorator.setControl({
          running: function() { isRunning = true; },
          fail: function() { hasFailed = true; },
          success: function() { didSucceed = true; }
        });
        decorator.start();
      });

      it('success state', function() {
        node.run(null, function() { this.success(); });
        expect(didSucceed).toBe(true);
      });

      it('fail state', function() {
        node.run(null, function() { this.fail(); });
        expect(hasFailed).toBe(true);
      });

      it('running state', function() {
        node.run(null, function() { this.running(); });
        expect(isRunning).toBe(true);
      });
    });

  });
});
