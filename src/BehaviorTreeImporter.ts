import Decorator from './Decorator';
import Node from './Node';
import Random from './Random';
import Selector from './Selector';
import Sequence from './Sequence';
import Task from './Task';
import AlwaysFailDecorator from './decorators/AlwaysFailDecorator';
import AlwaysSucceedDecorator from './decorators/AlwaysSucceedDecorator';
import CooldownDecorator from './decorators/CooldownDecorator';
import InvertDecorator from './decorators/InvertDecorator';
import LoopDecorator from './decorators/LoopDecorator';
import { registryLookUp } from './BehaviorTree';

export interface ImportableJson {
  type: string;
  name?: string;
  node?: ImportableJson;
  nodes?: ImportableJson[];
}

export default class BehaviorTreeImporter {
  types: Record<string, any> = {
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
  };

  defineType(type: string, Klass: any) {
    this.types[type] = Klass;
  }

  parse(json: ImportableJson): Node {
    const { type, name, ...config } = json;
    const Klass = this.types[type];
    if (!Klass) {
      const registeredNode = registryLookUp(type);
      if (registeredNode) {
        registeredNode.name = name;
        return registeredNode;
      }
      throw new Error(`Don't know how to handle type ${type}. Please register this first.`);
    }

    return new Klass({
      name: name,
      node: json.node ? this.parse(json.node) : null,
      nodes: json.nodes ? json.nodes.map((subJson: ImportableJson) => this.parse(subJson)) : null,
      config
    });
  }
}
