/* eslint-env jest */
import { RUNNING, SUCCESS, FAILURE } from '../constants';
import AlwaysSucceedDecorator from './AlwaysSucceedDecorator';
import Task from '../Task';

describe('AlwaysSuccessDecorator', () => {
  const task = new Task({
    run(blackboard) {
      return blackboard.result;
    }
  });
  const decoratedTask = new AlwaysSucceedDecorator({ node: task });

  it('changes SUCCESS to FAILURE', () => {
    expect(decoratedTask.run({ result: SUCCESS })).toEqual(SUCCESS);
    expect(decoratedTask.run({ result: FAILURE })).toEqual(SUCCESS);
  });

  it('does not change RUNNING responses', () => {
    expect(decoratedTask.run({ result: RUNNING })).toEqual(RUNNING);
  });

  it('does not change RUNNING response on Branch nodes', () => {
    const result = { total: RUNNING, state: [FAILURE, RUNNING] };
    expect(decoratedTask.run({ result })).toEqual(result);
  });
});
