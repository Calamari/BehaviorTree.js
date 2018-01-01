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
  const decorate = new AlwaysFailDecorator()

  it('changes SUCCESS to FAILURE', () => {
    expect(decorate(task).run({ result: SUCCESS })).toEqual(FAILURE)
    expect(decorate(task).run({ result: FAILURE })).toEqual(FAILURE)
  })

  it('does not change RUNNING responses', () => {
    expect(decorate(task).run({ result: RUNNING })).toEqual(RUNNING)
  })
})
