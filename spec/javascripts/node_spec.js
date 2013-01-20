

describe('Node', function() {
  describe('can be constructed with', function() {
    describe("an object containing", function() {
      var node;
      describe("a title", function() {
        beforeEach(function() {
          node = new BehaviorTree.Node({
            title: 'firstNode'
          });
        });

        it('and the title is saved on the instance', function() {
          expect(node.title).toBe('firstNode');
        });
      });

      describe("a canRun method", function() {
        beforeEach(function() {
          node = new BehaviorTree.Node({
            canRun: function() {
              return true;
            }
          });
        });

        it('and it is available on the instance', function() {
          expect(node.canRun()).toBe(true);
        });
      });
    });
  });

  describe('an instance', function() {
    var node;
    beforeEach(function() {
      node = new BehaviorTree.Node({
        title: 'node'
      });
    });

    it('has a canRun method', function() {
      expect(node.canRun).toBeFunction();
    });

    it('the canRun method returns true when not overridden', function() {
      expect(node.canRun()).toBe(true);
    });

    it('has a start method', function() {
      expect(node.start).toBeFunction();
    });

    it('has a end method', function() {
      expect(node.end).toBeFunction();
    });

    it('has a run method', function() {
      expect(node.run).toBeFunction();
    });
  });

});
