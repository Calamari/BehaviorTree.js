import BehaviorTree from './BehaviorTree';
import Node from './Node';
import { Blackboard, IntrospectionResult, RunResult } from './types';

export default class Introspector {
  currentResult: IntrospectionResult[];
  results: IntrospectionResult[];
  tree?: BehaviorTree;

  constructor() {
    this.currentResult = [];
    this.results = [];
  }

  start(tree: BehaviorTree) {
    this.tree = tree;
    this.currentResult = [];
  }

  end() {
    const result = this.currentResult.pop();
    if (result) {
      this.results.push(result);
    }
    delete this.tree;
    this.currentResult = [];
  }

  push(node: Node, result: RunResult, blackboard: Blackboard) {
    this.currentResult.push(this._toResult(node, result, blackboard));
  }

  wrapLast(numResults: number, node: Node, result: RunResult, blackboard: Blackboard) {
    const children = this.currentResult.splice(this.currentResult.length - numResults, numResults);
    this.currentResult.push({ ...this._toResult(node, result, blackboard), children });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _toResult(node: Node, result: RunResult, _blackboard: Blackboard): IntrospectionResult {
    return { ...(node.name ? { name: node.name } : {}), result };
  }

  reset() {
    this.results = [];
  }

  get lastResult(): IntrospectionResult | null {
    if (this.results.length === 0) {
      return null;
    }
    return this.results[this.results.length - 1];
  }
}
