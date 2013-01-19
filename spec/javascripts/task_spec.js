

describe('Task', function() {
  describe('can be constructed with', function() {
    describe("an object containing it's title", function() {
      var task;
      beforeEach(function() {
        task = new BehaviorTree.Task({
          title: 'firstTask'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(task.title).toBe('firstTask');
      });
    });
  });

  describe('an instance', function() {
    var task;
    beforeEach(function() {
      task = new BehaviorTree.Task({
        title: 'task'
      });
    });

    it('has a canRun method', function() {
      expect(task.canRun).toBeFunction();
    });

    it('has a start method', function() {
      expect(task.start).toBeFunction();
    });

    it('has a end method', function() {
      expect(task.end).toBeFunction();
    });

    it('has a run method', function() {
      expect(task.run).toBeFunction();
    });
  });

});
