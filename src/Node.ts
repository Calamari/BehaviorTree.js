import { RUNNING } from './constants';
import { Blackboard, Blueprint, Callback, RunConfig, Status } from './types';

const NOOP: Callback = () => false;

export default class Node {
  _name?: string;
  blueprint: Blueprint;
  nodeType = 'Node';

  constructor({ run = NOOP, start = NOOP, end = NOOP, ...props }) {
    this.blueprint = { run, start, end, ...props };
  }

  run(blackboard: Blackboard, { introspector, rerun = false, registryLookUp = (x) => x as Node, ...config }: RunConfig = {}): Status {
    if (!rerun) this.blueprint.start(blackboard);
    const result = this.blueprint.run(blackboard, { ...config, rerun, registryLookUp });
    if (result !== RUNNING) {
      this.blueprint.end(blackboard);
    }
    if (introspector) {
      introspector.push(this, result, blackboard);
    }
    return result;
  }

  get name(): string | undefined {
    return this._name || this.blueprint.name;
  }

  set name(name: string | undefined) {
    this._name = name;
  }
}
