import { RUNNING, FAILURE } from '../constants';
import Decorator from '../Decorator';
import { RunCallback } from '../types';

export default class AlwaysFailDecorator extends Decorator {
  nodeType = 'AlwaysFailDecorator';

  decorate(run: RunCallback) {
    const result = run();
    if (result === RUNNING) return RUNNING;
    return FAILURE;
  }
}
