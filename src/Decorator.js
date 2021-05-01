import { RUNNING } from './constants'
import Node from './Node'

export default class Decorator extends Node {
  nodeType = 'Decorator'

  constructor({ config = {}, ...props } = {}) {
    super(props)
    this.setConfig(config)
  }

  decorate(run) {
    // This method should be overridden to make it useful
    return run()
  }

  run(blackboard, { introspector, rerun, registryLookUp = (x) => x, ...config } = {}) {
    if (!rerun) this.blueprint.start(blackboard)
    let runCount = 0
    const result = this.decorate(
      () => {
        ++runCount
        return registryLookUp(this.blueprint.node).run(blackboard, {
          ...config,
          rerun,
          introspector,
          registryLookUp
        })
      },
      blackboard,
      this.config
    )

    if (result !== RUNNING) {
      this.blueprint.end(blackboard)
    }
    if (introspector) {
      introspector.wrapLast(runCount, this, result, blackboard)
    }
    return result
  }

  setConfig(config) {
    this.config = config
  }
}
