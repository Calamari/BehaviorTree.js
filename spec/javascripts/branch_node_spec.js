

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
        title: 'empty selector',
        nodes: [
          new BehaviorTree.Node({})
        ]
      });
    });

    it("the canRun method returns true", function() {
      expect(selector.canRun()).toBe(true);
    });
  });

});
