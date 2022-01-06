import { FAILURE, SUCCESS, RUNNING } from './constants';
import BranchNode from './BranchNode';
import Node from './Node';
import { isRunning } from './helper';
import { Blackboard, MinimalBlueprint, NodeOrRegistration, RunConfig, Status, StatusWithState } from './types';
import { RunResult } from '.';

interface ParallelRunConfig extends RunConfig {
  lastRun?: StatusWithState | undefined;
}

export default class Parallel extends BranchNode {
  numNodes: number;
  wasRunning: boolean;
  nodes: NodeOrRegistration[];
  // Override this in subclasses
  OPT_OUT_CASE: Status = SUCCESS;
  START_CASE: Status = SUCCESS;

  nodeType = 'Parallel';

  constructor(blueprint: MinimalBlueprint) {
    super(blueprint);

    this.nodes = blueprint.nodes || [];
    this.numNodes = this.nodes.length;
    this.wasRunning = false;
  }

  run(blackboard: Blackboard = {}, { lastRun, introspector, rerun, registryLookUp = (x) => x as Node }: ParallelRunConfig = {}) {
    if (!rerun) this.blueprint.start(blackboard);
    const results: Array<RunResult> = [];
    for (let currentIndex = 0; currentIndex < this.numNodes; ++currentIndex) {
      if (lastRun && !isRunning(lastRun.state[currentIndex])) {
        results[currentIndex] = lastRun.state[currentIndex];
        continue;
      }
      const node = registryLookUp(this.nodes[currentIndex]);
      const result = node.run(blackboard, { lastRun, introspector, rerun, registryLookUp });
      results[currentIndex] = result;
    }
    const running = results.includes(RUNNING);
    if (!running) {
      this.blueprint.end(blackboard);
    }
    return running ? { total: RUNNING, state: results } : this.getResult(results);
  }

  protected getResult(results: Array<Status | StatusWithState>) {
    return results.includes(FAILURE) ? FAILURE : SUCCESS;
  }
}
