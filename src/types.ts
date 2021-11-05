import { Introspector } from '.';
import { RUNNING } from './constants';
import Node from './Node';

export type Status = typeof RUNNING | boolean;

export type Blackboard = Record<string, any>;
export type DecoratorConfig = Record<string, any>;
export type Callback = (...args: any[]) => Status;
export type RegistryLookUp = (node: string | Node) => Node;

export interface Blueprint {
  name?: string;
  end: Callback;
  introspector?: Introspector;
  run: Callback;
  start: Callback;
  nodes?: Node[];
  node?: Node;
}

export interface RunConfig {
  introspector?: Introspector;
  registryLookUp?: RegistryLookUp;
  rerun?: boolean;
  indexes?: number[];
}

export interface StepParameter {
  introspector?: Introspector;
}
