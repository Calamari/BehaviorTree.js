import { FAILURE, SUCCESS, RUNNING } from './constants';
import Parallel from './Parallel';
import { RunResult } from './types';

/**
 * The Parallel node runs all of its children in parallel and is running until the first children is
 * returning a result and that result will be retuend. In a tie a FAILURE would win over a SUCCESS.
 */
export default class ParallelComplete extends Parallel {
  nodeType = 'ParallelComplete';

  protected calcResult(results: Array<RunResult>): RunResult {
    if (results.includes(FAILURE)) {
      return FAILURE;
    }
    if (results.includes(SUCCESS)) {
      return SUCCESS;
    }
    return { total: RUNNING, state: results };
  }
}
