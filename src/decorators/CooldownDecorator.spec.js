/* eslint-env jest */
import sinon from 'sinon'
import { SUCCESS, FAILURE } from '../constants'
import CooldownDecorator from './CooldownDecorator'
import Task from '../Task'

describe('CooldownDecorator', () => {
  const task = new Task({
    run (blackboard) {
      ++blackboard.count
      return SUCCESS
    }
  })
  let decoratedTask
  let blackboard
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    blackboard = {
      count: 0
    }
    decoratedTask = decorate(task)
  })

  afterEach(() => {
    clock.restore()
  })

  const decorate = new CooldownDecorator({ cooldown: 3 })
  const decorate5sec = new CooldownDecorator({ cooldown: 5 })

  it('calls the task on first call', () => {
    decoratedTask.run(blackboard)
    expect(blackboard.count).toEqual(1)
  })

  it('needs cooldown seconds before task will be called again and returns FAILURE in the meantime', () => {
    expect(decoratedTask.run(blackboard)).toEqual(SUCCESS)
    expect(blackboard.count).toEqual(1)

    expect(decoratedTask.run(blackboard)).toEqual(FAILURE)
    expect(blackboard.count).toEqual(1)

    clock.tick(2999)
    expect(decoratedTask.run(blackboard)).toEqual(FAILURE)
    expect(blackboard.count).toEqual(1)

    clock.tick(1)
    expect(decoratedTask.run(blackboard)).toEqual(SUCCESS)
    expect(blackboard.count).toEqual(2)
  })

  it('different cooldown tasks dont interfer with each other', () => {
    const decoratedTask2 = decorate5sec(task)
    expect(decoratedTask.run(blackboard)).toEqual(SUCCESS)
    expect(decoratedTask2.run(blackboard)).toEqual(SUCCESS)
    expect(blackboard.count).toEqual(2)

    clock.tick(3000)
    expect(decoratedTask.run(blackboard)).toEqual(SUCCESS)
    expect(decoratedTask2.run(blackboard)).toEqual(FAILURE)
    expect(blackboard.count).toEqual(3)

    clock.tick(2000)
    expect(decoratedTask.run(blackboard)).toEqual(FAILURE)
    expect(decoratedTask2.run(blackboard)).toEqual(SUCCESS)
    expect(blackboard.count).toEqual(4)
  })
})
