import { Introspector } from '.';
import { RUNNING } from './constants';
import Node from './Node';
import Task from './Task';
import { Blackboard, Status, StepParameter } from './types';

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
  tree: Node;
  blackboard: Blackboard;
  lastResult: Status | null;

  constructor({ tree, blackboard }: { tree: Node; blackboard: Blackboard }) {
    this.tree = tree;
    this.blackboard = blackboard;
    this.lastResult = null;
  }

  step({ introspector }: StepParameter = {}) {
    const indexes = this.lastResult && typeof this.lastResult === 'object' ? this.lastResult : [];
    const rerun = this.lastResult === RUNNING || indexes.length > 0;
    if (introspector) {
      introspector.start(this);
    }
    this.lastResult = registryLookUp(this.tree).run(this.blackboard, {
      indexes,
      introspector,
      rerun,
      registryLookUp
    });
    if (introspector) {
      introspector.end();
    }
  }

  static register(name: string, node: Node) {
    registry[name] = typeof node === 'function' ? new Task({ name, run: node }) : node;
  }

  static cleanRegistry() {
    registry = {};
  }
}
