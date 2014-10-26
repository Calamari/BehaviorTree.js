/* globals BehaviorTree */

describe('BehaviorTree', function() {
  describe('can be constructed with', function() {
    it('an object containing the tree key', function() {
      var btree = new BehaviorTree({
        tree: {}
      });

      expect(btree).to.be.instanceOf(BehaviorTree);
    });
  });

  it('has a register method', function() {
    expect(BehaviorTree).itself.to.respondTo('register');
  });

  it('has a getNode', function() {
    expect(BehaviorTree).itself.to.respondTo('getNode');
  });

  describe('can save an object with register method', function() {
    var node = new BehaviorTree.Node({});
    beforeEach(function() {
      BehaviorTree.register('myNode', node);
    });
    it('and getNode returns it', function() {
      expect(BehaviorTree.getNode('myNode')).to.eql(node);
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
      expect(btree).to.respondTo('step');
    });

    it('has a setObject method', function() {
      expect(btree).to.respondTo('setObject');
    });
  });

  describe('setup with a minimal tree', function() {
    var btree, runCount, beSuccess, startCalled, endCalled;
    beforeEach(function() {
      runCount = 0;
      beSuccess = startCalled = endCalled = false;
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({
          start: function() { startCalled = true; },
          end: function() { endCalled = true; },
          run: function() {
            runCount += 1;
            this.success();
          }
        })
      });
    });

    it('the step method calls start of root node', function() {
      btree.step();
      expect(startCalled).to.be.ok;
    });

    it('the step method calls run of root node', function() {
      btree.step();
      expect(runCount).to.eql(1);
    });

    it('the step method calls end of root node on success', function() {
      beSuccess = true;
      btree.step();
      expect(endCalled).to.be.ok;
    });

    it('the step method calls end of root node on fail', function() {
      btree.step();
      expect(endCalled).to.be.ok;
    });
  });

  describe('a tree where the root node does not call neither success, fail, nor running', function() {
    var btree;
    beforeEach(function() {
      btree = new BehaviorTree({
        title: 'the TREE',
        tree: new BehaviorTree.Task({
          run: function() {}
        })
      });
    });

    it('throws error', function() {
      btree.step();
      expect(function() {
        btree.step();
      }).to.throw('the BehaviorTree "the TREE" did call step but one Task did not finish on last call of step.');
    });
  });

  describe('when having a more complex tree', function() {
    var runCount1, runCount2, beSuccess1, beSuccess2, stillRunning2, btree;
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
                runCount1 += 1;
                if (beSuccess1) { this.success(); }
                else { this.fail(); }
              }
            }),
            new BehaviorTree.Task({
              title: 'node2',
              run: function() {
                runCount2 += 1;
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
          expect(runCount1).to.eql(1);
          expect(runCount2).to.eql(1);
        });

        describe('on second step', function() {
          beforeEach(function() {
            btree.step();
          });

          it('the first node will not be called again', function() {
            expect(runCount1).to.eql(1);
          });

          it('the second node will be called', function() {
            expect(runCount2).to.eql(2);
          });

          describe('as long as second is running', function() {
            beforeEach(function() {
              btree.step();
              btree.step();
              btree.step();
            });

            it('the first node will still not be called again', function() {
              expect(runCount1).to.eql(1);
            });

            it('the second node will be called', function() {
              expect(runCount2).to.eql(5);
            });

            describe('and if that node finally ends', function() {
              beforeEach(function() {
                stillRunning2 = false;
                btree.step();
                // now all will be run again
                btree.step();
              });

              it('the first node will still not be called again', function() {
                expect(runCount1).to.eql(2);
              });

              it('the second node will be called', function() {
                expect(runCount2).to.eql(7);
              });
            });
          });
        });

      });
    });
  });

  describe('when setting setObject to the tree', function() {
    var obj, runCount, btree;
    beforeEach(function() {
      runCount = 0;
      obj = { foo: 'bar' };
      btree = new BehaviorTree({
        tree: new BehaviorTree.Task({
          run: function(object) {
            expect(object).to.eql(obj);
            runCount += 1;
          }
        })
      });
      btree.setObject(obj);
    });

    it('the run method has the object as argument', function() {
      btree.step();
      expect(runCount).to.eql(1);
    });
  });

  describe('when setting object as config and having more then one node', function() {
    var obj, runCount, btree;
    beforeEach(function() {
      runCount = 0;
      obj = { word: 'bird' };
      btree = new BehaviorTree({
        object: obj,
        tree: new BehaviorTree.Sequence({
          title: 'my sequence',
          nodes: [
            new BehaviorTree.Task({
              run: function(object) {
                expect(object).to.eql(obj);
                runCount += 1;
              }
            })
          ]
        })
      });
    });

    it('the run method has the object as argument', function() {
      btree.step();
      expect(runCount).to.eql(1);
    });
  });

  // Hier 4:
  describe('a minimal tree with a lookup task as root note', function() {
    var hasRunObj, testObj1, callSuccess, btree;
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
    });

    it('runs the registered task with right test obj', function() {
      btree.setObject(testObj1);
      btree.step();
      expect(hasRunObj[0]).to.eql(testObj1);
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
        expect(hasRunObj[0]).to.eql(testObj2);
      });

      describe('and setting up objects and calling both trees', function() {
        beforeEach(function() {
          btree2.setObject(testObj2);
          btree.setObject(testObj1);
        });

        it('does not throw any error', function() {
          expect(function() {
            btree.step();
            btree2.step();
          }).not.to.throw();
        });

        it('gives the right objects', function() {
          btree.step();
          btree2.step();

          expect(hasRunObj[0]).to.eql(testObj1);
          expect(hasRunObj[1]).to.eql(testObj2);
        });
      });
    });
  });

  describe('register can also be called using the title instead with explicit name', function() {
    var hasRunObj, testObj1, btree;
    beforeEach(function() {
      hasRunObj = null;
      testObj1 = { sim: 'ba' };
      BehaviorTree.register(new BehaviorTree.Task({
        title: 'testtask',
        run: function(obj) {
          hasRunObj = obj;
          this.success();
        }
      }));
      btree = new BehaviorTree({
        title: 'tree1',
        tree: 'testtask'
      });
      btree.setObject(testObj1);
      btree.step();
    });

    it('runs the registered task with right test obj', function() {
      expect(hasRunObj).to.eql(testObj1);
    });
  });

  describe('with several tasks to lookup', function() {
    var hasRunObj1, hasRunObj2, testObj1, beSuccess, btree;
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
    });

    it('runs the registered tasks both with right test obj', function() {
      btree.setObject(testObj1);
      btree.step();
      expect(hasRunObj1[0]).to.eql(testObj1);
      expect(hasRunObj2[0]).to.eql(testObj1);
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
        expect(hasRunObj1[0]).to.eql(testObj2);
        expect(hasRunObj2[0]).to.eql(testObj2);
      });

      describe('and setting up objects and calling both trees', function() {
        beforeEach(function() {
          btree2.setObject(testObj2);
          btree.setObject(testObj1);
        });

        it('does not throw any error', function() {
          expect(function() {
            btree.step();
            btree2.step();
          }).not.to.throw();
        });

        it('gives the right objects', function() {
          btree.step();
          btree2.step();

          expect(hasRunObj1[0]).to.eql(testObj1);
          expect(hasRunObj1[1]).to.eql(testObj2);
          expect(hasRunObj2[0]).to.eql(testObj1);
          expect(hasRunObj2[1]).to.eql(testObj2);
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
        expect(hasRunObj1[0]).to.eql(testObj3);
        expect(hasRunObj2[0]).to.eql(testObj3);
      });

      describe('and we call the sequence with several trees', function() {
        beforeEach(function() {
          btree.setObject(testObj1);
          btree3.setObject(testObj3);
        });

        it('does not throw any error', function() {
          expect(function() {
            btree.step();
            btree3.step();
          }).not.to.throw();
        });

        it('gives the right objects', function() {
          btree.step();
          btree3.step();

          expect(hasRunObj1[0]).to.eql(testObj1);
          expect(hasRunObj1[1]).to.eql(testObj3);
          expect(hasRunObj2[0]).to.eql(testObj1);
          expect(hasRunObj2[1]).to.eql(testObj3);
        });
      });
    });

    describe('and if the priority selector also is looked up', function() {
      var btree3, testObj3;
      beforeEach(function() {
        testObj3 = { sim: 'bar' };
        BehaviorTree.register('le selector', new BehaviorTree.Priority({
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
        expect(hasRunObj1[0]).to.eql(testObj3);
        expect(hasRunObj2[0]).to.eql(testObj3);
      });

      describe('and we call the priority selector with several trees', function() {
        beforeEach(function() {
          btree.setObject(testObj1);
          btree3.setObject(testObj3);
        });

        it('does not throw any error', function() {
          expect(function() {
            btree.step();
            beSuccess = false;
            btree3.step();
          }).not.to.throw();
        });

        it('gives the right objects', function() {
          btree.step();
          beSuccess = false;
          btree3.step();

          expect(hasRunObj1[0]).to.eql(testObj1);
          expect(hasRunObj1[1]).to.eql(testObj3);
          expect(hasRunObj2[0]).to.eql(testObj1);
          expect(hasRunObj2[1]).to.eql(testObj3);
        });
      });
    });
  });

  describe('with a failing lookup task as root note', function() {
    var hasRunObj, testObj1, btree;
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
      expect(hasRunObj[0]).to.eql(testObj1);
    });
  });

  describe('with a failing lookup sequence', function() {
    var hasRunObj, testObj1, btree;
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
            run: function() {
              // this should not run
              expect(true).to.be.false;
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
      expect(hasRunObj[0]).to.eql(testObj1);
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
      expect(hasRunObj[0]).to.eql(testObj1);
      expect(hasRunObj[1]).to.eql(testObj1);
    });

    it('has the right object when called in both trees', function() {
      btree2.setObject(testObj2);
      btree.setObject(testObj1);
      btree.step();
      btree2.step();
      btree2.step();
      btree.step();
      expect(hasRunObj[0]).to.eql(testObj1);
      expect(hasRunObj[1]).to.eql(testObj2);
      expect(hasRunObj[2]).to.eql(testObj2);
      expect(hasRunObj[3]).to.eql(testObj1);
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

    it('gets the object as argument we passed in', function() {
      expect(runObj).to.eql(testObj);
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
      it('gets the object as argument we passed in', function() {
        btree.step();
        expect(runObj).to.eql(testObj);
      });
    });

    describe('if fail is called by task', function() {
      beforeEach(function() {
        beSuccess = false;
      });
      it('gets the object as argument we passed in', function() {
        btree.step();
        expect(runObj).to.eql(testObj);
      });
    });
  });

  describe('having a running task under a Sequence', function() {
    var node, runCount, runHighPrio, runFirstSeq, btree, runObj;
    beforeEach(function() {
      runCount = runHighPrio = runFirstSeq = 0;
      node = new BehaviorTree.Node({
        run: function() {
          runCount += 1;
          this.running();
        },
        end: function(arg) {
          runObj = arg;
        }
      });
      btree = new BehaviorTree({
        title: 'prio or not to prio',
        tree: new BehaviorTree.Priority({
          title: 'selector',
          nodes: [
            new BehaviorTree.Node({
              title: 'high prio',
              run: function() {
                runHighPrio += 1;
                this.fail();
              }
            }),
            new BehaviorTree.Sequence({
              title: 'sequence',
              nodes: [
                new BehaviorTree.Node({
                  title: 'first in sequence',
                  run: function() {
                    runFirstSeq += 1;
                    this.success();
                  }
                }),
                node
              ]
            })
          ]
        })
      });
      btree.step();
      btree.step();
    });

    it('tries running task in first position of priority selector', function() {
      expect(runHighPrio).to.eql(2);
    });

    it('does not run the task in sequence before the running task', function() {
      expect(runFirstSeq).to.eql(1);
    });

    it('reruns the running task again', function() {
      expect(runCount).to.eql(2);
    });
  });
});
