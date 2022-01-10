import { FAILURE } from '../constants';
import Decorator from '../Decorator';
import { isRunning } from '../helper';
import { RunCallback } from '../types';

export default class CooldownDecorator extends Decorator {
  lock = false;
  nodeType = 'CooldownDecorator';

  setConfig({ cooldown = 5 }) {
    this.config = {
      cooldown
    };
  }

  decorate(run: RunCallback) {
    if (this.lock) {
      return FAILURE;
    }
    const result = run();
    if (!isRunning(result)) {
      this.lock = true;
      setTimeout(() => {
        this.lock = false;
      }, this.config.cooldown * 1000);
    }
    return result;
  }
}
