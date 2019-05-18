/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from '../constants'
import AlwaysRunningDecorator from './AlwaysRunningDecorator'
import Task from '../Task'

describe('AlwaysRunningDecorator', () => {
  const task = new Task({
    run (blackboard) {
      return blackboard.result
    }
  })
  const decoratedTask = new AlwaysRunningDecorator({ node: task })

  it('changes SUCCESS to RUNNING', () => {
    expect(decoratedTask.run({ result: SUCCESS })).toEqual(RUNNING)
    expect(decoratedTask.run({ result: RUNNING })).toEqual(RUNNING)
  })

  it('fails on FAILURE', () => {
    expect(decoratedTask.run({ result: FAILURE })).toEqual(FAILURE)
  })
})
