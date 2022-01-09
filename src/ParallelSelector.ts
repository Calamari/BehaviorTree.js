import { FAILURE, SUCCESS, RUNNING } from './constants';
import Parallel from './Parallel';
import { isRunning } from './helper';
import { RunResult } from './types';

/**
 * The Parallel node runs all of its children in parallel and is running as long as one of the children is
 * still running.
 */
export default class ParallelSelector extends Parallel {
  nodeType = 'ParallelSelector';

  protected calcResult(results: Array<RunResult>): RunResult {
    if (results.includes(FAILURE)) {
      return FAILURE;
    }
    const running = !!results.find((x) => isRunning(x));
    return running ? { total: RUNNING, state: results } : SUCCESS;
  }
}
