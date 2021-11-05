import { SUCCESS, FAILURE } from './constants'
import BranchNode from './BranchNode'

export default class Selector extends BranchNode {
  nodeType = 'Selector'
  START_CASE = FAILURE
  OPT_OUT_CASE = SUCCESS
}
