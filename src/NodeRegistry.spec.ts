/* eslint-env jest */
import { SUCCESS } from './constants';
import { NodeRegistry } from './NodeRegistry';
import Task from './Task';

describe('NodeRegistry', () => {
  let registry: NodeRegistry;

  beforeEach(() => {
    registry = new NodeRegistry();
  });

  describe('register', () => {
    it('registers a Node instance by name', () => {
      const task = new Task({
        run: () => SUCCESS
      });
      registry.register('myTask', task);

      expect(registry.lookUp('myTask')).toBe(task);
    });

    it('wraps a plain function in a Task node', () => {
      const run = () => SUCCESS;
      registry.register('myFunc', run);

      const node = registry.lookUp('myFunc');
      expect(node).toBeInstanceOf(Task);
      expect(node.run({})).toEqual(SUCCESS);
    });

    it('overwrites a previously registered node with the same name', () => {
      const task1 = new Task({ run: () => SUCCESS });
      const task2 = new Task({ run: () => SUCCESS });

      registry.register('task', task1);
      registry.register('task', task2);

      expect(registry.lookUp('task')).toBe(task2);
    });
  });

  describe('lookUp', () => {
    it('returns the registered node when given a string', () => {
      const task = new Task({ run: () => SUCCESS });
      registry.register('someTask', task);

      expect(registry.lookUp('someTask')).toBe(task);
    });

    it('returns the node itself when given a Node instance', () => {
      const task = new Task({ run: () => SUCCESS });

      expect(registry.lookUp(task)).toBe(task);
    });

    it('throws when looking up an unregistered name', () => {
      expect(() => registry.lookUp('unknown')).toThrowError(
        'No node with name unknown registered.'
      );
    });
  });

  describe('clean', () => {
    it('removes all registered nodes', () => {
      registry.register('a', new Task({ run: () => SUCCESS }));
      registry.register('b', new Task({ run: () => SUCCESS }));

      registry.clean();

      expect(() => registry.lookUp('a')).toThrowError(
        'No node with name a registered.'
      );
      expect(() => registry.lookUp('b')).toThrowError(
        'No node with name b registered.'
      );
    });

    it('allows re-registering after clean', () => {
      const task = new Task({ run: () => SUCCESS });
      registry.register('task', task);
      registry.clean();
      registry.register('task', task);

      expect(registry.lookUp('task')).toBe(task);
    });
  });
});
