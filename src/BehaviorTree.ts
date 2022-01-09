import { isRunning } from './helper';
import Node from './Node';
import Task from './Task';
import { Blackboard, NodeOrFunction, NodeOrRegistration, Status, StatusWithState, StepParameter } from './types';

export type NodeRegistry = Record<string, Node>;

let registry: NodeRegistry = {};

export function getRegistry() {
  return registry;
}

export function registryLookUp(node: string | Node) {
  if (typeof node === 'string') {
    const lookedUpNode = registry[node];
    if (!lookedUpNode) {
      throw new Error(`No node with name ${node} registered.`);
    }
    return lookedUpNode;
  }
  return node;
}

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
    registry[name] = typeof node === 'function' ? new Task({ name, run: node }) : node;
  }

  static cleanRegistry() {
    registry = {};
  }
}
