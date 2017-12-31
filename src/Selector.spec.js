/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import Selector from './Selector'
import Task from './Task'

describe('Selector', () => {
  let countSuccess = 0
  const successTask = new Task({
    run: function () {
      ++countSuccess
      return SUCCESS
    }
  })

  let countFail = 0
  const failTask = new Task({
    run: function () {
      ++countFail
      return FAILURE
    }
  })

  let countRunning = 0
  const runningTask = new Task({
    run: function () {
      ++countRunning
      return RUNNING
    }
  })

  beforeEach(() => {
    countSuccess = 0
    countFail = 0
    countRunning = 0
  })

  it('stops immediately at a successfull node', () => {
    const selector = new Selector({
      nodes: [
        successTask,
        failTask
      ]
    })

    selector.run()

    expect(countSuccess).toEqual(1)
    expect(countFail).toEqual(0)
  })

  it('stops at a successfull node', () => {
    const selector = new Selector({
      nodes: [
        failTask,
        successTask,
        successTask,
        successTask,
        failTask
      ]
    })

    selector.run()

    expect(countSuccess).toEqual(1)
    expect(countFail).toEqual(1)
  })

  it('calls all tasks if all fail', () => {
    const selector = new Selector({
      nodes: [
        failTask,
        failTask,
        failTask,
        failTask
      ]
    })

    selector.run()

    expect(countSuccess).toEqual(0)
    expect(countFail).toEqual(4)
  })

  it('does not call tasks after running task', () => {
    const selector = new Selector({
      nodes: [
        failTask,
        failTask,
        runningTask,
        failTask
      ]
    })

    selector.run()
    expect(countFail).toEqual(2)
    expect(countRunning).toEqual(1)
  })

  describe('result values', () => {
    it('returns SUCCESS if one task succeeds', () => {
      const selector = new Selector({
        nodes: [
          failTask,
          successTask,
          failTask
        ]
      })

      expect(selector.run()).toEqual(SUCCESS)
    })

    it('returns FAILURE if no task succeeds', () => {
      const selector = new Selector({
        nodes: [
          failTask,
          failTask,
          failTask,
          failTask
        ]
      })

      expect(selector.run()).toEqual(FAILURE)
    })

    it('returns the index of still running task as array of running indexes', () => {
      const selector = new Selector({
        nodes: [
          failTask,
          failTask,
          runningTask,
          failTask
        ]
      })

      expect(selector.run()).toEqual([2])
    })
  })

  describe('blackboard', () => {
    const aTask = new Task({
      run: function (blackboard) {
        ++blackboard.counter
        return FAILURE
      }
    })
    const bTask = new Task({
      run: function (blackboard) {
        blackboard.counter += 10
        return FAILURE
      }
    })

    it('can be passed to a task, and stores data between different tasks', () => {
      const selector = new Selector({
        nodes: [
          aTask,
          bTask
        ]
      })
      const blackboard = { counter: 0 }

      selector.run(blackboard)

      expect(blackboard.counter).toEqual(11)
    })
  })

  describe('nested selectors', () => {
    const aTask = new Task({
      run: function (blackboard) {
        ++blackboard.aCounter
        return FAILURE
      }
    })
    const bTask = new Task({
      run: function (blackboard) {
        ++blackboard.bCounter
        return FAILURE
      }
    })

    it('calls all nested tasks if all are failing', () => {
      const selector = new Selector({
        nodes: [
          aTask,
          aTask,
          new Selector({
            nodes: [
              bTask,
              bTask,
              bTask
            ]
          })
        ]
      })
      const blackboard = { aCounter: 0, bCounter: 0 }

      selector.run(blackboard)

      expect(blackboard.aCounter).toEqual(2)
      expect(blackboard.bCounter).toEqual(3)
    })

    describe('running tasks', () => {
      const switchTask = new Task({
        run: function (blackboard) {
          ++blackboard.switchCounter
          return blackboard.switchResult
        }
      })

      const selector = new Selector({
        nodes: [
          aTask,
          aTask,
          new Selector({
            nodes: [
              bTask,
              switchTask,
              bTask
            ]
          }),
          aTask
        ]
      })

      it('returns indexes if tasks are running', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING }

        const result = selector.run(blackboard)

        expect(blackboard.aCounter).toEqual(2)
        expect(blackboard.bCounter).toEqual(1)
        expect(result).toEqual([2, 1])
      })

      it('resumes tasks where we left off', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING }

        let result = selector.run(blackboard)

        expect(blackboard.switchCounter).toEqual(1)
        expect(result).toEqual([2, 1])

        result = selector.run(blackboard, { indexes: result })

        expect(blackboard.switchCounter).toEqual(2)
        expect(blackboard.aCounter).toEqual(2)
        expect(blackboard.bCounter).toEqual(1)
        expect(result).toEqual([2, 1])
      })

      it('after resuming in can progress, if tasks allow', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING }

        let result = selector.run(blackboard)

        expect(blackboard.switchCounter).toEqual(1)
        expect(result).toEqual([2, 1])

        blackboard.switchResult = FAILURE

        result = selector.run(blackboard, { indexes: result })

        expect(blackboard.switchCounter).toEqual(2)
        expect(blackboard.aCounter).toEqual(3)
        expect(blackboard.bCounter).toEqual(2)
        expect(result).toEqual(FAILURE)
      })

      it('after resuming in can progress, if tasks allow', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING }

        let result = selector.run(blackboard)

        expect(blackboard.switchCounter).toEqual(1)
        expect(result).toEqual([2, 1])

        blackboard.switchResult = SUCCESS

        result = selector.run(blackboard, { indexes: result })

        expect(blackboard.switchCounter).toEqual(2)
        // No count increments because of success
        expect(blackboard.aCounter).toEqual(2)
        expect(blackboard.bCounter).toEqual(1)
        expect(result).toEqual(SUCCESS)
      })
    })
  })
})
