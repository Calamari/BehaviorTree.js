/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import BehaviorTree from './BehaviorTree'
import Task from './Task'
import Introspector from './Introspector'

describe('Introspector', () => {
  let bTree
  let blackboard
  let introspector

  beforeEach(() => {
    introspector = new Introspector()
  })

  it('is empty initially', () => {
    expect(introspector.lastResult).toEqual(null)
    expect(introspector.results).toEqual([])
  })

  describe('with the simplest tree possible', () => {
    beforeEach(() => {
      blackboard = {
        start: 0,
        run: 0,
        end: 0,
        result: SUCCESS
      }
      const tree = new Task({
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
      bTree = new BehaviorTree({ tree, blackboard })
    })

    it('puts in the result of the last run', () => {
      bTree.step({ introspector })

      const resultFirstRun = [
        {
          name: 'The Task',
          result: SUCCESS
        }
      ]

      expect(introspector.lastResult).toEqual(resultFirstRun)
      expect(introspector.results).toEqual([resultFirstRun])

      blackboard.result = FAILURE

      bTree.step({ introspector })

      const resultSecondRun = [
        {
          name: 'The Task',
          result: FAILURE
        }
      ]

      expect(introspector.lastResult).toEqual(resultSecondRun)
      expect(introspector.results).toEqual([resultFirstRun, resultSecondRun])

      blackboard.result = RUNNING

      bTree.step({ introspector })

      const resultThirdRun = [
        {
          name: 'The Task',
          result: RUNNING
        }
      ]

      expect(introspector.lastResult).toEqual(resultThirdRun)
      expect(introspector.results).toEqual([resultFirstRun, resultSecondRun, resultThirdRun])
    })
  })
})
