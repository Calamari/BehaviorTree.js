// RUN with `npx babel-node importingExample.js`

import BehaviorTree from '../src/BehaviorTree'
import Decorator from '../src/Decorator'
import Selector from '../src/Selector'
import BehaviorTreeImporter from '../src/BehaviorTreeImporter'
import Task from '../src/Task'
import { SUCCESS, FAILURE } from '../src/constants'

class CanJumpDecorator extends Decorator {
  nodeType = 'CanJumpDecorator';

  decorate (run, blackboard) {
    if (blackboard[this.config.check]) return run()
    return FAILURE
  }
};

BehaviorTree.register('selector', Selector)

BehaviorTree.register('walk', new Task({
  run: function (blackboard) {
    console.log('walk…')
    return SUCCESS
  }
}))

BehaviorTree.register('jump', new Task({
  run: function (blackboard) {
    console.log('jump…')
    return SUCCESS
  }
}))

const treeJson = {
  'type': 'selector',
  'name': 'the root',
  'nodes': [
    {
      'type': 'canJump',
      'name': 'can I jump?',
      'check': 'isJumping',
      'node': { 'type': 'jump', 'name': 'jump up' }
    },
    { 'type': 'walk', 'name': 'just walking' }
  ]
}
const importer = new BehaviorTreeImporter()

importer.defineType('canJump', CanJumpDecorator)

const blackboard = {
  isJumping: true
}

const tree = new BehaviorTree({
  tree: importer.parse(treeJson),
  blackboard
})

tree.step()
// logs jump

blackboard.isJumping = false

tree.step()
// logs walk
