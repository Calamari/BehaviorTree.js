/* eslint-env jest */
import sinon from 'sinon'
import { SUCCESS, FAILURE } from './constants'
import BehaviorTree from './BehaviorTree'
import BehaviorTreeImporter from './BehaviorTreeImporter'
import Decorator from './Decorator'
import Task from './Task'
import Introspector from './Introspector'

class EnemyInSightDecorator extends Decorator {
  nodeType = 'EnemyInSightDecorator'

  decorate(run, blackboard) {
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
    BehaviorTree.register(
      'walk',
      new Task({
        run: function (blackboard) {
          blackboard.walking = true
          return SUCCESS
        }
      })
    )

    BehaviorTree.register(
      'idle',
      new Task({
        run: function (blackboard) {
          blackboard.walking = false
          return SUCCESS
        }
      })
    )

    BehaviorTree.register(
      'jump',
      new Task({
        run: function (blackboard) {
          blackboard.timesJumped++
          return SUCCESS
        }
      })
    )
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
    let introspector

    beforeEach(() => {
      introspector = new Introspector()
      bTree = new BehaviorTree({
        tree: importer.parse(json),
        blackboard
      })
    })

    it('works', () => {
      bTree.step({ introspector })

      expect(introspector.lastResult.name).toEqual('the root')

      const selectorNodes = introspector.lastResult.children

      expect(selectorNodes.length).toEqual(2)
      expect(selectorNodes.map((x) => x.name)).toEqual(['handling enemies', 'jumping around'])
      expect(selectorNodes.map((x) => x.result)).toEqual([false, true])
    })

    it('passes in the config as it is supposed to', () => {
      bTree.step({ introspector })
      bTree.step({ introspector })
      let selectorNodes = introspector.lastResult.children
      expect(selectorNodes.map((x) => x.result)).toEqual([false, false, true])

      clock.tick(999)
      bTree.step({ introspector })

      selectorNodes = introspector.lastResult.children
      expect(selectorNodes.map((x) => x.result)).toEqual([false, false, true])

      clock.tick(1)
      bTree.step({ introspector })

      selectorNodes = introspector.lastResult.children
      expect(selectorNodes.map((x) => x.result)).toEqual([false, true])
    })
  })
})
