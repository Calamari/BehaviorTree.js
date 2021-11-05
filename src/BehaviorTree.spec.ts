/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import BehaviorTree from './BehaviorTree'
import Sequence from './Sequence'
import Selector from './Selector'
import Task from './Task'
import InvertDecorator from './decorators/InvertDecorator'
import Decorator from './Decorator'

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
          nodes: [bTask, switchTask, bTask]
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
      BehaviorTree.register(
        'taskA',
        new Task({
          run: function (blackboard) {
            ++blackboard.taskA
            return SUCCESS
          }
        })
      )
      BehaviorTree.register(
        'taskB',
        new Task({
          run: function (blackboard) {
            ++blackboard.taskB
            return FAILURE
          }
        })
      )
    })

    it('looks up previously registered tasks', () => {
      bTree = new BehaviorTree({
        blackboard,
        tree: new Sequence({
          nodes: ['taskA', 'taskB', 'taskA']
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
          nodes: ['taskA', 'taskC', 'taskB']
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
          nodes: ['taskA', 'taskC', 'taskB']
        })
      })

      expect(() => {
        bTree.step()
      }).toThrowError('No node with name taskA registered.')
    })

    it('can load tree directly as registered sequence', () => {
      BehaviorTree.register(
        'awesome behavior',
        new Sequence({
          nodes: ['taskA', 'taskB', 'taskA']
        })
      )
      bTree = new BehaviorTree({
        blackboard,
        tree: 'awesome behavior'
      })
      bTree.step()

      expect(blackboard.taskA).toEqual(1)
      expect(blackboard.taskB).toEqual(1)
    })

    it('looks up previously registered sequences with sub sequences as well', () => {
      BehaviorTree.register(
        'mySubSequence',
        new Sequence({
          nodes: ['taskA', 'taskB', 'taskA']
        })
      )

      BehaviorTree.register(
        'mySequence',
        new Sequence({
          nodes: ['mySubSequence', 'taskB']
        })
      )
      bTree = new BehaviorTree({
        blackboard,
        tree: new Sequence({
          nodes: ['mySequence']
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
          nodes: [new InvertDecorator({ node: 'taskA' }), 'taskB']
        })
      })
      bTree.step()

      expect(blackboard.taskA).toEqual(1)
      expect(blackboard.taskB).toEqual(1)
    })
  })

  describe('behavior with running nodes', () => {
    it('calls start of all task where appropriate', () => {
      const task1 = new Task({
        start: function (blackboard) {
          ++blackboard.start1
        },
        end: function (blackboard) {
          ++blackboard.end1
        },
        run: function (blackboard) {
          ++blackboard.run1
          return SUCCESS
        }
      })
      const task2 = new Task({
        start: function (blackboard) {
          ++blackboard.start2
        },
        end: function (blackboard) {
          ++blackboard.end2
        },
        run: function (blackboard) {
          ++blackboard.run2
          return blackboard.task2Result
        }
      })
      const task3 = new Task({
        start: function (blackboard) {
          ++blackboard.start3
        },
        end: function (blackboard) {
          ++blackboard.end3
        },
        run: function (blackboard) {
          ++blackboard.run3
          return SUCCESS
        }
      })

      const decoratedTask2 = new Decorator({
        start: function (blackboard) {
          ++blackboard.startDeco
        },
        end: function (blackboard) {
          ++blackboard.endDeco
        },
        node: task2
      })

      const sequence = new Sequence({
        start: function (blackboard) {
          ++blackboard.startSeq
        },
        end: function (blackboard) {
          ++blackboard.endSeq
        },
        nodes: [task1, decoratedTask2, task3]
      })
      const blackboard = {
        task2Result: RUNNING,
        start1: 0,
        run1: 0,
        end1: 0,
        start2: 0,
        run2: 0,
        end2: 0,
        start3: 0,
        run3: 0,
        end3: 0,
        startSeq: 0,
        endSeq: 0,
        startDeco: 0,
        endDeco: 0
      }

      const bTree = new BehaviorTree({
        tree: sequence,
        blackboard
      })

      bTree.step()

      expect(blackboard.startSeq).toEqual(1)
      expect(blackboard.endSeq).toEqual(0)

      expect(blackboard.startDeco).toEqual(1)
      expect(blackboard.endDeco).toEqual(0)

      expect(blackboard.start1).toEqual(1)
      expect(blackboard.run1).toEqual(1)
      expect(blackboard.end1).toEqual(1)

      expect(blackboard.start2).toEqual(1)
      expect(blackboard.run2).toEqual(1)
      expect(blackboard.end2).toEqual(0)

      expect(blackboard.start3).toEqual(0)
      expect(blackboard.run3).toEqual(0)
      expect(blackboard.end3).toEqual(0)

      bTree.step()

      expect(blackboard.startSeq).toEqual(1)
      expect(blackboard.endSeq).toEqual(0)

      expect(blackboard.startDeco).toEqual(1)
      expect(blackboard.endDeco).toEqual(0)

      expect(blackboard.start1).toEqual(1)
      expect(blackboard.run1).toEqual(1)
      expect(blackboard.end1).toEqual(1)

      expect(blackboard.start2).toEqual(1)
      expect(blackboard.run2).toEqual(2)
      expect(blackboard.end2).toEqual(0)

      expect(blackboard.start3).toEqual(0)
      expect(blackboard.run3).toEqual(0)
      expect(blackboard.end3).toEqual(0)

      blackboard.task2Result = SUCCESS

      bTree.step()

      expect(blackboard.startSeq).toEqual(1)
      expect(blackboard.endSeq).toEqual(1)

      expect(blackboard.startDeco).toEqual(1)
      expect(blackboard.endDeco).toEqual(1)

      expect(blackboard.start1).toEqual(1)
      expect(blackboard.run1).toEqual(1)
      expect(blackboard.end1).toEqual(1)

      expect(blackboard.start2).toEqual(1)
      expect(blackboard.run2).toEqual(3)
      expect(blackboard.end2).toEqual(1)

      expect(blackboard.start3).toEqual(1)
      expect(blackboard.run3).toEqual(1)
      expect(blackboard.end3).toEqual(1)
    })
  })

  describe('some curious edge cases', () => {
    function createTask(name) {
      return new Task({
        name,
        start: function (blackboard) {
          if (blackboard.result[`${name}start`]) {
            ++blackboard.result[`${name}start`]
          } else {
            blackboard.result[`${name}start`] = 1
          }
        },
        end: function (blackboard) {
          if (blackboard.result[`${name}end`]) {
            ++blackboard.result[`${name}end`]
          } else {
            blackboard.result[`${name}end`] = 1
          }
        },
        run: function (blackboard) {
          if (blackboard.result[`${name}run`]) {
            ++blackboard.result[`${name}run`]
          } else {
            blackboard.result[`${name}run`] = 1
          }
          return blackboard.running[name] ? RUNNING : SUCCESS
        }
      })
    }

    it('start of second sequence is called after first reruns', () => {
      const a1 = createTask('a1')
      const b1 = createTask('b1')

      const aSeq = new Sequence({
        nodes: [a1]
      })
      const bSeq = new Sequence({
        nodes: [b1]
      })
      const cSeq = new Sequence({
        nodes: [aSeq, bSeq]
      })
      const blackboard = {
        result: {},
        running: {}
      }

      const bTree = new BehaviorTree({
        tree: cSeq,
        blackboard
      })

      blackboard.running.a1 = true

      bTree.step()

      expect(blackboard.result).toEqual({
        a1start: 1,
        a1run: 1
      })

      blackboard.running.a1 = false

      bTree.step()

      expect(blackboard.result).toEqual({
        a1start: 1,
        a1run: 2,
        a1end: 1,
        b1start: 1,
        b1run: 1,
        b1end: 1
      })
    })
  })
})
