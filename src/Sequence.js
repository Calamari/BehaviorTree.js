import { SUCCESS, FAILURE } from './constants'
import BranchNode from './BranchNode'

export default class Selector extends BranchNode {
  constructor (blueprint) {
    super(blueprint)

    this.START_CASE = SUCCESS
    this.OPT_OUT_CASE = FAILURE
  }
}
