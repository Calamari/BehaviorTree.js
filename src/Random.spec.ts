/* eslint-env jest */
import { StatusWithState } from '.';
import { RUNNING, SUCCESS, FAILURE } from './constants';
import Random from './Random';
import Task from './Task';
import { Blackboard } from './types';

describe('Random', () => {
  const task1 = new Task({
    run: function (blackboard) {
      blackboard.callStack.push('task1');
      ++blackboard.count;
      return blackboard.result;
    }
  });
  const task2 = new Task({
    run: function (blackboard) {
      blackboard.callStack.push('task2');
      ++blackboard.count;
      return blackboard.result;
    }
  });
  const task3 = new Task({
    run: function (blackboard) {
      blackboard.callStack.push('task3');
      ++blackboard.count;
      return blackboard.result;
    }
  });
  let blackboard: Blackboard;

  beforeEach(() => {
    blackboard = {
      callStack: [],
      count: 0,
      result: SUCCESS
    };
  });

  it('chooses one node per random and runs that', () => {
    const random = new Random({
      nodes: [task1, task2, task3]
    });

    random.run(blackboard);

    expect(blackboard.count).toEqual(1);
  });

  it('returns the value of the called task', () => {
    const random = new Random({
      nodes: [task1, task2, task3]
    });

    blackboard.result = SUCCESS;
    expect(random.run(blackboard)).toEqual(SUCCESS);

    blackboard.result = FAILURE;
    expect(random.run(blackboard)).toEqual(FAILURE);

    blackboard.result = RUNNING;
    const result = random.run(blackboard) as StatusWithState;
    expect(result.total).toEqual(RUNNING);
    expect(result.state.reduce((acc, state) => (state === RUNNING ? acc + 1 : acc), 0)).toEqual(1);
    expect(result.state.reduce((acc, state) => (state === undefined ? acc + 1 : acc), 0)).toEqual(2);
  });

  it('calls the the same task all over again when it is running', () => {
    const random = new Random({
      nodes: [task1, task2, task3]
    });

    blackboard.result = RUNNING;

    const lastRun = { total: RUNNING, state: [undefined, undefined, RUNNING] };

    random.run(blackboard, { lastRun, rerun: true });
    random.run(blackboard, { lastRun, rerun: true });
    random.run(blackboard, { lastRun, rerun: true });
    expect(blackboard.callStack[0]).toEqual('task3');
    expect(blackboard.callStack[1]).toEqual('task3');
    expect(blackboard.callStack[2]).toEqual('task3');
  });

  it('does not call start on rerunning running task', () => {
    blackboard.start = 0;
    blackboard.end = 0;

    const random = new Random({
      start: function (blackboard) {
        ++blackboard.start;
      },
      end: function (blackboard) {
        ++blackboard.end;
      },
      nodes: [task1, task2, task3]
    });

    blackboard.result = RUNNING;
    random.run(blackboard);

    expect(blackboard.start).toEqual(1);
    expect(blackboard.end).toEqual(0);

    random.run(blackboard, { lastRun: { total: RUNNING, state: [undefined, undefined, RUNNING] }, rerun: true });

    expect(blackboard.start).toEqual(1);
    expect(blackboard.end).toEqual(0);

    blackboard.result = FAILURE;
    random.run(blackboard, { lastRun: { total: RUNNING, state: [undefined, undefined, RUNNING] }, rerun: true });

    expect(blackboard.start).toEqual(1);
    expect(blackboard.end).toEqual(1);
  });
});
