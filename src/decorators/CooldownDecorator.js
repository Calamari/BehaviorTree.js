import { FAILURE } from '../constants'
import Task from '../Task'

export default function CooldownDecorator ({ cooldown = 5 } = {}) {
  return node => {
    return new Task({
      run (blackboard, runConfig) {
        if (this.lock) {
          return FAILURE
        }
        this.lock = true
        setTimeout(() => {
          this.lock = false
        }, cooldown * 1000)
        return node.run(blackboard, runConfig)
      }
    })
  }
}
