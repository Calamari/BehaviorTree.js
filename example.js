
//Sequence is child of Node
//Selector is child of Node
//Task is child of Node

BehaviorTree.register('previouslyGeneratedTask', new BehaviorTree.Task({
  canRun: function() {
    return true;
  },
  // Things to do on starting this task
  start: function() {

  },
  // Things to do after finishing task
  end: function() {

  },
  // Things to do on each loop cycle
  run: function() {
    this.success();
  }
}));

var tree = new BehaviorTree({
  'tree': new BehaviorTree.Sequence({
    title: 'growing',
    nodes: [
      new BehaviorTree.Task({
        title: 'leafing',
        canRun: function() {
          return false;
        },
        run: function() {
          this.fail();
        }
      }),
      'previouslyGeneratedTask',
      new BehaviorTree.Selector({
        title: 'shrinking',
        nodes: [
          new BehaviorTree.Decorator({
            task: 'loosingLeafes'
          })
        ]
      })
    ]

  })
});

/*
  In this Tree, we use registered Nodes for the Tasks
  Sequences and Selectors can be generated on the fly, using the given nodes and title
  Given nodes can also be decorators or filters
*/
var tree2 = new BehaviorTree({
  tree: {
    title: 'planner',
    type: 'Sequence',
    nodes: [
      {
        title: 'fight',
        type: 'Selector',
        nodes: [
          'sword',
          'bareHands'
        ]
      },
      {
        title: 'idle',
        type: 'Selector',
        nodes: [
          'walkAround',
          'standStill'
        ]
      }
    ]
  }
});
