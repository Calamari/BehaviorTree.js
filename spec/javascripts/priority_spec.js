/* globals BehaviorTree */

describe('Priority selector', function() {
  var selector;
  describe('can be constructed with', function() {
    describe('an object containing it\'s title', function() {
      beforeEach(function() {
        selector = new BehaviorTree.Priority({
          title: 'choose'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(selector.title).to.eql('choose');
      });
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      selector = new BehaviorTree.Priority({
        title: 'selector'
      });
    });

    it('has the same methods like a BranchNode instance', function() {
      var branchNode = new BehaviorTree.BranchNode({}),
          method;
      for (method in branchNode) {
        expect(selector[method]).to.be.ok;
      }
    });
  });

  describe('when having a Priority with two nodes', function() {
    var node, hasRun1, beSuccess1, startCalled1, endCalled1,
        hasRun2, startCalled2, endCalled2;
    beforeEach(function() {
      beSuccess1 = true;
      startCalled1 = startCalled2 = 0;
      hasRun1 = endCalled1 = false;
      hasRun2 = endCalled2 = false;
      node = new BehaviorTree.Node({
        run: function() {
          hasRun1 = true;
          if (beSuccess1) {
            this.success();
          } else {
            this.fail();
          }
        },
        start: function() { startCalled1 += 1; },
        end: function() { endCalled1 = true; }
      });
      selector = new BehaviorTree.Priority({
        title: 'a selector',
        nodes: [
          node,
          new BehaviorTree.Node({
            run: function() { hasRun2 = true; this.success(); },
            start: function() { startCalled2 += 1; },
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

      it('does not call start of the next task in line', function() {
        expect(startCalled2).to.eql(0);
      });

      it('does not call run of the next task in line', function() {
        expect(hasRun2).not.to.be.ok;
      });
    });

    describe('if fail is called by first task', function() {
      beforeEach(function() {
        beSuccess1 = false;
        selector.run();
      });

      it('calls start of the next task in line', function() {
        expect(startCalled2).to.eql(1);
      });

      it('calls run of the next task in line', function() {
        expect(hasRun2).to.be.ok;
      });
    });
  });

  describe('when in Priority with two nodes', function() {
    var parentSelector, beSuccess, parentSuccessCalled, parentFailCalled;
    beforeEach(function() {
      beSuccess = true;
      parentSuccessCalled = parentFailCalled = false;
      selector = new BehaviorTree.Priority({
        title: 'a selector',
        nodes: [
          new BehaviorTree.Node({
            run: function() { if (beSuccess) { this.success(); } else { this.fail(); } }
          })
        ]
      });

      parentSelector = new BehaviorTree.Priority({
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

    describe('one task results in success', function() {
      it('calls success also in parent node', function() {
        beSuccess = true;
        parentSelector.run();
        expect(parentSuccessCalled).to.be.ok;
      });
    });

    describe('all task result in failure', function() {
      it('calls fail also in parent node', function() {
        beSuccess = false;
        parentSelector.run();
        expect(parentFailCalled).to.be.ok;
      });
    });
  });
});
