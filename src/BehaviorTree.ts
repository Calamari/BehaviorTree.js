import { isRunning } from './helper';
import { Blackboard, NodeOrFunction, NodeOrRegistration, Status, StatusWithState, StepParameter } from './types';
import { getRegistry, registryLookUp } from './DefaultRegistry';

export default class BehaviorTree {
  tree: NodeOrRegistration;
  blackboard: Blackboard;
  lastResult?: Status | StatusWithState;

  constructor({ tree, blackboard }: { tree: NodeOrRegistration; blackboard: Blackboard }) {
    this.tree = tree;
    this.blackboard = blackboard;
    this.lastResult = undefined;
  }

  step({ introspector }: StepParameter = {}) {
    const lastRun = this.lastResult && typeof this.lastResult === 'object' ? this.lastResult : undefined;
    const rerun = isRunning(this.lastResult);
    if (introspector) {
      introspector.start(this);
    }
    this.lastResult = registryLookUp(this.tree).run(this.blackboard, {
      lastRun,
      introspector,
      rerun,
      registryLookUp
    });
    if (introspector) {
      introspector.end();
    }
  }

  static register(name: string, node: NodeOrFunction) {
    getRegistry().register(name, node);
  }

  static cleanRegistry() {
    getRegistry().clean();
  }
}
