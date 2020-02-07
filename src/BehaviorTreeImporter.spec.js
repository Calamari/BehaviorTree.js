/* eslint-env jest */
import sinon from 'sinon'
import { SUCCESS, FAILURE } from './constants'
import BehaviorTree from './BehaviorTree'
import BehaviorTreeImporter from './BehaviorTreeImporter'
import Decorator from './Decorator'
import Task from './Task'

class EnemyInSightDecorator extends Decorator {
  nodeType = 'EnemyInSightDecorator'

  decorate (run, blackboard) {
    return blackboard.enemyInSight ? run() : FAILURE
  }
}

describe('BehaviorTreeImporter', () => {
  let clock
  let blackboard
  let importer

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    blackboard = {
      timesJumped: 0
    }
    BehaviorTree.register('walk', new Task({
      run: function (blackboard) {
        blackboard.walking = true
        return SUCCESS
      }
    }))

    BehaviorTree.register('idle', new Task({
      run: function (blackboard) {
        blackboard.walking = false
        return SUCCESS
      }
    }))

    BehaviorTree.register('jump', new Task({
      run: function (blackboard) {
        blackboard.timesJumped++
        return SUCCESS
      }
    }))
    importer = new BehaviorTreeImporter()
    importer.defineType('ifEnemyInSight', EnemyInSightDecorator)
  })

  describe('importing a complex JSON tree into a usable behavior tree', () => {
    const json = {
      type: 'selector',
      name: 'the root',
      nodes: [
        {
          type: 'ifEnemyInSight',
          name: 'handling enemies',
          node: { type: 'walk', name: 'go to enemy' }
        },
        {
          type: 'cooldown',
          name: 'jumping around',
          cooldown: 1,
          node: { type: 'jump', name: 'jump up' } // beacuse we can ;)
        },
        { type: 'idle', name: 'doing nothing' }
      ]
    }
    let bTree

    beforeEach(() => {
      bTree = new BehaviorTree({
        tree: importer.parse(json),
        blackboard
      })
    })

    it('works', () => {
      bTree.step({ debug: true })

      expect(bTree.lastRunData[0].name).toEqual('the root')

      const selectorNodes = bTree.lastRunData[0].nodes
      expect(selectorNodes.length).toEqual(3)
      expect(selectorNodes.map(x => x.name)).toEqual(['handling enemies', 'jumping around', 'doing nothing'])
      expect(selectorNodes.map(x => x.result)).toEqual([false, true, undefined])
    })

    it('passes in the config as it is supposed to', () => {
      bTree.step({ debug: true })
      bTree.step({ debug: true })
      let selectorNodes = bTree.lastRunData[0].nodes
      expect(selectorNodes.map(x => x.result)).toEqual([false, false, true])

      clock.tick(999)
      bTree.step({ debug: true })

      selectorNodes = bTree.lastRunData[0].nodes
      expect(selectorNodes.map(x => x.result)).toEqual([false, false, true])

      clock.tick(1)
      bTree.step({ debug: true })

      selectorNodes = bTree.lastRunData[0].nodes
      expect(selectorNodes.map(x => x.result)).toEqual([false, true, undefined])
    })
  })
})
