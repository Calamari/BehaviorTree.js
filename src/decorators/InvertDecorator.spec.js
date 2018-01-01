/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from '../constants'
import InvertDecorator from './InvertDecorator'
import Task from '../Task'

describe('InvertDecorator', () => {
  const task = new Task({
    run (blackboard) {
      return blackboard.result
    }
  })
  const invert = new InvertDecorator()

  it('inverts SUCCESS and FAILURES', () => {
    expect(invert(task).run({ result: SUCCESS })).toEqual(FAILURE)
    expect(invert(task).run({ result: FAILURE })).toEqual(SUCCESS)
  })

  it('does not change RUNNING responses', () => {
    expect(invert(task).run({ result: RUNNING })).toEqual(RUNNING)
  })
})
