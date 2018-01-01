import { FAILURE } from '../constants'
import { createDecorator } from '../Decorator'

export default createDecorator((run, blackboard, { loop = Infinity }) => {
  let i = 0
  let result = FAILURE
  while (i++ < loop) {
    result = run()
    if (result === FAILURE) return FAILURE
  }
  return result
})
