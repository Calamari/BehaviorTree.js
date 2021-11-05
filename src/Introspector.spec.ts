/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import BehaviorTree from './BehaviorTree'
import Task from './Task'
import InvertDecorator from './decorators/InvertDecorator'
import Introspector from './Introspector'
import Selector from './Selector'
import Sequence from './Sequence'
import Random from './Random'

describe('Introspector', () => {
  let bTree
  let blackboard
  let introspector

  BehaviorTree.register(
    'simpleTask',
    new Task({
      name: 'The Task',
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
  )
  BehaviorTree.register(
    'failingTask',
    new Task({
      name: 'Bumm',
      run: function (blackboard) {
        return FAILURE
      }
    })
  )
  BehaviorTree.register(
    'runningTask',
    new Task({
      name: 'Forest',
      run: function (blackboard) {
        return RUNNING
      }
    })
  )

  beforeEach(() => {
    blackboard = {
      start: 0,
      run: 0,
      end: 0,
      result: SUCCESS
    }

    introspector = new Introspector()
  })

  it('is empty initially', () => {
    expect(introspector.lastResult).toEqual(null)
    expect(introspector.results).toEqual([])
  })

  describe('with the simplest tree possible', () => {
    beforeEach(() => {
      bTree = new BehaviorTree({ tree: 'simpleTask', blackboard })
    })

    it('puts in the result of the last run', () => {
      bTree.step({ introspector })

      const resultFirstRun = {
        name: 'The Task',
        result: SUCCESS
      }

      expect(introspector.lastResult).toEqual(resultFirstRun)
      expect(introspector.results).toEqual([resultFirstRun])

      blackboard.result = FAILURE

      bTree.step({ introspector })

      const resultSecondRun = {
        name: 'The Task',
        result: FAILURE
      }

      expect(introspector.lastResult).toEqual(resultSecondRun)
      expect(introspector.results).toEqual([resultFirstRun, resultSecondRun])

      blackboard.result = RUNNING

      bTree.step({ introspector })

      const resultThirdRun = {
        name: 'The Task',
        result: RUNNING
      }

      expect(introspector.lastResult).toEqual(resultThirdRun)
      expect(introspector.results).toEqual([resultFirstRun, resultSecondRun, resultThirdRun])
    })
  })

  describe('with nameless tasks', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: SUCCESS
      }

      bTree = new BehaviorTree({ tree: new Task({ run: () => RUNNING }), blackboard })
    })

    it('does not print a name', () => {
      bTree.step({ introspector })

      const resultFirstRun = {
        result: RUNNING
      }

      expect(introspector.lastResult).toEqual(resultFirstRun)
      expect(introspector.results).toEqual([resultFirstRun])
    })
  })

  describe('with nameless branching nodes', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: SUCCESS
      }

      bTree = new BehaviorTree({ tree: new Sequence({ nodes: ['simpleTask'] }), blackboard })
    })

    it('does not print a name', () => {
      bTree.step({ introspector })

      const resultFirstRun = {
        children: [
          {
            name: 'The Task',
            result: SUCCESS
          }
        ],
        result: SUCCESS
      }

      expect(introspector.lastResult).toEqual(resultFirstRun)
      expect(introspector.results).toEqual([resultFirstRun])
    })
  })

  describe('with a decorator', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: SUCCESS
      }
      const tree = new InvertDecorator({ name: 'inverter', node: 'simpleTask' })
      bTree = new BehaviorTree({ tree, blackboard })
    })

    it('shows Task and Decorator', () => {
      bTree.step({ introspector })

      const result = {
        name: 'inverter',
        result: FAILURE,
        children: [
          {
            name: 'The Task',
            result: SUCCESS
          }
        ]
      }

      expect(introspector.lastResult).toEqual(result)
      expect(introspector.results).toEqual([result])
    })
  })

  describe('with a selector', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: SUCCESS
      }
    })

    it('does not show task that did not run', () => {
      const tree = new Selector({ name: 'select', nodes: ['simpleTask', 'failingTask'] })
      bTree = new BehaviorTree({ tree, blackboard })

      bTree.step({ introspector })

      const result = {
        name: 'select',
        result: SUCCESS,
        children: [
          {
            name: 'The Task',
            result: SUCCESS
          }
        ]
      }

      expect(introspector.lastResult).toEqual(result)
      expect(introspector.results).toEqual([result])
    })

    it('show all tasks if all did run', () => {
      const tree = new Selector({ name: 'select', nodes: ['failingTask', 'simpleTask'] })
      bTree = new BehaviorTree({ tree, blackboard })

      bTree.step({ introspector })

      const result = {
        name: 'select',
        result: SUCCESS,
        children: [
          {
            name: 'Bumm',
            result: FAILURE
          },
          {
            name: 'The Task',
            result: SUCCESS
          }
        ]
      }

      expect(introspector.lastResult).toEqual(result)
      expect(introspector.results).toEqual([result])
    })

    it('does not show more then was running', () => {
      const tree = new Selector({ name: 'select', nodes: ['runningTask', 'simpleTask'] })
      bTree = new BehaviorTree({ tree, blackboard })

      bTree.step({ introspector })

      const result = {
        name: 'select',
        result: RUNNING,
        children: [
          {
            name: 'Forest',
            result: RUNNING
          }
        ]
      }

      expect(introspector.lastResult).toEqual(result)
      expect(introspector.results).toEqual([result])
    })
  })

  describe('a full scale tree', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: SUCCESS
      }
    })

    it('shows all that did run', () => {
      const invertedSimple = new InvertDecorator({ node: 'simpleTask' })
      const selector1 = new Selector({ name: 'select1', nodes: ['failingTask', 'simpleTask'] })
      const selector2 = new Selector({ name: 'select2', nodes: [invertedSimple, 'simpleTask', 'failingTask'] })

      const tree = new Sequence({ name: 'sequence', nodes: [selector1, selector2] })
      bTree = new BehaviorTree({ tree, blackboard })

      bTree.step({ introspector })

      const result = {
        name: 'sequence',
        result: SUCCESS,
        children: [
          {
            name: 'select1',
            result: SUCCESS,
            children: [
              {
                name: 'Bumm',
                result: FAILURE
              },
              {
                name: 'The Task',
                result: SUCCESS
              }
            ]
          },
          {
            name: 'select2',
            result: SUCCESS,
            children: [
              {
                result: FAILURE,
                children: [
                  {
                    name: 'The Task',
                    result: SUCCESS
                  }
                ]
              },
              {
                name: 'The Task',
                result: SUCCESS
              }
            ]
          }
        ]
      }

      expect(introspector.lastResult).toEqual(result)
      expect(introspector.results).toEqual([result])
    })
  })

  describe('with a Random node', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: SUCCESS
      }
      bTree = new BehaviorTree({ tree: new Random({ nodes: ['simpleTask', 'failingTask'] }), blackboard })
    })

    it('cleans the results', () => {
      for (let i = 10; i--; ) {
        bTree.step({ introspector })
      }
      expect(introspector.lastResult).not.toEqual(null)
      expect(introspector.results.length).toEqual(10)

      expect(introspector.lastResult).toEqual(
        expect.objectContaining({
          children: [{ name: expect.any(String), result: expect.any(Boolean) }],
          result: expect.any(Boolean)
        })
      )
    })
  })

  describe('.reset method', () => {
    it('cleans the results', () => {
      bTree = new BehaviorTree({ tree: 'simpleTask', blackboard: {} })
      bTree.step({ introspector })

      expect(introspector.lastResult).not.toEqual(null)
      expect(introspector.results).not.toEqual([])

      introspector.reset()

      expect(introspector.lastResult).toEqual(null)
      expect(introspector.results).toEqual([])
    })
  })

  describe('having a custom introspector module', () => {
    class BlackboardChangesIntrospector extends Introspector {
      start(tree) {
        this.blackboardSnap = JSON.stringify(tree.blackboard)
        super.start(tree)
      }

      _toResult(node, result, blackboard) {
        const newSnap = JSON.stringify(blackboard)
        const blackboardChanged = newSnap !== this.blackboardSnap
        this.blackboardSnap = newSnap
        return {
          ...(node.name ? { name: node.name } : {}),
          result,
          blackboardChanged
        }
      }
    }
    beforeEach(() => {
      introspector = new BlackboardChangesIntrospector()
    })

    it('also has the blackboard available', () => {
      bTree = new BehaviorTree({ tree: new Sequence({ nodes: ['simpleTask', 'failingTask'] }), blackboard })
      bTree.step({ introspector })
      expect(introspector.lastResult.children.map((x) => x.blackboardChanged)).toEqual([true, false])
    })
  })
})
