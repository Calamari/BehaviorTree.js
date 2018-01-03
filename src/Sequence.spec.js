/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants'
import Sequence from './Sequence'
import Task from './Task'

describe('Sequence', () => {
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

  it('stops immediately at a failing node', () => {
    const selector = new Sequence({
      nodes: [
        failTask,
        successTask
      ]
    })

    selector.run()

    expect(countSuccess).toEqual(0)
    expect(countFail).toEqual(1)
  })

  it('stops at a failing node', () => {
    const selector = new Sequence({
      nodes: [
        successTask,
        successTask,
        failTask,
        failTask,
        successTask
      ]
    })

    selector.run()

    expect(countSuccess).toEqual(2)
    expect(countFail).toEqual(1)
  })

  it('calls all tasks if all are successful', () => {
    const selector = new Sequence({
      nodes: [
        successTask,
        successTask,
        successTask,
        successTask
      ]
    })

    selector.run()

    expect(countSuccess).toEqual(4)
    expect(countFail).toEqual(0)
  })

  it('does not call tasks after running task', () => {
    const selector = new Sequence({
      nodes: [
        successTask,
        successTask,
        runningTask,
        successTask
      ]
    })

    selector.run()
    expect(countSuccess).toEqual(2)
    expect(countRunning).toEqual(1)
  })

  describe('result values', () => {
    it('returns SUCCESS if all task succeeds', () => {
      const selector = new Sequence({
        nodes: [
          successTask,
          successTask,
          successTask
        ]
      })

      expect(selector.run()).toEqual(SUCCESS)
    })

    it('returns FAILURE if one task fails', () => {
      const selector = new Sequence({
        nodes: [
          successTask,
          failTask,
          successTask,
          successTask
        ]
      })

      expect(selector.run()).toEqual(FAILURE)
    })

    it('returns the index of still running task as array of running indexes', () => {
      const selector = new Sequence({
        nodes: [
          successTask,
          successTask,
          runningTask,
          successTask
        ]
      })

      expect(selector.run()).toEqual([2])
    })
  })

  describe('blackboard', () => {
    const aTask = new Task({
      run: function (blackboard) {
        ++blackboard.counter
        return SUCCESS
      }
    })
    const bTask = new Task({
      run: function (blackboard) {
        blackboard.counter += 10
        return SUCCESS
      }
    })

    it('can be passed to a task, and stores data between different tasks', () => {
      const selector = new Sequence({
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
        return SUCCESS
      }
    })
    const bTask = new Task({
      run: function (blackboard) {
        ++blackboard.bCounter
        return SUCCESS
      }
    })

    it('calls all nested tasks if all are succeeding', () => {
      const selector = new Sequence({
        nodes: [
          aTask,
          aTask,
          new Sequence({
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

      const selector = new Sequence({
        nodes: [
          aTask,
          aTask,
          new Sequence({
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

        blackboard.switchResult = SUCCESS

        result = selector.run(blackboard, { indexes: result })

        expect(blackboard.switchCounter).toEqual(2)
        expect(blackboard.aCounter).toEqual(3)
        expect(blackboard.bCounter).toEqual(2)
        expect(result).toEqual(SUCCESS)
      })

      it('after resuming in can progress, if tasks allow it', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING }

        let result = selector.run(blackboard)

        expect(blackboard.switchCounter).toEqual(1)
        expect(result).toEqual([2, 1])

        blackboard.switchResult = FAILURE

        result = selector.run(blackboard, { indexes: result })

        expect(blackboard.switchCounter).toEqual(2)
        // No count increments because of success
        expect(blackboard.aCounter).toEqual(2)
        expect(blackboard.bCounter).toEqual(1)
        expect(result).toEqual(FAILURE)
      })
    })

    describe('start and end callbacks', () => {
      const aTask = new Task({
        run: function (blackboard) {
          return SUCCESS
        }
      })
      const switchTask = new Task({
        start: function (blackboard) {
          ++blackboard.start
        },
        run: function (blackboard) {
          ++blackboard.run
          return blackboard.switchResult
        },
        end: function (blackboard) {
          ++blackboard.end
        }
      })

      it('start is not called again on further running node', () => {
        const selector = new Sequence({
          nodes: [
            aTask,
            aTask,
            switchTask,
            aTask
          ]
        })
        const blackboard = {
          switchResult: RUNNING,
          start: 0,
          run: 0,
          end: 0
        }

        let result = selector.run(blackboard)

        expect(blackboard.start).toEqual(1)
        expect(blackboard.run).toEqual(1)
        expect(blackboard.end).toEqual(0)

        let result2 = selector.run(blackboard, { indexes: result, rerun: true })

        expect(blackboard.start).toEqual(1)
        expect(blackboard.run).toEqual(2)
        expect(blackboard.end).toEqual(0)

        blackboard.switchResult = SUCCESS
        selector.run(blackboard, { indexes: result2, rerun: true })

        expect(blackboard.start).toEqual(1)
        expect(blackboard.run).toEqual(3)
        expect(blackboard.end).toEqual(1)

        selector.run(blackboard)

        expect(blackboard.start).toEqual(2)
        expect(blackboard.run).toEqual(4)
        expect(blackboard.end).toEqual(2)
      })

      it('first node running also works the same way')
    })
  })
})
