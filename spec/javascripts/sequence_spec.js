

describe('Sequence', function() {
  var sequence;
  describe('can be constructed with', function() {
    describe("an object containing it's title", function() {
      beforeEach(function() {
        sequence = new BehaviorTree.Sequence({
          title: 'runAll'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(sequence.title).toBe('runAll');
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
      var branchNode = new BehaviorTree.BranchNode({});
      for (var method in branchNode) {
        expect(sequence[method]).toBeTruthy();
      }
    });
  });
});
