/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RUNNING, SUCCESS, FAILURE } from './constants';
import ParallelComplete from './ParallelComplete';
import Task from './Task';
import { Status } from './types';

describe('ParallelComplete', () => {
  let countSuccess = 0;
  const successTask = new Task({
    run: function () {
      ++countSuccess;
      return SUCCESS;
    }
  });

  let countFail = 0;
  const failTask = new Task({
    run: function () {
      ++countFail;
      return FAILURE;
    }
  });

  let countRunning = 0;
  const runningTask = new Task({
    run: function () {
      ++countRunning;
      return RUNNING;
    }
  });

  beforeEach(() => {
    countSuccess = 0;
    countFail = 0;
    countRunning = 0;
  });

  it('runs all child nodes and returns running as long as all nodes are running', () => {
    const parallelComplete = new ParallelComplete({
      nodes: [runningTask, runningTask, runningTask]
    });

    const result = parallelComplete.run();

    expect(countRunning).toEqual(3);

    expect(result).toEqual({ total: RUNNING, state: [RUNNING, RUNNING, RUNNING] });
  });

  it('runs success if one node is success, and not one failing', () => {
    const parallelComplete = new ParallelComplete({
      nodes: [runningTask, successTask, runningTask]
    });

    const result = parallelComplete.run();

    expect(countSuccess).toEqual(1);
    expect(countRunning).toEqual(2);

    expect(result).toEqual(SUCCESS);
  });

  it('runs failure if one node is failure', () => {
    const parallelComplete = new ParallelComplete({
      nodes: [runningTask, successTask, failTask]
    });

    const result = parallelComplete.run();

    expect(countSuccess).toEqual(1);
    expect(countFail).toEqual(1);
    expect(countRunning).toEqual(1);

    expect(result).toEqual(FAILURE);
  });

  describe('running tasks', () => {
    const switchTask = new Task({
      run: function (blackboard) {
        ++blackboard.switchCounter1;
        return blackboard.switchResult1;
      }
    });
    const switchTask2 = new Task({
      run: function (blackboard) {
        ++blackboard.switchCounter2;
        return blackboard.switchResult2;
      }
    });
    const switchTask3 = new Task({
      run: function (blackboard) {
        ++blackboard.switchCounter3;
        return blackboard.switchResult3;
      }
    });

    const parallelComplete = new ParallelComplete({
      nodes: [switchTask, switchTask2, switchTask3]
    });

    it('returns running as long as one task is running and stops if at least one task is returning a result', () => {
      const blackboard = {
        switchCounter1: 0,
        switchResult1: RUNNING as any,
        switchCounter2: 0,
        switchResult2: RUNNING as any,
        switchCounter3: 0,
        switchResult3: RUNNING as any
      };

      let result = parallelComplete.run(blackboard);

      expect(blackboard.switchCounter1).toEqual(1);
      expect(blackboard.switchCounter2).toEqual(1);
      expect(blackboard.switchCounter3).toEqual(1);
      expect(result).toEqual({ total: RUNNING, state: [RUNNING, RUNNING, RUNNING] });

      blackboard.switchResult2 = SUCCESS;

      result = parallelComplete.run(blackboard, { lastRun: result });

      expect(blackboard.switchCounter1).toEqual(2);
      expect(blackboard.switchCounter2).toEqual(2);
      expect(blackboard.switchCounter3).toEqual(2);
      expect(result).toEqual(SUCCESS);
    });
  });

  describe('start and end callbacks', () => {
    const switchTask = new Task({
      start: function (blackboard) {
        ++blackboard.start;
      },
      run: function (blackboard) {
        ++blackboard.run;
        return blackboard.switchResult;
      },
      end: function (blackboard) {
        ++blackboard.end;
      }
    });
    const runningTask = new Task({
      run: function () {
        return RUNNING;
      }
    });

    it('start is not called again on further running node', () => {
      const parallelComplete = new ParallelComplete({
        nodes: [runningTask, switchTask, runningTask]
      });

      const blackboard = {
        switchResult: RUNNING as Status,
        start: 0,
        run: 0,
        end: 0
      };

      const result = parallelComplete.run(blackboard);

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(1);
      expect(blackboard.end).toEqual(0);

      const result2 = parallelComplete.run(blackboard, { lastRun: result, rerun: true });

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(2);
      expect(blackboard.end).toEqual(0);

      blackboard.switchResult = SUCCESS;
      parallelComplete.run(blackboard, { lastRun: result2, rerun: true });

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(3);
      expect(blackboard.end).toEqual(1);
    });
  });
});
