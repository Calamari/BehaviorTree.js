/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RUNNING, SUCCESS, FAILURE } from './constants';
import Parallel from './Parallel';
import Task from './Task';
import { Status } from './types';

describe('Parallel', () => {
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

  beforeEach(() => {
    countSuccess = 0;
    countFail = 0;
    countRunning = 0;
  });

  it('runs all child nodes and returns running child index as long as one node is running and none are failing', () => {
    const parallel = new Parallel({
      nodes: [successTask, runningTask, successTask]
    });

    const result = parallel.run();

    expect(countRunning).toEqual(1);
    expect(countSuccess).toEqual(2);

    expect(result).toEqual({ total: RUNNING, state: [SUCCESS, RUNNING, SUCCESS] });
  });

  it('returns failure if one task is failing', () => {
    const parallel = new Parallel({
      nodes: [successTask, runningTask, failTask]
    });

    const result = parallel.run();

    expect(countSuccess).toEqual(1);
    expect(countRunning).toEqual(1);
    expect(countFail).toEqual(1);

    expect(result).toEqual(FAILURE);
  });

  it('returns success if all tasks are success', () => {
    const parallel = new Parallel({
      nodes: [successTask, successTask]
    });

    const result = parallel.run();

    expect(countSuccess).toEqual(2);

    expect(result).toEqual(SUCCESS);
  });

  describe('running tasks', () => {
    const parallel = new Parallel({
      nodes: [switchTask, switchTask2, switchTask3]
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

      let result = parallel.run(blackboard);

      expect(blackboard.switchCounter).toEqual(1);
      expect(blackboard.switchCounter2).toEqual(1);
      expect(blackboard.switchCounter3).toEqual(1);
      expect(result).toEqual({ total: RUNNING, state: [RUNNING, RUNNING, RUNNING] });

      blackboard.switchResult2 = SUCCESS;

      result = parallel.run(blackboard, { lastRun: result });

      expect(blackboard.switchCounter).toEqual(2);
      expect(blackboard.switchCounter2).toEqual(2);
      expect(blackboard.switchCounter3).toEqual(2);
      expect(result).toEqual({ total: RUNNING, state: [RUNNING, SUCCESS, RUNNING] });

      blackboard.switchResult3 = FAILURE;

      result = parallel.run(blackboard, { lastRun: result });

      // counter 2 did not run anymore
      expect(blackboard.switchCounter).toEqual(3);
      expect(blackboard.switchCounter2).toEqual(2);
      expect(blackboard.switchCounter3).toEqual(3);
      expect(result).toEqual(FAILURE);
    });
  });

  describe('deeper nesting', () => {
    it('works as with shallow nodes', () => {
      const innerParallel = new Parallel({
        nodes: [switchTask, switchTask2]
      });
      const parallel = new Parallel({
        nodes: [innerParallel, switchTask3]
      });

      const blackboard = {
        switchCounter: 0,
        switchResult: RUNNING as any,
        switchCounter2: 0,
        switchResult2: RUNNING as any,
        switchCounter3: 0,
        switchResult3: RUNNING as any
      };

      let result = parallel.run(blackboard);

      expect(blackboard.switchCounter).toEqual(1);
      expect(blackboard.switchCounter2).toEqual(1);
      expect(blackboard.switchCounter3).toEqual(1);
      expect(result).toEqual({ total: RUNNING, state: [{ total: RUNNING, state: [RUNNING, RUNNING] }, RUNNING] });

      blackboard.switchResult2 = SUCCESS;

      result = parallel.run(blackboard, { lastRun: result });

      expect(blackboard.switchCounter).toEqual(2);
      expect(blackboard.switchCounter2).toEqual(2);
      expect(blackboard.switchCounter3).toEqual(2);
      expect(result).toEqual({ total: RUNNING, state: [{ total: RUNNING, state: [RUNNING, SUCCESS] }, RUNNING] });

      blackboard.switchResult = FAILURE;

      result = parallel.run(blackboard, { lastRun: result });

      expect(blackboard.switchCounter).toEqual(3);
      expect(blackboard.switchCounter2).toEqual(2);
      expect(blackboard.switchCounter3).toEqual(3);
      expect(result).toEqual(FAILURE);
    });

    it('works when only one node is running', () => {
      const innerParallel = new Parallel({
        nodes: [switchTask, switchTask2]
      });
      const parallel = new Parallel({
        nodes: [innerParallel, switchTask3]
      });

      const blackboard = {
        switchCounter: 0,
        switchResult: RUNNING as any,
        switchCounter2: 0,
        switchResult2: SUCCESS as any,
        switchCounter3: 0,
        switchResult3: SUCCESS as any
      };

      let result = parallel.run(blackboard);

      expect(blackboard.switchCounter).toEqual(1);
      expect(blackboard.switchCounter2).toEqual(1);
      expect(blackboard.switchCounter3).toEqual(1);
      expect(result).toEqual({ total: RUNNING, state: [{ total: RUNNING, state: [RUNNING, SUCCESS] }, SUCCESS] });

      blackboard.switchResult = SUCCESS;

      result = parallel.run(blackboard, { lastRun: result });

      expect(blackboard.switchCounter).toEqual(2);
      expect(blackboard.switchCounter2).toEqual(1);
      expect(blackboard.switchCounter3).toEqual(1);
      expect(result).toEqual(SUCCESS);
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
      const parallel = new Parallel({
        nodes: [aTask, aTask, switchTask, aTask]
      });

      const blackboard = {
        switchResult: RUNNING as Status,
        start: 0,
        run: 0,
        end: 0
      };

      const result = parallel.run(blackboard);

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(1);
      expect(blackboard.end).toEqual(0);

      const result2 = parallel.run(blackboard, { lastRun: result, rerun: true });

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(2);
      expect(blackboard.end).toEqual(0);

      blackboard.switchResult = SUCCESS;
      parallel.run(blackboard, { lastRun: result2, rerun: true });

      expect(blackboard.start).toEqual(1);
      expect(blackboard.run).toEqual(3);
      expect(blackboard.end).toEqual(1);

      parallel.run(blackboard);

      expect(blackboard.start).toEqual(2);
      expect(blackboard.run).toEqual(4);
      expect(blackboard.end).toEqual(2);
    });
  });
});
