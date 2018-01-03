import Node from './Node'

export default class Decorator extends Node {
  nodeType = 'Decorator'

  constructor ({ config = {}, ...props } = {}) {
    super(props)
    this.setConfig(config)
  }

  decorate (run) {
    // This method should be overridden to make it useful
    return run()
  }

  run (blackboard, { registryLookUp = x => x, ...config } = {}) {
    const result = this.decorate(() => (
      registryLookUp(this.blueprint.node).run(blackboard, { ...config, registryLookUp })
    ), blackboard, this.config)

    return result
  }

  setConfig (config) {
    this.config = config
  }
}
