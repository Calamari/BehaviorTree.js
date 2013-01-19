

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
  });
});
