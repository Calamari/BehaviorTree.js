import { SUCCESS, RUNNING } from './constants';
import Node from './Node';
import { Blackboard, Blueprint, RunConfig, Status } from './types';

export default class BranchNode extends Node {
  numNodes: number;
  wasRunning: boolean;
  nodes: Node[];
  // Override this in subclasses
  OPT_OUT_CASE: Status = SUCCESS;
  START_CASE: Status = SUCCESS;

  nodeType = 'BranchNode';

  constructor(blueprint: Blueprint) {
    super(blueprint);

    this.nodes = blueprint.nodes || [];
    this.numNodes = this.nodes.length;
    this.wasRunning = false;
  }

  run(blackboard: Blackboard = {}, { indexes = [], introspector, rerun, registryLookUp = (x) => x as Node }: RunConfig = {}) {
    if (!rerun) this.blueprint.start(blackboard);
    let overallResult: Status | any = this.START_CASE;
    let currentIndex = indexes.shift() || 0;
    while (currentIndex < this.numNodes) {
      const node = registryLookUp(this.nodes[currentIndex]);
      const result = node.run(blackboard, { indexes, introspector, rerun, registryLookUp });
      if (result === RUNNING) {
        this.wasRunning = true;
        overallResult = [currentIndex, ...indexes];
        break;
      } else if (typeof result === 'object') {
        // array
        overallResult = [...indexes, currentIndex, ...result];
        break;
      } else if (result === this.OPT_OUT_CASE) {
        overallResult = result;
        break;
      } else {
        this.wasRunning = false;
        rerun = false;
        ++currentIndex;
      }
    }
    const isRunning = overallResult === RUNNING || typeof overallResult === 'object';
    if (!isRunning) {
      this.blueprint.end(blackboard);
    }
    if (introspector) {
      const debugResult = isRunning ? RUNNING : overallResult;
      introspector.wrapLast(Math.min(currentIndex + 1, this.numNodes), this, debugResult, blackboard);
    }
    return overallResult;
  }
}
