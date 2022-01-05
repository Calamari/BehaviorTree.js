import { StatusWithState, Status } from './types';
import { RUNNING } from './constants';

export function isRunning(result: Status | StatusWithState | undefined): boolean {
  return result === RUNNING || (typeof result === 'object' && result.total === RUNNING);
}
