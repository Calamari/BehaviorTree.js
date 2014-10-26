/* globals BehaviorTree */

describe('Task', function() {
  describe('can be constructed with', function() {
    describe('an object containing it\'s title', function() {
      var task;
      beforeEach(function() {
        task = new BehaviorTree.Task({
          title: 'firstTask'
        });
      });

      it('and the title is saved on the instance', function() {
        expect(task.title).to.eql('firstTask');
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

    it('has a start method', function() {
      expect(task).to.respondTo('start');
    });

    it('has a end method', function() {
      expect(task).to.respondTo('end');
    });

    it('has a run method', function() {
      expect(task).to.respondTo('run');
    });
  });

});
