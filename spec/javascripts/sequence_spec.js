/* globals BehaviorTree */

describe('Sequence', function() {
  var sequence;
  describe('can be constructed with', function() {
    describe('an object containing it\'s title', function() {
      beforeEach(function() {
        sequence = new BehaviorTree.Sequence({
          title: 'runAll'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(sequence.title).to.eql('runAll');
      });
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      sequence = new BehaviorTree.Sequence({
        title: 'sequence'
      });
    });

    it('has the same methods like a BranchNode instance', function() {
      var branchNode = new BehaviorTree.BranchNode({}),
          method;
      for (method in branchNode) {
        expect(sequence[method]).to.be.ok;
      }
    });
  });

  describe('when having a Sequence with two nodes', function() {
    var node, hasRun1, beSuccess1, startCalled1, endCalled1,
        hasRun2, startCalled2, endCalled2, selector;
    beforeEach(function() {
      beSuccess1 = true;
      hasRun1 = startCalled1 = endCalled1 = false;
      hasRun2 = startCalled2 = endCalled2 = false;
      node = new BehaviorTree.Node({
        run: function() {
          hasRun1 = true;
          if (beSuccess1) {
            this.success();
          } else {
            this.fail();
          }
        },
        start: function() { startCalled1 = true; },
        end: function() { endCalled1 = true; }
      });
      selector = new BehaviorTree.Sequence({
        title: 'a sequence',
        nodes: [
          node,
          new BehaviorTree.Node({
            run: function() { hasRun2 = true; this.success(); },
            start: function() { startCalled2 = true; },
            end: function() { endCalled2 = true; }
          })
        ]
      });
      selector.setControl({
        success: function() {},
        fail: function() {}
      });
    });

    describe('if success is called by first task', function() {
      beforeEach(function() {
        beSuccess1 = true;
        selector.run();
      });

      it('calls start of the next task in line', function() {
        expect(startCalled2).to.be.ok;
      });

      it('calls run of the next task in line', function() {
        expect(hasRun2).to.be.ok;
      });
    });

    describe('if fail is called by first task', function() {
      beforeEach(function() {
        beSuccess1 = false;
        selector.run();
      });

      it('does not call start of the next task in line', function() {
        expect(startCalled2).not.to.be.ok;
      });

      it('does not call run of the next task in line', function() {
        expect(hasRun2).not.to.be.ok;
      });
    });
  });

  describe('when in Sequence with two nodes', function() {
    var parentSelector, beSuccess, parentSuccessCalled, parentFailCalled, selector;
    beforeEach(function() {
      beSuccess = true;
      parentSuccessCalled = parentFailCalled = false;
      selector = new BehaviorTree.Sequence({
        title: 'a sequence',
        nodes: [
          new BehaviorTree.Node({
            run: function() { if (beSuccess) { this.success(); } else { this.fail(); } }
          })
        ]
      });

      parentSelector = new BehaviorTree.Sequence({
        title: 'parent',
        nodes: [ selector ],
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
  });
});
