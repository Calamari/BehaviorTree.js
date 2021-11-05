import { SUCCESS, FAILURE } from './constants'
import BranchNode from './BranchNode'

export default class Sequence extends BranchNode {
  nodeType = 'Sequence'
  START_CASE = SUCCESS
  OPT_OUT_CASE = FAILURE
}
