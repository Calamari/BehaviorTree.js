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

  run (blackboard, { runData, registryLookUp = x => x, ...config } = {}) {
    const subRunData = runData ? [] : null
    const result = this.decorate(() => (
      registryLookUp(this.blueprint.node).run(blackboard, { ...config, registryLookUp, runData: subRunData })
    ), blackboard, this.config)

    if (runData) {
      runData.push({
        config: this.config,
        name: this.name,
        type: this.nodeType,
        nodes: subRunData,
        result
      })
    }
    return result
  }

  setConfig (config) {
    this.config = config
  }
}
