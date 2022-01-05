import { StatusWithState } from '.';
import { RUNNING } from './constants';
import { Blackboard, Blueprint, MinimalBlueprint, RunConfig, Status } from './types';

const NOOP_RUN = () => false;
const NOOP_START = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
const NOOP_END = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export default class Node {
  _name?: string;
  blueprint: Blueprint;
  nodeType = 'Node';

  constructor({ run = NOOP_RUN, start = NOOP_START, end = NOOP_END, ...props }: MinimalBlueprint) {
    this.blueprint = { run, start, end, ...props };
  }

  run(
    blackboard: Blackboard,
    { introspector, rerun = false, registryLookUp = (x) => x as Node, ...config }: RunConfig = {}
  ): Status | StatusWithState {
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
