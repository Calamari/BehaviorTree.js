import { StatusWithState } from '.';
import { SUCCESS, RUNNING } from './constants';
import Node from './Node';
import { Blackboard, MinimalBlueprint, NodeOrRegistration, RunConfig, Status } from './types';

export default class BranchNode extends Node {
  numNodes: number;
  nodes: NodeOrRegistration[];
  // Override this in subclasses
  OPT_OUT_CASE: Status = SUCCESS;
  START_CASE: Status = SUCCESS;

  nodeType = 'BranchNode';

  constructor(blueprint: MinimalBlueprint) {
    super(blueprint);

    this.nodes = blueprint.nodes || [];
    this.numNodes = this.nodes.length;
  }

  run(blackboard: Blackboard = {}, { lastRun, introspector, rerun, registryLookUp = (x) => x as Node }: RunConfig = {}) {
    if (!rerun) this.blueprint.start(blackboard);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let overallResult: Status | any = this.START_CASE;
    const results: Array<Status | StatusWithState> = [];
    const lastRunStates: Array<Status | StatusWithState> = (typeof lastRun === 'object' && lastRun.state) || [];
    const startingIndex = Math.max(
      lastRunStates.findIndex((x: any) => typeof x === 'object' || x === RUNNING),
      0
    );
    for (let currentIndex = 0; currentIndex < this.numNodes; ++currentIndex) {
      if (currentIndex < startingIndex) {
        // Keep last result
        results[currentIndex] = lastRunStates[currentIndex];
        continue;
      }
      const node = registryLookUp(this.nodes[currentIndex]);
      const result = node.run(blackboard, { lastRun: lastRunStates[currentIndex], introspector, rerun, registryLookUp });
      results[currentIndex] = result;

      if (result === RUNNING || typeof result === 'object') {
        overallResult = RUNNING;
        break;
      } else if (result === this.OPT_OUT_CASE) {
        overallResult = result;
        break;
      } else {
        rerun = false;
      }
    }
    const isRunning = overallResult === RUNNING || typeof overallResult === 'object';
    if (!isRunning) {
      this.blueprint.end(blackboard);
    }
    if (introspector) {
      const debugResult = isRunning ? RUNNING : overallResult;
      introspector.wrapLast(Math.min(startingIndex + 1, this.numNodes), this, debugResult, blackboard);
    }
    return overallResult === RUNNING ? { total: overallResult, state: results } : overallResult;
  }
}
