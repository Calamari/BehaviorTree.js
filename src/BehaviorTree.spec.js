/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import BehaviorTree from './BehaviorTree'
import Sequence from './Sequence'
import Selector from './Selector'
import Task from './Task'

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

    // @TODO: Tree is only one task
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
})
