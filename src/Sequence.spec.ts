/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from './constants';
import Sequence from './Sequence';
import Task from './Task';
import { Status } from './types';

describe('Sequence', () => {
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

  it('stops immediately at a failing node', () => {
    const selector = new Sequence({
      nodes: [failTask, successTask]
    });

    selector.run();

    expect(countSuccess).toEqual(0);
    expect(countFail).toEqual(1);
  });

  it('stops at a failing node', () => {
    const selector = new Sequence({
      nodes: [successTask, successTask, failTask, failTask, successTask]
    });

    selector.run();

    expect(countSuccess).toEqual(2);
    expect(countFail).toEqual(1);
  });

  it('calls all tasks if all are successful', () => {
    const selector = new Sequence({
      nodes: [successTask, successTask, successTask, successTask]
    });

    selector.run();

    expect(countSuccess).toEqual(4);
    expect(countFail).toEqual(0);
  });

  it('does not call tasks after running task', () => {
    const selector = new Sequence({
      nodes: [successTask, successTask, runningTask, successTask]
    });

    selector.run();
    expect(countSuccess).toEqual(2);
    expect(countRunning).toEqual(1);
  });

  describe('result values', () => {
    it('returns SUCCESS if all task succeeds', () => {
      const selector = new Sequence({
        nodes: [successTask, successTask, successTask]
      });

      expect(selector.run()).toEqual(SUCCESS);
    });

    it('returns FAILURE if one task fails', () => {
      const selector = new Sequence({
        nodes: [successTask, failTask, successTask, successTask]
      });

      expect(selector.run()).toEqual(FAILURE);
    });

    it('returns the index of still running task as array of running lastRun', () => {
      const selector = new Sequence({
        nodes: [successTask, successTask, runningTask, successTask]
      });

      expect(selector.run()).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, RUNNING] });
    });
  });

  describe('blackboard', () => {
    const aTask = new Task({
      run: function (blackboard) {
        ++blackboard.counter;
        return SUCCESS;
      }
    });
    const bTask = new Task({
      run: function (blackboard) {
        blackboard.counter += 10;
        return SUCCESS;
      }
    });

    it('can be passed to a task, and stores data between different tasks', () => {
      const selector = new Sequence({
        nodes: [aTask, bTask]
      });
      const blackboard = { counter: 0 };

      selector.run(blackboard);

      expect(blackboard.counter).toEqual(11);
    });
  });

  describe('nested selectors', () => {
    const aTask = new Task({
      run: function (blackboard) {
        ++blackboard.aCounter;
        return SUCCESS;
      }
    });
    const bTask = new Task({
      run: function (blackboard) {
        ++blackboard.bCounter;
        return SUCCESS;
      }
    });

    it('calls all nested tasks if all are succeeding', () => {
      const selector = new Sequence({
        nodes: [
          aTask,
          aTask,
          new Sequence({
            nodes: [bTask, bTask, bTask]
          })
        ]
      });
      const blackboard = { aCounter: 0, bCounter: 0 };

      selector.run(blackboard);

      expect(blackboard.aCounter).toEqual(2);
      expect(blackboard.bCounter).toEqual(3);
    });

    describe('running tasks', () => {
      const switchTask = new Task({
        run: function (blackboard) {
          ++blackboard.switchCounter;
          return blackboard.switchResult;
        }
      });

      const selector = new Sequence({
        nodes: [
          aTask,
          aTask,
          new Sequence({
            nodes: [bTask, switchTask, bTask]
          }),
          aTask
        ]
      });

      it('returns lastRun if tasks are running', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING };

        const result = selector.run(blackboard);

        expect(blackboard.aCounter).toEqual(2);
        expect(blackboard.bCounter).toEqual(1);
        expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, { total: RUNNING, state: [SUCCESS, RUNNING] }] });
      });

      it('resumes tasks where we left off', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING };

        let result = selector.run(blackboard);

        expect(blackboard.switchCounter).toEqual(1);
        expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, { total: RUNNING, state: [SUCCESS, RUNNING] }] });

        result = selector.run(blackboard, { lastRun: result });

        expect(blackboard.switchCounter).toEqual(2);
        expect(blackboard.aCounter).toEqual(2);
        expect(blackboard.bCounter).toEqual(1);
        expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, { total: RUNNING, state: [SUCCESS, RUNNING] }] });
      });

      it('after resuming in can progress, if tasks allow', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING as Status };

        let result = selector.run(blackboard);

        expect(blackboard.switchCounter).toEqual(1);
        expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, { total: RUNNING, state: [SUCCESS, RUNNING] }] });

        blackboard.switchResult = SUCCESS;

        result = selector.run(blackboard, { lastRun: result });

        expect(blackboard.switchCounter).toEqual(2);
        expect(blackboard.aCounter).toEqual(3);
        expect(blackboard.bCounter).toEqual(2);
        expect(result).toEqual(SUCCESS);
        // expect(result).toEqual({
        //   total: SUCCESS,
        //   state: [SUCCESS, SUCCESS, { total: SUCCESS, state: [SUCCESS, SUCCESS, SUCCESS] }, SUCCESS]
        // });
      });

      it('after resuming in can progress, if tasks allow it', () => {
        const blackboard = { aCounter: 0, bCounter: 0, switchCounter: 0, switchResult: RUNNING as Status };

        let result = selector.run(blackboard);

        expect(blackboard.switchCounter).toEqual(1);
        expect(result).toEqual({ total: RUNNING, state: [SUCCESS, SUCCESS, { total: RUNNING, state: [SUCCESS, RUNNING] }] });

        blackboard.switchResult = FAILURE;

        result = selector.run(blackboard, { lastRun: result });

        expect(blackboard.switchCounter).toEqual(2);
        // No count increments because of success
        expect(blackboard.aCounter).toEqual(2);
        expect(blackboard.bCounter).toEqual(1);
        expect(result).toEqual(FAILURE);
        // expect(result).toEqual({ total: FAILURE, state: [SUCCESS, SUCCESS, { total: FAILURE, state: [SUCCESS, FAILURE] }] });
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
        const selector = new Sequence({
          nodes: [aTask, aTask, switchTask, aTask]
        });
        const blackboard = {
          switchResult: RUNNING as Status,
          start: 0,
          run: 0,
          end: 0
        };

        const result = selector.run(blackboard);

        expect(blackboard.start).toEqual(1);
        expect(blackboard.run).toEqual(1);
        expect(blackboard.end).toEqual(0);

        const result2 = selector.run(blackboard, { lastRun: result, rerun: true });

        expect(blackboard.start).toEqual(1);
        expect(blackboard.run).toEqual(2);
        expect(blackboard.end).toEqual(0);

        blackboard.switchResult = SUCCESS;
        selector.run(blackboard, { lastRun: result2, rerun: true });

        expect(blackboard.start).toEqual(1);
        expect(blackboard.run).toEqual(3);
        expect(blackboard.end).toEqual(1);

        selector.run(blackboard);

        expect(blackboard.start).toEqual(2);
        expect(blackboard.run).toEqual(4);
        expect(blackboard.end).toEqual(2);
      });
    });
  });
});
