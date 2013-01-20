

describe('BranchNode', function() {
  var selector;
  describe('can be constructed with', function() {
    describe("an object containing it's title", function() {
      beforeEach(function() {
        selector = new BehaviorTree.BranchNode({
          title: 'choose'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(selector.title).toBe('choose');
      });
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      selector = new BehaviorTree.BranchNode({
        title: 'selector'
      });
    });

    it('has the same methods like a Node instance', function() {
      var node = new BehaviorTree.Node({});
      for (var method in node) {
        expect(selector[method]).toBeTruthy();
      }
    });
  });

  describe('having an BranchNode without child nodes', function() {
    beforeEach(function() {
      selector = new BehaviorTree.BranchNode({
        title: 'empty selector'
      });
    });

    it("the canRun method returns false", function() {
      expect(selector.canRun()).toBe(false);
    });
  });

  describe('having an BranchNode with at least one child node', function() {
    beforeEach(function() {
      selector = new BehaviorTree.BranchNode({
        title: 'a selector',
        nodes: [
          new BehaviorTree.Node({})
        ]
      });
    });

    it("the canRun method returns true", function() {
      expect(selector.canRun()).toBe(true);
    });
  });


  describe('the run method', function() {
    var node, mayRun, hasRun, beSuccess, startCalled, endCalled;
    beforeEach(function() {
      mayRun = true;
      hasRun = startCalled = endCalled = false;
      node = new BehaviorTree.Node({
        canRun: function() { return mayRun; },
        run: function() {
          hasRun = true;
          if (beSuccess) {
            this.success();
          } else {
            this.fail();
          }
        },
        start: function() { startCalled = true; },
        end: function() { endCalled = true; }
      });
      selector = new BehaviorTree.BranchNode({
        title: 'call it selector',
        nodes: [
          node
        ]
      });
    });

    describe('calls canRun on next node and', function() {
      it("does not run the run method if canRun returns false", function() {
        mayRun = false;
        selector.run();
        expect(hasRun).toBeFalsy();
      });

      it("does run the run method if canRun returns true", function() {
        mayRun = true;
        selector.run();
        expect(hasRun).toBeTruthy();
      });
    });
    it('calls first the start method of next node before calling the run method', function() {
      selector.run();
      expect(startCalled).toBeTruthy();
    });

    describe('if success is called by task', function() {
      it("calls the end method of task", function() {
        beSuccess = true;
        selector.run();
        expect(endCalled).toBeTruthy();
      });
    });

    describe('if fail is called by task', function() {
      it("it still calls the end method of task", function() {
        beSuccess = false;
        selector.run();
        expect(endCalled).toBeTruthy();
      });
    });
  });

});
