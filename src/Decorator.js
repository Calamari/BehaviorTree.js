import Task from './Task'

// export default function decorator (config) {
//   return node => {
//     return new Task({
//       run (blackboard, runConfig) {
//         return node.run(blackboard, runConfig)
//       }
//     })
//   }
// }

export function createDecorator (decorator) {
  return (config) => {
    return node => {
      return new Task({
        run (blackboard, runConfig) {
          return decorator(() => node.run(blackboard, runConfig), blackboard)
        }
      })
    }
  }
}

/**
 * This decorator does nothing really, but demonstrates how a decorator works
 */
export default createDecorator(run => run())

//
//
// class Decorator {
//   constructor (config) {
//     this.config = config
//   }
//
//   apply (node) {
//     return {
//       run: (blackboard, runConfig) => {
//         return node.run(blackboard, runConfig)
//       }
//     }
//   }
// }
//
// const InvertDecorator = createDecorator((run) => {
//   const result = run()
// })
