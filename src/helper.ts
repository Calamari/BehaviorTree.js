import { RunResult, NodeOrRegistration, RegistryLookUp } from './types';
import { RUNNING } from './constants';

export function isRunning(result: RunResult | undefined): boolean {
  return result === RUNNING || (typeof result === 'object' && result.total === RUNNING);
}

export const defaultRegistryLookUp: RegistryLookUp = (node: NodeOrRegistration) => {
  if (typeof node === 'string') {
    throw new Error(`No registry provided to look up node "${node}". Did you mean to use BehaviorTree?`);
  }
  return node;
};
