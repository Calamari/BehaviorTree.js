# Upgrade Guide to v2.0 from v1.0

The most notable change is, the way how to import the behavior tree components. The components are not static parts of the BehaviorTree class anymore. And since we are using proper ES5 notation, the BehaviorTree is now the `default` export of the component. This should look like this now:

```js
import BehaviorTree, { Selector, Task, SUCCESS } from 'behaviortree'
```

Additionally, to avoid the awkwardness of previous internal code, Tasks will now need to return a single value at the end, instead of calling one of the `this.running`, `this.success` or `this.fail` methods. Those methods do not exist anymore. Please return the provided constants to notify if the task was a success or failure or if it is still running and need to be called again.

```js
import { Task, SUCCESS } from 'behaviortree'
const task = new Task({
  run () {
    return SUCCESS
  }
})
```

The Priority Selector is now called simply `Selector` according to more common terminology.
