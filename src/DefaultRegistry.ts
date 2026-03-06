import Node from './Node';
import { NodeRegistry } from './NodeRegistry';

const registry = new NodeRegistry();

export function getRegistry() {
  return registry;
}

export function registryLookUp(node: string | Node) {
  return registry.lookUp(node);
}
