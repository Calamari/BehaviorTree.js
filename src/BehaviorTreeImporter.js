import Decorator from './Decorator'
import Random from './Random'
import Selector from './Selector'
import Sequence from './Sequence'
import Task from './Task'
import AlwaysFailDecorator from './decorators/AlwaysFailDecorator'
import AlwaysSucceedDecorator from './decorators/AlwaysSucceedDecorator'
import CooldownDecorator from './decorators/CooldownDecorator'
import InvertDecorator from './decorators/InvertDecorator'
import LoopDecorator from './decorators/LoopDecorator'
import { registryLookUp } from './BehaviorTree'

export default class BehaviorTreeImporter {
  types = {
    task: Task,
    decorator: Decorator,
    selector: Selector,
    sequence: Sequence,
    random: Random,
    invert: InvertDecorator,
    fail: AlwaysFailDecorator,
    succeed: AlwaysSucceedDecorator,
    cooldown: CooldownDecorator,
    loop: LoopDecorator
  }

  defineType (type, Klass) {
    this.types[type] = Klass
  }

  parse (json) {
    const { type, name, node, nodes, ...config } = json
    const Klass = this.types[type]
    if (!Klass) {
      const registeredNode = registryLookUp(type)
      if (registeredNode) {
        registeredNode.name = name
        return registeredNode
      }
      throw new Error(`Don't know how to handle type ${type}. Please register this first.`)
    }

    return new Klass({
      name: name,
      node: node ? this.parse(node) : null,
      nodes: nodes ? nodes.map(subJson => this.parse(subJson)) : null,
      config
    })
  }
}
