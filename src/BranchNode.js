import { RUNNING } from './constants'
import Node from './Node'

export default class BranchNode extends Node {
  constructor (blueprint) {
    super(blueprint)

    this.numNodes = blueprint.nodes.length
  }

  run (blackboard = null, { indexes = [], rerun } = {}) {
    this.blueprint.start(blackboard)
    let overallResult = this.START_CASE
    let currentIndex = indexes.shift() || 0
    while (currentIndex < this.numNodes) {
      // @TODO: Add lookup
      const result = this.blueprint.nodes[currentIndex].run(blackboard, { indexes, rerun })
      if (result === RUNNING) {
        return [ currentIndex, ...indexes ]
      } else if (typeof result === 'object') { // array
        return [ ...indexes, currentIndex, ...result ]
      } else if (result === this.OPT_OUT_CASE) {
        overallResult = result
        break
      } else {
        ++currentIndex
      }
    }
    this.blueprint.end(blackboard)
    return overallResult
  }
}
