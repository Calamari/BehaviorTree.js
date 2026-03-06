import Node from './Node';
import Task from './Task';
import { NodeOrFunction } from './types';

export class NodeRegistry {
  private registry: Record<string, Node> = {};

  register(name: string, node: NodeOrFunction) {
    this.registry[name] = typeof node === 'function' ? new Task({ name, run: node }) : node;
  }

  clean() {
    this.registry = {};
  }

  lookUp(node: string | Node) {
    if (typeof node === 'string') {
      const lookedUpNode = this.registry[node];
      if (!lookedUpNode) {
        throw new Error(`No node with name ${node} registered.`);
      }
      return lookedUpNode;
    }
    return node;
  }
}
