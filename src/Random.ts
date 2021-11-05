import { RUNNING } from './constants';
import BranchNode from './BranchNode';
import Node from './Node';
import { Blackboard, RunConfig, Status } from './types';

export default class Random extends BranchNode {
  nodeType = 'Random';

  run(blackboard: Blackboard = null, { indexes = [], introspector, rerun, registryLookUp = (x) => x as Node }: RunConfig = {}) {
    if (!rerun) this.blueprint.start(blackboard);
    let currentIndex = indexes.shift() || 0;
    if (!rerun) {
      currentIndex = Math.floor(Math.random() * this.numNodes);
    }
    const node = registryLookUp(this.nodes[currentIndex]);
    const result = node.run(blackboard, { indexes, introspector, rerun, registryLookUp });
    let overallResult: Status | any = result;
    if (result === RUNNING) {
      overallResult = [currentIndex, ...indexes];
    } else if (typeof result === 'object') {
      // array
      overallResult = [...indexes, currentIndex, ...result];
    }
    const isRunning = overallResult === RUNNING || typeof overallResult === 'object';
    if (!isRunning) {
      this.blueprint.end(blackboard);
    }
    if (introspector) {
      const debugResult = isRunning ? RUNNING : overallResult;
      introspector.wrapLast(1, this, debugResult, blackboard);
    }
    return overallResult;
  }
}
