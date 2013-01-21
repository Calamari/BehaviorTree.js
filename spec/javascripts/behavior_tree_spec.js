

describe('BehaviorTree', function() {
  describe('can be constructed with', function() {
    it("an object containing the tree key", function() {
      var btree = new BehaviorTree({
        tree: {}
      });
      expect(btree instanceof BehaviorTree).toBeTruthy();
    });
  });

  it('has a register method', function() {
    expect(BehaviorTree.register).toBeFunction();
  });

  it('has a getNode', function() {
    expect(BehaviorTree.register).toBeFunction();
  });

  describe('can save an object with register method', function() {
    var node = new BehaviorTree.Node({});
    beforeEach(function() {
      BehaviorTree.register('myNode', node);
    });
    it("and getNode returns it", function() {
      expect(BehaviorTree.getNode('myNode')).toBe(node);
    });
  });

  describe('an instance', function() {
    var btree;
    beforeEach(function() {
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({})
      });
    });

    it('has a step method', function() {
      expect(btree.step).toBeFunction();
    });

    it('has a setObject method', function() {
      expect(btree.setObject).toBeFunction();
    });
  });

  describe('setup with a minimal tree', function() {
    var btree, runCount, startCalled, endCalled, msg;
    beforeEach(function() {
      runCount = 0;
      beSuccess = startCalled = endCalled = false;
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({
          start: function() { startCalled = true; },
          end: function() { endCalled = true; },
          run: function() {
            runCount++;
            this.success();
          }
        })
      });
      realLog = console.log;
      console.log = function(m) { msg = m; };
    });

    afterEach(function() {
      console.log = realLog;
    });

    it('the step method calls start of root node', function() {
      btree.step();
      expect(startCalled).toBeTruthy();
    });

    it('the step method calls run of root node', function() {
      btree.step();
      expect(runCount).toBe(1);
    });

    it('the step method calls end of root node on success', function() {
      beSuccess = true;
      btree.step();
      expect(endCalled).toBeTruthy();
    });

    it('the step method calls end of root node on fail', function() {
      btree.step();
      expect(endCalled).toBeTruthy();
    });

    it('logs no message into the console if step is called again', function() {
      btree.step();
      btree.step();
      expect(msg).toBeUndefined();
    });
  });

  describe('a minimal tree where the root node canRun is false', function() {
    var hasRun;
    beforeEach(function() {
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({
          canRun: function() { return false; },
          run: function() {
            hasRun = true;
          }
        })
      });
    });

    it('does nothing', function() {
      btree.step();
      expect(hasRun).toBeFalsy();
    });

    it('does nothing also called multiple times', function() {
      btree.step();
      btree.step();
      btree.step();
      expect(hasRun).toBeFalsy();
    });
  });

  describe('a tree where the root node does not call neither success, fail, nor running', function() {
    var hasRun, msg;
    beforeEach(function() {
      btree = new BehaviorTree({
        title: 'the TREE',
        tree: new BehaviorTree.Task({
          run: function() {}
        })
      });
      realLog = console.log;
      console.log = function(m) { msg = m; };
    });

    afterEach(function() {
      console.log = realLog;
    });

    it('logs message into the console', function() {
      btree.step();
      btree.step();
      expect(msg).toBe('the BehaviorTree "the TREE" did call step but one Task did not finish on last call of step.');
    });
  });

  describe('when having a more complex tree', function() {
    var runCount1, runCount2, beSuccess1, beSuccess2, stillRunning2;
    beforeEach(function() {
      runCount1 = runCount2 = 0;
      beSuccess1 = beSuccess2 = stillRunning2 = false;
      btree = new BehaviorTree({
        title: 'tree',
        tree: new BehaviorTree.Sequence({
          title: 'my sequence',
          nodes: [
            new BehaviorTree.Task({
              title: 'node1',
              run: function() {
                ++runCount1;
                if (beSuccess1) { this.success(); }
                else { this.fail(); }
              }
            }),
            new BehaviorTree.Task({
              title: 'node2',
              run: function() {
                ++runCount2;
                if (stillRunning2) { this.running(); }
                else if (beSuccess2) { this.success(); }
                else { this.fail(); }
              }
            })
          ]
        })
      });
    });

    describe('if first task runs through immediately and the second says running', function() {
      beforeEach(function() {
        beSuccess1 = true;
        stillRunning2 = true;
      });

      describe('and we call step once', function() {
        beforeEach(function() {
          btree.step();
        });

        it('both run methods are called', function() {
          expect(runCount1).toBe(1);
          expect(runCount2).toBe(1);
        });

        it('the first node will not be called again on second step', function() {
          btree.step();
          expect(runCount1).toBe(1);
        });

        it('the second node will be called on second step', function() {
          btree.step();
          expect(runCount2).toBe(2);
        });

      });
    });
  });
});
