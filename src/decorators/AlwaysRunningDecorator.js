import { RUNNING, SUCCESS } from '../constants'
import Decorator from '../Decorator'

export default class AlwaysRunningDecorator extends Decorator {
  nodeType = 'AlwaysRunningDecorator'

  decorate (run) {
    const result = run()
    if ([RUNNING, SUCCESS].indexOf(result) !== -1) return RUNNING
    return result
  }
}
