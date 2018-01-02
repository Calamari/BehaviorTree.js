import { RUNNING } from './constants'
import Node from './Node'

export default class BranchNode extends Node {
  constructor (blueprint) {
    super(blueprint)

    this.numNodes = blueprint.nodes.length
  }

  run (blackboard = null, { indexes = [], rerun, registryLookUp = x => x } = {}) {
    this.blueprint.start(blackboard)
    let overallResult = this.START_CASE
    let currentIndex = indexes.shift() || 0
    while (currentIndex < this.numNodes) {
      let node = registryLookUp(this.blueprint.nodes[currentIndex])
      const result = node.run(blackboard, { indexes, rerun, registryLookUp })
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
