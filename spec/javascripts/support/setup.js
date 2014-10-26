// Export modules to global scope as necessary (only for testing)
if (typeof process !== 'undefined' && process.title === 'node') {
  // We are in node. Require modules.
  expect = require('chai').expect;
  sinon = require('sinon');
  BehaviorTree = require('../../../btree-complete.js');
  isBrowser = false;
} else {
  // We are in the browser. Set up variables like above using served js files.
  expect = chai.expect;
  // sinon already exported globally in the browser.
  isBrowser = true;
}
