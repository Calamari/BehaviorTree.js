import { FAILURE } from '../constants';
import Decorator from '../Decorator';
import { isRunning } from '../helper';
import { RunCallback } from '../types';

export default class AlwaysFailDecorator extends Decorator {
  nodeType = 'AlwaysFailDecorator';

  decorate(run: RunCallback) {
    const result = run();
    if (isRunning(result)) return result;
    return FAILURE;
  }
}
