/* eslint-disable @typescript-eslint/no-explicit-any */
import Introspector from './Introspector';
import Node from './Node';

export type Status = symbol | boolean;
export type RunResult = Status | StatusWithState | undefined;

export interface StatusWithState {
  total: Status;
  state: Array<RunResult>;
}

export type Blackboard = Record<string, any>;
export type DecoratorConfig = Record<string, any>;
export type EndCallback = (...args: any[]) => void;
export type RunCallback = (...args: any[]) => Status;
export type StartCallback = (...args: any[]) => void;
export type RegistryLookUp = (node: NodeOrRegistration) => Node;

export interface IntrospectionResult {
  name?: string;
  result: Status;
  children?: IntrospectionResult[];
}

export type NodeOrRegistration = Node | string;
export type NodeOrFunction = Node | RunCallback;

export interface MinimalBlueprint {
  name?: string;
  end?: EndCallback;
  introspector?: Introspector;
  run?: RunCallback;
  start?: StartCallback;
  nodes?: NodeOrRegistration[];
  node?: NodeOrRegistration;
}
export interface Blueprint {
  name?: string;
  end: EndCallback;
  introspector?: Introspector;
  run: RunCallback;
  start: StartCallback;
  nodes?: NodeOrRegistration[];
  node?: NodeOrRegistration;
}
export interface DecoratorBlueprint extends MinimalBlueprint {
  config?: DecoratorConfig;
}

export interface RunConfig {
  introspector?: Introspector;
  registryLookUp?: RegistryLookUp;
  rerun?: boolean;
  lastRun?: RunResult;
}

export interface ParallelRunConfig extends RunConfig {
  lastRun?: RunResult | undefined;
}

export interface StepParameter {
  introspector?: Introspector;
}

export interface ImportableJson {
  type: string;
  name?: string;
  node?: ImportableJson;
  nodes?: ImportableJson[];
}
