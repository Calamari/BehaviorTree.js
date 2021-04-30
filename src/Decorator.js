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

  run(blackboard, { introspector, registryLookUp = (x) => x, ...config } = {}) {
    let runCount = 0
    const result = this.decorate(
      () => {
        ++runCount
        return registryLookUp(this.blueprint.node).run(blackboard, {
          ...config,
          introspector,
          registryLookUp
        })
      },
      blackboard,
      this.config
    )

    if (introspector) {
      introspector.wrapLast(runCount, this, result, blackboard)
    }
    return result
  }

  setConfig(config) {
    this.config = config
  }
}
