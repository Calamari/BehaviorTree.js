

describe('BehaviorTree', function() {
  describe('can be constructed with', function() {
    it("an object containing the tree key", function() {
      var btree = new BehaviorTree({
        tree: {}
      });
      expect(btree instanceof BehaviorTree).toBeTruthy();
    });
  });

  it('has a register method', function() {
    expect(BehaviorTree.register).toBeFunction();
  });

  it('has a getNode', function() {
    expect(BehaviorTree.register).toBeFunction();
  });

  describe('can save an object with register method', function() {
    var node = new BehaviorTree.Node({});
    beforeEach(function() {
      BehaviorTree.register('myNode', node);
    });
    it("and getNode returns it", function() {
      expect(BehaviorTree.getNode('myNode')).toBe(node);
    });
  });

  describe('an instance', function() {
    var btree;
    beforeEach(function() {
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({})
      });
    });

    it('has a step method', function() {
      expect(btree.step).toBeFunction();
    });

    it('has a setObject method', function() {
      expect(btree.setObject).toBeFunction();
    });
  });

  describe('setup with a minimal tree', function() {
    var btree, runCount, startCalled, endCalled, msg;
    beforeEach(function() {
      runCount = 0;
      beSuccess = startCalled = endCalled = false;
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({
          start: function() { startCalled = true; },
          end: function() { endCalled = true; },
          run: function() {
            runCount++;
            this.success();
          }
        })
      });
      realLog = console.log;
      console.log = function(m) { msg = m; };
    });

    afterEach(function() {
      console.log = realLog;
    });

    it('the step method calls start of root node', function() {
      btree.step();
      expect(startCalled).toBeTruthy();
    });

    it('the step method calls run of root node', function() {
      btree.step();
      expect(runCount).toBe(1);
    });

    it('the step method calls end of root node on success', function() {
      beSuccess = true;
      btree.step();
      expect(endCalled).toBeTruthy();
    });

    it('the step method calls end of root node on fail', function() {
      btree.step();
      expect(endCalled).toBeTruthy();
    });

    it('logs no message into the console if step is called again', function() {
      btree.step();
      btree.step();
      expect(msg).toBeUndefined();
    });
  });

  describe('a minimal tree where the root node canRun is false', function() {
    var hasRun;
    beforeEach(function() {
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({
          canRun: function() { return false; },
          run: function() {
            hasRun = true;
          }
        })
      });
      realLog = console.log;
      console.log = function(m) { msg = m; };
    });

    afterEach(function() {
      console.log = realLog;
    });

    it('does nothing', function() {
      btree.step();
      expect(hasRun).toBeFalsy();
    });

    it('does nothing also called multiple times', function() {
      btree.step();
      btree.step();
      btree.step();
      expect(hasRun).toBeFalsy();
    });
  });

  describe('a tree where the root node does not call neither success, fail, nor running', function() {
    var hasRun, msg;
    beforeEach(function() {
      btree = new BehaviorTree({
        title: 'the TREE',
        tree: new BehaviorTree.Task({
          run: function() {}
        })
      });
      realLog = console.log;
      console.log = function(m) { msg = m; };
    });

    afterEach(function() {
      console.log = realLog;
    });

    it('logs message into the console', function() {
      btree.step();
      btree.step();
      expect(msg).toBe('the BehaviorTree "the TREE" did call step but one Task did not finish on last call of step.');
    });
  });

  describe('when having a more complex tree', function() {
    var runCount1, runCount2, beSuccess1, beSuccess2, stillRunning2;
    beforeEach(function() {
      runCount1 = runCount2 = 0;
      beSuccess1 = beSuccess2 = stillRunning2 = false;
      btree = new BehaviorTree({
        title: 'tree',
        tree: new BehaviorTree.Sequence({
          title: 'my sequence',
          nodes: [
            new BehaviorTree.Task({
              title: 'node1',
              run: function() {
                ++runCount1;
                if (beSuccess1) { this.success(); }
                else { this.fail(); }
              }
            }),
            new BehaviorTree.Task({
              title: 'node2',
              run: function() {
                ++runCount2;
                if (stillRunning2) { this.running(); }
                else if (beSuccess2) { this.success(); }
                else { this.fail(); }
              }
            })
          ]
        })
      });
    });

    describe('if first task runs through immediately and the second says running', function() {
      beforeEach(function() {
        beSuccess1 = true;
        stillRunning2 = true;
      });

      describe('and we call step once', function() {
        beforeEach(function() {
          btree.step();
        });

        it('both run methods are called', function() {
          expect(runCount1).toBe(1);
          expect(runCount2).toBe(1);
        });

        it('the first node will not be called again on second step', function() {
          btree.step();
          expect(runCount1).toBe(1);
        });

        it('the second node will be called on second step', function() {
          btree.step();
          expect(runCount2).toBe(2);
        });

      });
    });
  });

  describe('when setting setObject to the tree', function() {
    var obj, runCount;
    beforeEach(function() {
      runCount = 0;
      obj = { foo: 'bar' };
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({
          canRun: function(object) {
            expect(object).toBe(obj);
            ++runCount;
            return true;
          },
          run: function(object) {
            expect(object).toBe(obj);
            ++runCount;
          }
        })
      });
      btree.setObject(obj);
    });

    it('both canRun and run have object as argument', function() {
      btree.step();
      expect(runCount).toBe(2);
    });
  });

  describe('when setting object as config and having more then one node', function() {
    var obj, runCount;
    beforeEach(function() {
      runCount = 0;
      obj = { word: 'bird' };
      btree = new BehaviorTree({
        object: obj,
        tree: new BehaviorTree.Sequence({
          title: 'my sequence',
          nodes: [
            new BehaviorTree.Task({
              canRun: function(object) {
                expect(object).toBe(obj);
                ++runCount;
                return true;
              },
              run: function(object) {
                expect(object).toBe(obj);
                ++runCount;
              }
            })
          ]
        })
      });
    });

    it('both canRun and run have object as argument', function() {
      btree.step();
      expect(runCount).toBe(2);
    });
  });

  describe('a minimal tree with a lookup task as root note', function() {
    var hasRunObj, testObj1, msg, callSuccess;
    beforeEach(function() {
      hasRunObj = [];
      testObj1 = { sim: 'ba' };
      BehaviorTree.register('testtask', new BehaviorTree.Task({
        run: function(obj) {
          hasRunObj.push(obj);
          if (callSuccess) {
            this.success();
          }
        }
      }));
      btree = new BehaviorTree({
        title: 'tree1',
        tree: 'testtask'
      });
      realLog = console.log;
      console.log = function(m) { msg = m; };
    });

    afterEach(function() {
      console.log = realLog;
    });

    it('runs the registered task with right test obj', function() {
      btree.setObject(testObj1);
      btree.step();
      expect(hasRunObj[0]).toBe(testObj1);
    });

    describe('and looking up the same task in another tree', function() {
      var btree2, testObj2;
      beforeEach(function() {
        testObj2 = { sim: 'babwe' };
        btree2 = new BehaviorTree({
          title: 'tree2',
          tree: 'testtask'
        });
      });

      it('also runs the registered task with right test obj', function() {
        btree2.setObject(testObj2);
        btree2.step();
        expect(hasRunObj[0]).toBe(testObj2);
      });

      describe('and setting up objects and calling both trees', function() {
        beforeEach(function() {
          btree2.setObject(testObj2);
          btree.setObject(testObj1);
          btree.step();
          btree2.step();
        });

        it('does not log warnings into console', function() {
          expect(msg).toBeFalsy();
        });

        it('gives the right objects', function() {
          expect(hasRunObj[0]).toBe(testObj1);
          expect(hasRunObj[1]).toBe(testObj2);
        });
      });
    });
  });

  describe('with several tasks to lookup', function() {
    var hasRunObj1, hasRunObj2, testObj1, msg, beSuccess;
    beforeEach(function() {
      beSuccess = true;
      hasRunObj1 = [];
      hasRunObj2 = [];
      testObj1 = { sim: 'ba' };
      BehaviorTree.register('testtask', new BehaviorTree.Task({
        title: 1,
        run: function(obj) {
          hasRunObj1.push(obj);
          if (beSuccess) {
            this.success();
          } else {
            this.fail();
          }
        }
      }));
      BehaviorTree.register('testtask2', new BehaviorTree.Task({
        title: 2,
        run: function(obj) {
          hasRunObj2.push(obj);
        }
      }));
      btree = new BehaviorTree({
        title: 'tree1',
        tree: new BehaviorTree.Sequence({
          title: 'my sequence',
          nodes: [
            'testtask',
            'testtask2'
          ]
        })
      });
      realLog = console.log;
 //     console.log = function(m) { msg = m; };
    });

    afterEach(function() {
      console.log = realLog;
    });

    it('runs the registered tasks both with right test obj', function() {
      btree.setObject(testObj1);
      btree.step();
      expect(hasRunObj1[0]).toBe(testObj1);
      expect(hasRunObj2[0]).toBe(testObj1);
    });

    describe('and looking up the same tasks in another tree', function() {
      var btree2, testObj2;
      beforeEach(function() {
        testObj2 = { sim: 'babwe' };
        btree2 = new BehaviorTree({
          title: 'tree2',
          tree: new BehaviorTree.Sequence({
            title: 'my sequence',
            nodes: [
              'testtask',
              'testtask2'
            ]
          })
        });
      });

      it('also runs the registered tasks with right test obj', function() {
        btree2.setObject(testObj2);
        btree2.step();
        expect(hasRunObj1[0]).toBe(testObj2);
        expect(hasRunObj2[0]).toBe(testObj2);
      });

      describe('and setting up objects and calling both trees', function() {
        beforeEach(function() {
          btree2.setObject(testObj2);
          btree.setObject(testObj1);
          btree.step();
          btree2.step();
        });

        it('does not log warnings into console', function() {
          expect(msg).toBeFalsy();
        });

        it('gives the right objects', function() {
          expect(hasRunObj1[0]).toBe(testObj1);
          expect(hasRunObj1[1]).toBe(testObj2);
          expect(hasRunObj2[0]).toBe(testObj1);
          expect(hasRunObj2[1]).toBe(testObj2);
        });
      });
    });

    describe('and if the sequence also is looked up', function() {
      var btree3, testObj3;
      beforeEach(function() {
        testObj3 = { sim: 'foo' };
        BehaviorTree.register('le sequence', new BehaviorTree.Sequence({
          title: 'my sequence',
          nodes: [
            'testtask',
            'testtask2'
          ]
        }));
        btree3 = new BehaviorTree({
          title: 'tree3',
          tree: 'le sequence'
        });
      });

      it('also runs the registered tasks with right test obj', function() {
        btree3.setObject(testObj3);
        btree3.step();
        expect(hasRunObj1[0]).toBe(testObj3);
        expect(hasRunObj2[0]).toBe(testObj3);
      });

      describe('and we call the sequence with several trees', function() {
        beforeEach(function() {
          btree.setObject(testObj1);
          btree3.setObject(testObj3);
          btree.step();
          btree3.step();
        });

        it('does not log warnings into console', function() {
          expect(msg).toBeFalsy();
        });

        it('gives the right objects', function() {
          expect(hasRunObj1[0]).toBe(testObj1);
          expect(hasRunObj1[1]).toBe(testObj3);
          expect(hasRunObj2[0]).toBe(testObj1);
          expect(hasRunObj2[1]).toBe(testObj3);
        });
      });
    });

    describe('and if the selector also is looked up', function() {
      var btree3, testObj3;
      beforeEach(function() {
        testObj3 = { sim: 'bar' };
        BehaviorTree.register('le selector', new BehaviorTree.Selector({
          title: 'my selector',
          nodes: [
            'testtask',
            'testtask2'
          ]
        }));
        btree3 = new BehaviorTree({
          title: 'tree3',
          tree: 'le selector'
        });
      });

      it('also runs the registered tasks with right test obj', function() {
        beSuccess = false;
        btree3.setObject(testObj3);
        btree3.step();
        expect(hasRunObj1[0]).toBe(testObj3);
        expect(hasRunObj2[0]).toBe(testObj3);
      });

      describe('and we call the selector with several trees', function() {
        beforeEach(function() {
          btree.setObject(testObj1);
          btree3.setObject(testObj3);
          btree.step();
          beSuccess = false;
          btree3.step();
        });

        it('does not log warnings into console', function() {
          expect(msg).toBeFalsy();
        });

        it('gives the right objects', function() {
          expect(hasRunObj1[0]).toBe(testObj1);
          expect(hasRunObj1[1]).toBe(testObj3);
          expect(hasRunObj2[0]).toBe(testObj1);
          expect(hasRunObj2[1]).toBe(testObj3);
        });
      });
    });
  });

  describe('with a failing lookup task as root note', function() {
    var hasRunObj, testObj1, msg, callSuccess;
    beforeEach(function() {
      hasRunObj = [];
      testObj1 = { sim: 'ba' };
      BehaviorTree.register('testtask', new BehaviorTree.Task({
        run: function(obj) {
          hasRunObj.push(obj);
          this.fail();
        }
      }));
      btree = new BehaviorTree({
        title: 'tree1',
        tree: 'testtask'
      });
    });

    it('runs the registered task with right test obj', function() {
      btree.setObject(testObj1);
      btree.step();
      expect(hasRunObj[0]).toBe(testObj1);
    });
  });

  describe('with a failing lookup sequence', function() {
    var hasRunObj, testObj1, msg, callSuccess;
    beforeEach(function() {
      hasRunObj = [];
      testObj1 = { sim: 'ba' };
      BehaviorTree.register('testtask', new BehaviorTree.Task({
        run: function(obj) {
          hasRunObj.push(obj);
          this.fail();
        }
      }));
      BehaviorTree.register('testseq', new BehaviorTree.Sequence({
        nodes: [
          'testtask',
          new BehaviorTree.Task({
            run: function(obj) {
              // this should not run
              expect(true).toBe(false);
            }
          })
        ]
      }));
      btree = new BehaviorTree({
        title: 'tree1',
        tree: 'testseq'
      });
    });

    it('runs the first task in sequence with right test obj', function() {
      btree.setObject(testObj1);
      btree.step();
      expect(hasRunObj[0]).toBe(testObj1);
    });
  });

  describe('with a task that is running and happens to be in another tree', function() {
    var btree, btree2, hasRunObj, testObj1, testObj2;
    beforeEach(function() {
      hasRunObj = [];
      testObj1 = { foo: 'ba' };
      testObj2 = { foo: 'bar' };
      BehaviorTree.register('testtask', new BehaviorTree.Task({
        run: function(obj) {
          hasRunObj.push(obj);
          this.running();
        }
      }));
      BehaviorTree.register('testseq', new BehaviorTree.Sequence({
        nodes: [
          'testtask'
        ]
      }));
      btree = new BehaviorTree({
        title: 'tree1',
        tree: 'testseq'
      });
      btree2 = new BehaviorTree({
        title: 'tree2',
        tree: 'testseq'
      });
    });

    it('has the right object when called twice in same tree', function() {
      btree.setObject(testObj1);
      btree.step();
      btree.step();
      expect(hasRunObj[0]).toBe(testObj1);
      expect(hasRunObj[1]).toBe(testObj1);
    });

    it('has the right object when called in both trees', function() {
      btree2.setObject(testObj2);
      btree.setObject(testObj1);
      btree.step();
      btree2.step();
      btree2.step();
      btree.step();
      expect(hasRunObj[0]).toBe(testObj1);
      expect(hasRunObj[1]).toBe(testObj2);
      expect(hasRunObj[2]).toBe(testObj2);
      expect(hasRunObj[3]).toBe(testObj1);
    });
  });

  describe('the start method of root task', function() {
    var node, runObj, btree, testObj;
    beforeEach(function() {
      testObj = 123;
      node = new BehaviorTree.Node({
        run: function() {
          this.success();
        },
        start: function(arg) {
          runObj = arg;
        }
      });
      btree = new BehaviorTree({
        title: 'test me',
        tree: node
      });
      btree.setObject(testObj);
      btree.step();
    });

    it("gets the object as argument we passed in", function() {
      expect(runObj).toBe(testObj);
    });
  });

  describe('the end method of root task', function() {
    var node, runObj, btree, testObj, beSuccess;
    beforeEach(function() {
      testObj = 123;
      node = new BehaviorTree.Node({
        run: function() {
          if (beSuccess) {
            this.success();
          } else {
            this.fail();
          }
        },
        end: function(arg) {
          runObj = arg;
        }
      });
      btree = new BehaviorTree({
        title: 'test me twice',
        tree: node
      });
      btree.setObject(testObj);
    });

    describe('if success is called by task', function() {
      beforeEach(function() {
        beSuccess = true;
      });
      it("gets the object as argument we passed in", function() {
        btree.step();
        expect(runObj).toBe(testObj);
      });
    });

    describe('if fail is called by task', function() {
      beforeEach(function() {
        beSuccess = false;
      });
      it("gets the object as argument we passed in", function() {
        btree.step();
        expect(runObj).toBe(testObj);
      });
    });

  });
});
