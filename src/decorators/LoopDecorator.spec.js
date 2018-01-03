/* eslint-env jest */
import { SUCCESS, FAILURE } from '../constants'
import LoopDecorator from './LoopDecorator'
import Task from '../Task'

describe('LoopDecorator', () => {
  const task = new Task({
    run (blackboard) {
      ++blackboard.count
      return SUCCESS
    }
  })
  const endingTask = new Task({
    run (blackboard) {
      ++blackboard.count
      return blackboard.count === 2 ? FAILURE : SUCCESS
    }
  })
  const inifinityTask = new Task({
    run (blackboard) {
      ++blackboard.count
      return blackboard.count === 100 ? FAILURE : SUCCESS
    }
  })
  let blackboard
  let decoratedTask
  let decoratedEndingTask
  let decoratedInfinityTask

  beforeEach(() => {
    blackboard = {
      count: 0
    }
    decoratedTask = new LoopDecorator({ node: task })
  })

  it('has a nodeType', () => {
    expect(decoratedTask.nodeType).toEqual('LoopDecorator')
  })

  describe('given a looping count', () => {
    beforeEach(() => {
      const config = { loop: 3 }
      decoratedTask = new LoopDecorator({ config, node: task })
      decoratedEndingTask = new LoopDecorator({ config, node: endingTask })
    })

    it('repeats the task that amount of times', () => {
      decoratedTask.run(blackboard)
      expect(blackboard.count).toEqual(3)
    })

    it('stops repeating if FAILURE is returned', () => {
      decoratedEndingTask.run(blackboard)
      expect(blackboard.count).toEqual(2)
    })
  })

  describe('without a looping count', () => {
    beforeEach(() => {
      decoratedInfinityTask = new LoopDecorator({ node: inifinityTask })
    })

    it('is looped indefinetely or until FAILURE occures', () => {
      decoratedInfinityTask.run(blackboard)
      expect(blackboard.count).toEqual(100)
    })
  })
})
