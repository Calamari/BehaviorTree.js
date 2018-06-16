import { RUNNING } from './constants'

const NOOP = () => {}

export default class Node {
  nodeType = 'Node'

  constructor ({ run = NOOP, start = NOOP, end = NOOP, ...props }) {
    this.blueprint = { run, start, end, ...props }
  }

  run (blackboard, { rerun = false, runData, registryLookUp = x => x, ...config } = {}) {
    if (!rerun) this.blueprint.start(blackboard)
    const result = this.blueprint.run(blackboard, { ...config, rerun, runData, registryLookUp })
    if (result !== RUNNING) {
      this.blueprint.end(blackboard)
    }
    if (runData) {
      runData.push({
        name: this.name,
        type: this.nodeType,
        result
      })
    }
    return result
  }

  collectData () {
    return {
      name: this.name,
      type: this.nodeType
    }
  }

  get name () {
    return this._name || this.blueprint.name
  }

  set name (name) {
    this._name = name
  }
}
