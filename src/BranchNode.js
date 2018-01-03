import { RUNNING } from './constants'
import Node from './Node'

export default class BranchNode extends Node {
  nodeType = 'BranchNode'

  constructor (blueprint) {
    super(blueprint)

    this.numNodes = blueprint.nodes.length
  }

  run (blackboard = null, { indexes = [], rerun, runData, registryLookUp = x => x } = {}) {
    const subRunData = runData ? [] : null
    this.blueprint.start(blackboard)
    let overallResult = this.START_CASE
    let currentIndex = indexes.shift() || 0
    while (currentIndex < this.numNodes) {
      let node = registryLookUp(this.blueprint.nodes[currentIndex])
      const result = node.run(blackboard, { indexes, rerun, runData: subRunData, registryLookUp })
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
    if (runData) {
      ++currentIndex
      // collect data of unfinished nodes
      while (currentIndex < this.numNodes) {
        subRunData.push(registryLookUp(this.blueprint.nodes[currentIndex]).collectData())
        ++currentIndex
      }
      runData.push({
        name: this.name,
        type: this.nodeType,
        nodes: subRunData,
        result: overallResult
      })
    }
    return overallResult
  }

  get collectData () {
    return {
      name: this.name,
      type: this.nodeType,
      nodes: this.nodes.map(node => node.collectData())
    }
  }
}
