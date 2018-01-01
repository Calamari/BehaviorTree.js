/* eslint-env jest */
import { SUCCESS, FAILURE } from './constants'
import { createDecorator } from './Decorator'
import Task from './Task'

describe('Decorator', () => {
  describe('#createDecorator', () => {
    it('makes it easy to create a Decorator', () => {
      const task = new Task({
        run (blackboard) {
          return blackboard.result
        }
      })
      expect(task.run({ result: SUCCESS })).toEqual(SUCCESS)
      expect(task.run({ result: FAILURE })).toEqual(FAILURE)

      const InvertDecorator = createDecorator(run => {
        return run() === SUCCESS ? FAILURE : SUCCESS
      })
      const invert = new InvertDecorator()
      const invertedTask = invert(task)

      expect(invertedTask.run({ result: SUCCESS })).toEqual(FAILURE)
      expect(invertedTask.run({ result: FAILURE })).toEqual(SUCCESS)
    })

    it('can use the blackboard for logic', () => {
      const task = new Task({
        run (blackboard) {
          ++blackboard.count
          return SUCCESS
        }
      })

      const ConditionalDecorator = createDecorator((run, blackboard) => {
        if (blackboard.dontCall) {
          return FAILURE
        }
        return run()
      })
      const decorator = new ConditionalDecorator()
      const decoratedTask = decorator(task)
      const blackboard = { count: 0, dontCall: true }

      let result = decoratedTask.run(blackboard)

      expect(result).toEqual(FAILURE)
      expect(blackboard.count).toEqual(0)

      blackboard.dontCall = false
      result = decoratedTask.run(blackboard)

      expect(result).toEqual(SUCCESS)
      expect(blackboard.count).toEqual(1)
    })
  })
})
