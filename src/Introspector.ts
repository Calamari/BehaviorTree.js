import BehaviorTree from '.';
import Node from './Node';
import { Blackboard, Status } from './types';

export interface IntrospectionResult {}

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

  push(node: Node, result: IntrospectionResult, blackboard: Blackboard) {
    this.currentResult.push(this._toResult(node, result, blackboard));
  }

  wrapLast(numResults: number, node: Node, result: Status, blackboard: Blackboard) {
    const children = this.currentResult.splice(this.currentResult.length - numResults, numResults);
    this.currentResult.push({ ...this._toResult(node, result, blackboard), children });
  }

  _toResult(node: Node, result: IntrospectionResult, _blackboard: Blackboard) {
    return { ...(node.name ? { name: node.name } : {}), result };
  }

  reset() {
    this.results = [];
  }

  get lastResult() {
    if (this.results.length === 0) {
      return null;
    }
    return this.results[this.results.length - 1];
  }
}
