import { RUNNING } from './constants'

const NOOP = () => {}

export default class Node {
  nodeType = 'Node'

  constructor({ run = NOOP, start = NOOP, end = NOOP, ...props }) {
    this.blueprint = { run, start, end, ...props }
  }

  run(blackboard, { introspector, rerun = false, registryLookUp = (x) => x, ...config } = {}) {
    if (!rerun) this.blueprint.start(blackboard)
    const result = this.blueprint.run(blackboard, { ...config, rerun, registryLookUp })
    if (result !== RUNNING) {
      this.blueprint.end(blackboard)
    }
    if (introspector) {
      introspector.push(this, result, blackboard)
    }
    return result
  }

  get name() {
    return this._name || this.blueprint.name
  }

  set name(name) {
    this._name = name
  }
}
