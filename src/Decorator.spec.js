/* eslint-env jest */
import { SUCCESS, FAILURE } from './constants'
import Decorator from './Decorator'
import Task from './Task'

describe('Decorator', () => {
  it('does nothing by itself', () => {
    const task = new Task({
      run (blackboard) {
        return blackboard.result
      }
    })
    expect(task.run({ result: SUCCESS })).toEqual(SUCCESS)
    expect(task.run({ result: FAILURE })).toEqual(FAILURE)

    const decoratedTask = new Decorator({ node: task })
    expect(decoratedTask.run({ result: SUCCESS })).toEqual(SUCCESS)
    expect(decoratedTask.run({ result: FAILURE })).toEqual(FAILURE)
  })
})
