import { SUCCESS } from '../constants';
import Decorator from '../Decorator';
import { isRunning } from '../helper';
import { RunCallback } from '../types';

export default class AlwaysSucceedDecorator extends Decorator {
  nodeType = 'AlwaysSucceedDecorator';

  decorate(run: RunCallback) {
    const result = run();
    if (isRunning(result)) return result;
    return SUCCESS;
  }
}
