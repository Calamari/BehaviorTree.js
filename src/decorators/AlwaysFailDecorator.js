import { RUNNING, FAILURE } from '../constants'
import Decorator from '../Decorator'

export default class AlwaysFailDecorator extends Decorator {
  nodeType = 'AlwaysFailDecorator'

  decorate (run) {
    const result = run()
    if (result === RUNNING) return RUNNING
    return FAILURE
  }
}
