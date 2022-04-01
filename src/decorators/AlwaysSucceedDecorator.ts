import { RUNNING, SUCCESS } from '../constants';
import Decorator from '../Decorator';
import { RunCallback } from '../types';

export default class AlwaysSucceedDecorator extends Decorator {
  nodeType = 'AlwaysSucceedDecorator';

  decorate(run: RunCallback) {
    const result = run();
    if (result === RUNNING) return RUNNING;
    return SUCCESS;
  }
}
