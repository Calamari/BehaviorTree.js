import { RUNNING } from './constants';
import BranchNode from './BranchNode';
import Node from './Node';
import { Blackboard, RunConfig, StatusWithState } from './types';
import { isRunning } from './helper';

export default class Random extends BranchNode {
  nodeType = 'Random';

  run(blackboard: Blackboard = {}, { lastRun, introspector, rerun, registryLookUp = (x) => x as Node }: RunConfig = {}) {
    let currentIndex = 0;
    if (rerun) {
      currentIndex = (lastRun as StatusWithState).state.findIndex((x) => isRunning(x));
    } else {
      this.blueprint.start(blackboard);
      currentIndex = Math.floor(Math.random() * this.numNodes);
    }
    const node = registryLookUp(this.nodes[currentIndex]);
    const result = node.run(blackboard, { lastRun, introspector, rerun, registryLookUp });
    const running = isRunning(result);
    if (!running) {
      this.blueprint.end(blackboard);
    }
    if (introspector) {
      const debugResult = running ? RUNNING : result;
      introspector.wrapLast(1, this, debugResult, blackboard);
    }
    if (running) {
      const returningResult = { total: RUNNING, state: new Array(this.numNodes).fill(undefined) };
      returningResult.state[currentIndex] = result;
      return returningResult;
    }
    return result;
  }
}
