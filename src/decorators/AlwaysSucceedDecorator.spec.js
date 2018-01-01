/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from '../constants'
import AlwaysSucceedDecorator from './AlwaysSucceedDecorator'
import Task from '../Task'

describe('AlwaysSuccessDecorator', () => {
  const task = new Task({
    run (blackboard) {
      return blackboard.result
    }
  })
  const decorate = new AlwaysSucceedDecorator()

  it('changes SUCCESS to FAILURE', () => {
    expect(decorate(task).run({ result: SUCCESS })).toEqual(SUCCESS)
    expect(decorate(task).run({ result: FAILURE })).toEqual(SUCCESS)
  })

  it('does not change RUNNING responses', () => {
    expect(decorate(task).run({ result: RUNNING })).toEqual(RUNNING)
  })
})
