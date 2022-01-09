/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RUNNING, SUCCESS, FAILURE } from './constants';
import ParallelSelector from './ParallelSelector';
import Task from './Task';
import { Status } from './types';

describe('ParallelSelector', () => {
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

  it('runs all child nodes and returns running child index as long as one node is running and none failing', () => {
    const parallelSelector = new ParallelSelector({
      nodes: [successTask, successTask, runningTask]
    });

    const result = parallelSelector.run();

    expect(countRunning).toEqual(1);
    expect(countSuccess).toEqual(2);

    expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, RUNNING] });
  });

  it('directly sends back failure if one node is failing', () => {
    const parallelSelector = new ParallelSelector({
      nodes: [successTask, failTask, runningTask]
    });

    const result = parallelSelector.run();

    expect(countRunning).toEqual(1);
    expect(countSuccess).toEqual(1);
    expect(countFail).toEqual(1);

    expect(result).toEqual(FAILURE);
  });

  it('returns failure if one task is failing', () => {
    const parallelSelector = new ParallelSelector({
      nodes: [successTask, failTask]
    });

    const result = parallelSelector.run();

    expect(countSuccess).toEqual(1);
    expect(countFail).toEqual(1);

    expect(result).toEqual(FAILURE);
  });

  it('returns success if all tasks are success', () => {
    const parallelSelector = new ParallelSelector({
      nodes: [successTask, successTask]
    });

    const result = parallelSelector.run();

    expect(countSuccess).toEqual(2);

    expect(result).toEqual(SUCCESS);
  });

  describe('running tasks', () => {
    const switchTask = new Task({
      run: function (blackboard) {
        ++blackboard.switchCounter;
        return blackboard.switchResult;
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

    const parallelSelector = new ParallelSelector({
      nodes: [successTask, successTask, switchTask, switchTask2, switchTask3]
    });

    it('resumes tasks that where running and stops as soon as one task returns failure', () => {
      const blackboard = {
        switchCounter: 0,
        switchResult: RUNNING as any,
        switchCounter2: 0,
        switchResult2: RUNNING as any,
        switchCounter3: 0,
        switchResult3: RUNNING as any
      };

      let result = parallelSelector.run(blackboard);

      expect(countSuccess).toEqual(2);
      expect(blackboard.switchCounter).toEqual(1);
      expect(blackboard.switchCounter2).toEqual(1);
      expect(blackboard.switchCounter3).toEqual(1);
      expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, RUNNING, RUNNING, RUNNING] });

      blackboard.switchResult2 = SUCCESS;

      result = parallelSelector.run(blackboard, { lastRun: result });

      expect(countSuccess).toEqual(2);
      expect(blackboard.switchCounter).toEqual(2);
      expect(blackboard.switchCounter2).toEqual(2);
      expect(blackboard.switchCounter3).toEqual(2);
      expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, RUNNING, SUCCESS, RUNNING] });

      blackboard.switchResult = FAILURE;

      result = parallelSelector.run(blackboard, { lastRun: result });

      // counter 2 did not run anymore
      expect(blackboard.switchCounter).toEqual(3);
      expect(blackboard.switchCounter2).toEqual(2);
      expect(blackboard.switchCounter3).toEqual(3);
      expect(result).toEqual(FAILURE);
    });
  });

  describe('start and end callbacks', () => {
    const aTask = new Task({
      run: function () {
        return SUCCESS;
      }
    });
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

    it('start is not called again on further running node', () => {
      const parallelSelector = new ParallelSelector({
        nodes: [aTask, aTask, switchTask, aTask]
      });

      const blackboard = {
        switchResult: RUNNING as Status,
        start: 0,
        run: 0,
        end: 0
      };

      const result = parallelSelector.run(blackboard);

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(1);
      expect(blackboard.end).toEqual(0);

      const result2 = parallelSelector.run(blackboard, { lastRun: result, rerun: true });

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(2);
      expect(blackboard.end).toEqual(0);

      blackboard.switchResult = SUCCESS;
      parallelSelector.run(blackboard, { lastRun: result2, rerun: true });

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(3);
      expect(blackboard.end).toEqual(1);

      parallelSelector.run(blackboard);

      expect(blackboard.start).toEqual(2);
      expect(blackboard.run).toEqual(4);
      expect(blackboard.end).toEqual(2);
    });
  });
});
