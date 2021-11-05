/* eslint-env jest */
import { SUCCESS, FAILURE, RUNNING } from './constants'
import Decorator from './Decorator'
import Task from './Task'

describe('Decorator', () => {
  it('does nothing by itself', () => {
    const task = new Task({
      run(blackboard) {
        return blackboard.result
      }
    })
    expect(task.run({ result: SUCCESS })).toEqual(SUCCESS)
    expect(task.run({ result: FAILURE })).toEqual(FAILURE)
    expect(task.run({ result: RUNNING })).toEqual(RUNNING)

    const decoratedTask = new Decorator({ node: task })
    expect(decoratedTask.run({ result: SUCCESS })).toEqual(SUCCESS)
    expect(decoratedTask.run({ result: FAILURE })).toEqual(FAILURE)
    expect(decoratedTask.run({ result: RUNNING })).toEqual(RUNNING)
  })

  it('can have a start and end callback', () => {
    const blackboard = { start: 0, end: 0, result: RUNNING }
    const task = new Task({
      run(blackboard) {
        return blackboard.result
      }
    })
    const decoratedTask = new Decorator({
      start: function (b) {
        ++b.start
      },
      end: function (b) {
        ++b.end
      },
      node: task
    })

    decoratedTask.run(blackboard)

    expect(blackboard.start).toEqual(1)
    expect(blackboard.end).toEqual(0)

    blackboard.result = FAILURE

    decoratedTask.run(blackboard, { rerun: true })

    expect(blackboard.start).toEqual(1)
    expect(blackboard.end).toEqual(1)
  })
})
