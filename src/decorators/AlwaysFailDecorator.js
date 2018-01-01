import { RUNNING, FAILURE } from '../constants'
import { createDecorator } from '../Decorator'

export default createDecorator(run => {
  const result = run()
  if (result === RUNNING) return RUNNING
  return FAILURE
})
