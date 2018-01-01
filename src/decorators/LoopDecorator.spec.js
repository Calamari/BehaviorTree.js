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

  beforeEach(() => {
    blackboard = {
      count: 0
    }
  })

  describe('given a looping count', () => {
    const decorate = new LoopDecorator({ loop: 3 })

    it('repeats the task that amount of times', () => {
      decorate(task).run(blackboard)
      expect(blackboard.count).toEqual(3)
    })

    it('stops repeating if FAILURE is returned', () => {
      decorate(endingTask).run(blackboard)
      expect(blackboard.count).toEqual(2)
    })
  })

  describe('without a looping count', () => {
    const decorate = new LoopDecorator()

    it('is looped indefinetely or until FAILURE occures', () => {
      decorate(inifinityTask).run(blackboard)
      expect(blackboard.count).toEqual(100)
    })
  })
})
