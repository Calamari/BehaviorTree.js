import { RUNNING, SUCCESS } from '../constants'
import Decorator from '../Decorator'

export default class AlwaysSucceedDecorator extends Decorator {
  nodeType = 'AlwaysSucceedDecorator'

  decorate (run) {
    const result = run()
    if (result === RUNNING) return RUNNING
    return SUCCESS
  }
}
