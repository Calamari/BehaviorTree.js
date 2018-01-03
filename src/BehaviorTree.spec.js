/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import BehaviorTree from './BehaviorTree'
import Sequence from './Sequence'
import Selector from './Selector'
import Task from './Task'
import InvertDecorator from './decorators/InvertDecorator'

describe('BehaviorTree', () => {
  let bTree
  let blackboard
  describe('with a medium complex tree', () => {
    const aTask = new Task({
      run: function (blackboard) {
        ++blackboard.aCounter
        return SUCCESS
      }
    })
    const bTask = new Task({
      run: function (blackboard) {
        ++blackboard.bCounter
        return FAILURE
      }
    })
    const switchTask = new Task({
      run: function (blackboard) {
        ++blackboard.switchCounter
        return blackboard.switchResult
      }
    })
    const tree = new Sequence({
      nodes: [
        aTask,
        aTask,
        new Selector({
          nodes: [
            bTask,
            switchTask,
            bTask
          ]
        }),
        aTask
      ]
    })

    beforeEach(() => {
      blackboard = {
        aCounter: 0,
        bCounter: 0,
        switchCounter: 0,
        switchResult: RUNNING
      }
      bTree = new BehaviorTree({ tree, blackboard })
    })

    it('controls stepping with running and stuff', () => {
      bTree.step()

      expect(blackboard.aCounter).toEqual(2)
      expect(blackboard.bCounter).toEqual(1)
      expect(blackboard.switchCounter).toEqual(1)

      bTree.step()

      expect(blackboard.aCounter).toEqual(2)
      expect(blackboard.bCounter).toEqual(1)
      expect(blackboard.switchCounter).toEqual(2)

      blackboard.switchResult = FAILURE
      bTree.step()

      expect(blackboard.aCounter).toEqual(2)
      expect(blackboard.bCounter).toEqual(2)
      expect(blackboard.switchCounter).toEqual(3)

      blackboard.switchResult = RUNNING
      bTree.step()

      expect(blackboard.aCounter).toEqual(4)
      expect(blackboard.bCounter).toEqual(3)
      expect(blackboard.switchCounter).toEqual(4)

      blackboard.switchResult = SUCCESS
      bTree.step()

      expect(blackboard.aCounter).toEqual(5)
      expect(blackboard.bCounter).toEqual(3)
      expect(blackboard.switchCounter).toEqual(5)

      bTree.step()

      expect(blackboard.aCounter).toEqual(8)
      expect(blackboard.bCounter).toEqual(4)
      expect(blackboard.switchCounter).toEqual(6)
    })
  })

  describe('with the simplest tree possible', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: RUNNING
      }
      const tree = new Task({
        start: function (blackboard) {
          ++blackboard.start
        },
        run: function (blackboard) {
          ++blackboard.run
          return blackboard.result
        },
        end: function (blackboard) {
          ++blackboard.end
        }
      })
      bTree = new BehaviorTree({ tree, blackboard })
    })

    it('running does not call start multiple times', () => {
      bTree.step()

      expect(blackboard.start).toEqual(1)
      expect(blackboard.run).toEqual(1)
      expect(blackboard.end).toEqual(0)

      bTree.step()

      expect(blackboard.start).toEqual(1)
      expect(blackboard.run).toEqual(2)
      expect(blackboard.end).toEqual(0)

      blackboard.result = FAILURE
      bTree.step()

      expect(blackboard.start).toEqual(1)
      expect(blackboard.run).toEqual(3)
      expect(blackboard.end).toEqual(1)

      blackboard.result = SUCCESS
      bTree.step()

      expect(blackboard.start).toEqual(2)
      expect(blackboard.run).toEqual(4)
      expect(blackboard.end).toEqual(2)
    })
  })

  describe('with the simplest tree possible', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: RUNNING
      }
      const tree = new Task({
        start: function (blackboard) {
          ++blackboard.start
        },
        run: function (blackboard) {
          ++blackboard.run
          return blackboard.result
        },
        end: function (blackboard) {
          ++blackboard.end
        }
      })
      bTree = new BehaviorTree({ tree, blackboard })
    })

    it('running does not call start multiple times', () => {
      bTree.step()

      expect(blackboard.start).toEqual(1)
      expect(blackboard.run).toEqual(1)
      expect(blackboard.end).toEqual(0)

      bTree.step()

      expect(blackboard.start).toEqual(1)
      expect(blackboard.run).toEqual(2)
      expect(blackboard.end).toEqual(0)

      blackboard.result = FAILURE
      bTree.step()

      expect(blackboard.start).toEqual(1)
      expect(blackboard.run).toEqual(3)
      expect(blackboard.end).toEqual(1)

      blackboard.result = SUCCESS
      bTree.step()

      expect(blackboard.start).toEqual(2)
      expect(blackboard.run).toEqual(4)
      expect(blackboard.end).toEqual(2)
    })
  })

  describe('registering of tasks', () => {
    beforeEach(() => {
      blackboard = {
        taskA: 0,
        taskB: 0,
        taskC: 0,
        result: RUNNING
      }
      BehaviorTree.register('taskA', new Task({
        run: function (blackboard) {
          ++blackboard.taskA
          return SUCCESS
        }
      }))
      BehaviorTree.register('taskB', new Task({
        run: function (blackboard) {
          ++blackboard.taskB
          return FAILURE
        }
      }))
    })

    it('looks up previously registered tasks', () => {
      bTree = new BehaviorTree({
        blackboard,
        tree: new Sequence({
          nodes: [
            'taskA',
            'taskB',
            'taskA'
          ]
        })
      })
      bTree.step()

      expect(blackboard.taskA).toEqual(1)
      expect(blackboard.taskB).toEqual(1)
    })

    it('can use function-shortcut to create tasks with only a run method', () => {
      BehaviorTree.register('taskC', () => {
        ++blackboard.taskC
        return FAILURE
      })
      bTree = new BehaviorTree({
        blackboard,
        tree: new Sequence({
          nodes: [
            'taskA',
            'taskC',
            'taskB'
          ]
        })
      })
      bTree.step()

      expect(blackboard.taskA).toEqual(1)
      expect(blackboard.taskB).toEqual(0)
      expect(blackboard.taskC).toEqual(1)
    })

    it('can be erased', () => {
      BehaviorTree.cleanRegistry()

      bTree = new BehaviorTree({
        blackboard,
        tree: new Selector({
          nodes: [
            'taskA',
            'taskC',
            'taskB'
          ]
        })
      })

      expect(() => {
        bTree.step()
      }).toThrowError('No node with name taskA registered.')
    })

    it('can load tree directly as registered sequence', () => {
      BehaviorTree.register('awesome behavior', new Sequence({
        nodes: [
          'taskA',
          'taskB',
          'taskA'
        ]
      }))
      bTree = new BehaviorTree({
        blackboard,
        tree: 'awesome behavior'
      })
      bTree.step()

      expect(blackboard.taskA).toEqual(1)
      expect(blackboard.taskB).toEqual(1)
    })

    it('looks up previously registered sequences with sub sequences as well', () => {
      BehaviorTree.register('mySubSequence', new Sequence({
        nodes: [
          'taskA',
          'taskB',
          'taskA'
        ]
      }))

      BehaviorTree.register('mySequence', new Sequence({
        nodes: [
          'mySubSequence',
          'taskB'
        ]
      }))
      bTree = new BehaviorTree({
        blackboard,
        tree: new Sequence({
          nodes: [
            'mySequence'
          ]
        })
      })
      bTree.step()

      expect(blackboard.taskA).toEqual(1)
      expect(blackboard.taskB).toEqual(1)
    })

    it('looks up previously registered task within a decorators', () => {
      bTree = new BehaviorTree({
        blackboard,
        tree: new Selector({
          nodes: [
            new InvertDecorator({ node: 'taskA' }),
            'taskB'
          ]
        })
      })
      bTree.step()

      expect(blackboard.taskA).toEqual(1)
      expect(blackboard.taskB).toEqual(1)
    })
  })

  describe('debugging the tree', () => {
    beforeEach(() => {
      BehaviorTree.register('taskA', () => {
        return SUCCESS
      })
      BehaviorTree.register('taskB', () => {
        return FAILURE
      })
      BehaviorTree.register('taskC', () => {
        return SUCCESS
      })
      BehaviorTree.register('taskD', () => {
        return SUCCESS
      })

      bTree = new BehaviorTree({
        blackboard,
        tree: new Selector({
          name: 'TestSelector',
          nodes: [
            'taskB',
            new InvertDecorator({ name: 'inverting', node: 'taskA' }),
            'taskB',
            'taskC',
            'taskD'
          ]
        })
      })
    })

    it('not using the debug optino is not generating lastRunData', () => {
      bTree.step()

      expect(bTree.lastRunData).toEqual(null)
    })

    it('there is a debug option providing more output about that step', () => {
      expect(bTree.lastRunData).toEqual(undefined)

      bTree.step({ debug: true })

      expect(bTree.lastRunData.length).toEqual(1)
      expect(bTree.lastRunData[0].name).toEqual('TestSelector')
      expect(bTree.lastRunData[0].result).toEqual(true)
      const selectorNodes = bTree.lastRunData[0].nodes
      expect(selectorNodes.length).toEqual(5)
      expect(selectorNodes.map(x => x.name)).toEqual(['taskB', 'inverting', 'taskB', 'taskC', 'taskD'])
      expect(selectorNodes.map(x => x.type)).toEqual(['Task', 'InvertDecorator', 'Task', 'Task', 'Task'])
      expect(selectorNodes.map(x => x.result)).toEqual([false, false, false, true, undefined])
    })
  })
})
