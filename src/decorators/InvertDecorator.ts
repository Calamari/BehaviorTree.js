import { RUNNING, SUCCESS, FAILURE } from '../constants';
import Decorator from '../Decorator';
import { RunCallback } from '../types';

export default class InvertDecorator extends Decorator {
  nodeType = 'InvertDecorator';

  decorate(run: RunCallback) {
    const result = run();
    if (result === RUNNING) return RUNNING;
    return result === SUCCESS ? FAILURE : SUCCESS;
  }
}
