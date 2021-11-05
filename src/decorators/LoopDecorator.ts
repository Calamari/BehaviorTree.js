import { FAILURE } from '../constants';
import Decorator from '../Decorator';
import { Callback, Status } from '../types';

export default class LoopDecorator extends Decorator {
  nodeType = 'LoopDecorator';

  setConfig({ loop = Infinity }) {
    this.config = {
      loop
    };
  }

  decorate(run: Callback) {
    let i = 0;
    let result: Status = FAILURE;
    while (i++ < this.config.loop) {
      result = run();
      if (result === FAILURE) return FAILURE;
    }
    return result;
  }
}
