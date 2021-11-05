import { FAILURE } from '../constants';
import Decorator from '../Decorator';
import { Callback } from '../types';

export default class CooldownDecorator extends Decorator {
  lock: boolean = false;
  nodeType = 'CooldownDecorator';

  setConfig({ cooldown = 5 }) {
    this.config = {
      cooldown
    };
  }

  decorate(run: Callback) {
    if (this.lock) {
      return FAILURE;
    }
    this.lock = true;
    setTimeout(() => {
      this.lock = false;
    }, this.config.cooldown * 1000);
    return run();
  }
}
