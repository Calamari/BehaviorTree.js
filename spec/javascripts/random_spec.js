/* globals BehaviorTree, sinon */

describe('Random', function() {
  var random;
  describe('can be constructed with', function() {
    describe('an object containing it\'s title', function() {
      beforeEach(function() {
        random = new BehaviorTree.Random({
          title: 'runAny'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(random.title).to.eql('runAny');
      });
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      random = new BehaviorTree.Random({
        title: 'random'
      });
    });

    it('has the same methods like a BranchNode instance', function() {
      var branchNode = new BehaviorTree.BranchNode({}),
          method;
      for (method in branchNode) {
        expect(random[method]).to.be.ok;
      }
    });
  });

  describe('when having a RandomSelector with two nodes', function() {
    var node1, node2, hasRun1, beSuccess, willRun, startCalled1, endCalled1,
        hasRun2, startCalled2, endCalled2, selector;
    beforeEach(function() {
      beSuccess = true;
      hasRun1 = hasRun2 = 0;
      startCalled1 = endCalled1 = false;
      startCalled2 = endCalled2 = false;
      node1 = new BehaviorTree.Node({
        run: function() {
          hasRun1 += 1;
          if (willRun) {
            this.running();
          } else if (beSuccess) {
            this.success();
          } else {
            this.fail();
          }
        },
        start: function() { startCalled1 = true; },
        end: function() { endCalled1 = true; }
      });
      node2 = new BehaviorTree.Node({
        run: function() {
          hasRun2 += 1;
          if (willRun) {
            this.running();
          } else if (beSuccess) {
            this.success();
          } else {
            this.fail();
          }
        },
        start: function() { startCalled2 = true; },
        end: function() { endCalled2 = true; }
      });
      selector = new BehaviorTree.Random({
        title: 'a random',
        nodes: [
          node1,
          node2
        ]
      });
      selector.setControl({
        running: function() {},
        success: function() {},
        fail: function() {}
      });
    });

    describe('if task will be success', function() {
      beforeEach(function() {
        beSuccess = true;
        sinon.stub(Math, 'random').returns(0.7);
        selector.run();
      });

      afterEach(function() {
        Math.random.restore();
      });

      it('runs randomly one task', function() {
        expect(hasRun1).not.to.be.ok;
        expect(hasRun2).to.be.ok;
      });

      it('starts randomly only one task', function() {
        expect(startCalled1).not.to.be.ok;
        expect(startCalled2).to.be.ok;
      });
    });

    describe('if task will fail', function() {
      beforeEach(function() {
        beSuccess = false;
        sinon.stub(Math, 'random').returns(0.7);
        selector.run();
      });

      afterEach(function() {
        Math.random.restore();
      });

      it('runs randomly only that one task', function() {
        expect(hasRun1).not.to.be.ok;
        expect(hasRun2).to.be.ok;
      });

      it('starts randomly only that one task', function() {
        expect(startCalled1).not.to.be.ok;
        expect(startCalled2).to.be.ok;
      });
    });

    describe('if task will return running', function() {
      beforeEach(function() {
        willRun = true;
        sinon.stub(Math, 'random').returns(0.7);
        selector.run();
      });

      afterEach(function() {
        Math.random.restore();
      });

      it('will run that one again on run() and only start it once', function() {
        expect(hasRun1).not.to.be.ok;
        expect(hasRun2).to.eql(1);
        expect(startCalled2).to.be.ok;

        startCalled2 = false;
        Math.random.returns(0.3);
        selector.run();
        expect(hasRun1).not.to.be.ok;
        expect(hasRun2).to.eql(2);
        expect(startCalled2).not.to.be.ok;

        Math.random.returns(0.1);
        selector.run();
        expect(hasRun1).not.to.be.ok;
        expect(hasRun2).to.eql(3);
        expect(startCalled2).not.to.be.ok;
      });

      it('starts randomly only that one task', function() {
        expect(startCalled1).not.to.be.ok;
        expect(startCalled2).to.be.ok;
      });
    });
  });

  describe('when in RandomSelector with two nodes', function() {
    var parentSelector, beSuccess, willRun, parentSuccessCalled, parentFailCalled, parentRunningCalled, selector;
    beforeEach(function() {
      beSuccess = true;
      parentSuccessCalled = parentFailCalled = false;
      selector = new BehaviorTree.Random({
        title: 'a random',
        nodes: [
          new BehaviorTree.Node({
            run: function() {
              if (willRun) {
                this.running();
              } else if (beSuccess) {
                this.success();
              } else {
                this.fail();
              }
            }
          })
        ]
      });

      parentSelector = new BehaviorTree.Random({
        title: 'parent',
        nodes: [ selector ],
        running: function() {
          parentRunningCalled = true;
        },
        success: function() {
          parentSuccessCalled = true;
        },
        fail: function() {
          parentFailCalled = true;
        }
      });
    });

    describe('all task result in success', function() {
      it('calls success also in parent node', function() {
        beSuccess = true;
        parentSelector.run();
        expect(parentSuccessCalled).to.be.ok;
      });
    });

    describe('a task results in failure', function() {
      it('calls fail also in parent node', function() {
        beSuccess = false;
        parentSelector.run();
        expect(parentFailCalled).to.be.ok;
      });
    });

    describe('a task resulting in running', function() {
      it('calls running also in parent node', function() {
        willRun = true;
        parentSelector.run();
        expect(parentRunningCalled).to.be.ok;
      });
    });
  });
});
