/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import Random from './Random'
import Task from './Task'

describe('Random', () => {
  const task1 = new Task({
    run: function (blackboard) {
      blackboard.callStack.push('task1')
      ++blackboard.count
      return blackboard.result
    }
  })
  const task2 = new Task({
    run: function (blackboard) {
      blackboard.callStack.push('task2')
      ++blackboard.count
      return blackboard.result
    }
  })
  const task3 = new Task({
    run: function (blackboard) {
      blackboard.callStack.push('task3')
      ++blackboard.count
      return blackboard.result
    }
  })
  let blackboard

  beforeEach(() => {
    blackboard = {
      callStack: [],
      count: 0,
      result: SUCCESS
    }
  })

  it('chooses one node per random and runs that', () => {
    const random = new Random({
      nodes: [
        task1,
        task2,
        task3
      ]
    })

    random.run(blackboard)

    expect(blackboard.count).toEqual(1)
  })

  it('returns the value of the called task', () => {
    const random = new Random({
      nodes: [
        task1,
        task2,
        task3
      ]
    })

    blackboard.result = SUCCESS
    expect(random.run(blackboard)).toEqual(SUCCESS)

    blackboard.result = FAILURE
    expect(random.run(blackboard)).toEqual(FAILURE)

    blackboard.result = RUNNING
    expect(random.run(blackboard).constructor).toEqual(Array)
  })

  it('calls the the same task all over again when it is running', () => {
    const random = new Random({
      nodes: [
        task1,
        task2,
        task3
      ]
    })

    blackboard.result = RUNNING
    random.run(blackboard, { indexes: [2], rerun: true })
    random.run(blackboard, { indexes: [2], rerun: true })
    random.run(blackboard, { indexes: [2], rerun: true })
    expect(blackboard.callStack[0]).toEqual('task3')
    expect(blackboard.callStack[1]).toEqual('task3')
    expect(blackboard.callStack[2]).toEqual('task3')
  })
})
