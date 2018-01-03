import { RUNNING } from './constants'
import BranchNode from './BranchNode'

export default class Random extends BranchNode {
  nodeType = 'Random'

  run (blackboard = null, { indexes = [], rerun, registryLookUp = x => x } = {}) {
    this.blueprint.start(blackboard)
    let currentIndex = indexes.shift() || 0
    if (!rerun) {
      currentIndex = Math.floor(Math.random() * this.numNodes)
    }
    const node = registryLookUp(this.blueprint.nodes[currentIndex])
    const result = node.run(blackboard, { indexes, rerun, registryLookUp })
    if (result === RUNNING) {
      return [ currentIndex, ...indexes ]
    } else if (typeof result === 'object') { // array
      return [ ...indexes, currentIndex, ...result ]
    }
    this.blueprint.end(blackboard)
    return result
  }
}
