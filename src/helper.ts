import { RunResult } from './types';
import { RUNNING } from './constants';

export function isRunning(result: RunResult | undefined): boolean {
  return result === RUNNING || (typeof result === 'object' && result.total === RUNNING);
}
