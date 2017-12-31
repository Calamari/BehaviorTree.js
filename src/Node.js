import { RUNNING } from './constants'

const NOOP = () => {}

export default class Node {
  constructor ({ run = NOOP, start = NOOP, end = NOOP, ...props }) {
    this.blueprint = { run, start, end, ...props }
  }

  run (blackboard, { rerun = false }) {
    if (!rerun) this.blueprint.start(blackboard)
    const result = this.blueprint.run(blackboard)
    if (result !== RUNNING) {
      this.blueprint.end(blackboard)
    }
    return result
  }
}
