import { RUNNING, SUCCESS } from '../constants';
import Decorator from '../Decorator';
import { Callback } from '../types';

export default class AlwaysSucceedDecorator extends Decorator {
  nodeType = 'AlwaysSucceedDecorator';

  decorate(run: Callback) {
    const result = run();
    if (result === RUNNING) return RUNNING;
    return SUCCESS;
  }
}
