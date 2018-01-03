/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from '../constants'
import AlwaysFailDecorator from './AlwaysFailDecorator'
import Task from '../Task'

describe('AlwaysFailDecorator', () => {
  const task = new Task({
    run (blackboard) {
      return blackboard.result
    }
  })
  const decoratedTask = new AlwaysFailDecorator({ node: task })

  it('changes SUCCESS to FAILURE', () => {
    expect(decoratedTask.run({ result: SUCCESS })).toEqual(FAILURE)
    expect(decoratedTask.run({ result: FAILURE })).toEqual(FAILURE)
  })

  it('does not change RUNNING responses', () => {
    expect(decoratedTask.run({ result: RUNNING })).toEqual(RUNNING)
  })
})
