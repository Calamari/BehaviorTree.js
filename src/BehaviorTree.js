import { RUNNING } from './constants'

export default class BehaviorTree {
  constructor ({ tree, blackboard }) {
    this.tree = tree
    this.blackboard = blackboard
    this.lastResult = null
  }

  step () {
    const indexes = this.lastResult && typeof this.lastResult === 'object' ? this.lastResult : []
    const rerun = this.lastResult === RUNNING || indexes.length > 0
    this.lastResult = this.tree.run(this.blackboard, { indexes, rerun })
  }
}
