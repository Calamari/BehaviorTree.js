import { SUCCESS, FAILURE } from '../constants';
import Decorator from '../Decorator';
import { isRunning } from '../helper';
import { RunCallback } from '../types';

export default class InvertDecorator extends Decorator {
  nodeType = 'InvertDecorator';

  decorate(run: RunCallback) {
    const result = run();
    if (isRunning(result)) return result;
    return result === SUCCESS ? FAILURE : SUCCESS;
  }
}
