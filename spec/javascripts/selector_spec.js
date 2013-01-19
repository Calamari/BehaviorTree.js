

describe('Selector', function() {
  var selector;
  describe('can be constructed with', function() {
    describe("an object containing it's title", function() {
      beforeEach(function() {
        selector = new BehaviorTree.Selector({
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
      selector = new BehaviorTree.Selector({
        title: 'selector'
      });
    });

    it('has the same methods like a BranchNode instance', function() {
      var branchNode = new BehaviorTree.BranchNode({});
      for (var method in branchNode) {
        expect(selector[method]).toBeTruthy();
      }
    });
  });
});
