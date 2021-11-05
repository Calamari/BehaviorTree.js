import { RUNNING, FAILURE } from '../constants';
import Decorator from '../Decorator';
import { Callback } from '../types';

export default class AlwaysFailDecorator extends Decorator {
  nodeType = 'AlwaysFailDecorator';

  decorate(run: Callback) {
    const result = run();
    if (result === RUNNING) return RUNNING;
    return FAILURE;
  }
}
