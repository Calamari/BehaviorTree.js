import { RUNNING, SUCCESS, FAILURE } from '../constants';
import Decorator from '../Decorator';
import { Callback } from '../types';

export default class InvertDecorator extends Decorator {
  nodeType = 'InvertDecorator';

  decorate(run: Callback) {
    const result = run();
    if (result === RUNNING) return RUNNING;
    return result === SUCCESS ? FAILURE : SUCCESS;
  }
}
