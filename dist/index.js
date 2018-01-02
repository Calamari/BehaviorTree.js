(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("behaviortree", [], factory);
	else if(typeof exports === 'object')
		exports["behaviortree"] = factory();
	else
		root["behaviortree"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar RUNNING = exports.RUNNING = Symbol('running');\nvar SUCCESS = exports.SUCCESS = true;\nvar FAILURE = exports.FAILURE = false;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/constants.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/constants.js?");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _constants = __webpack_require__(0);\n\nvar _Node2 = __webpack_require__(3);\n\nvar _Node3 = _interopRequireDefault(_Node2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar BranchNode = function (_Node) {\n  _inherits(BranchNode, _Node);\n\n  function BranchNode(blueprint) {\n    _classCallCheck(this, BranchNode);\n\n    var _this = _possibleConstructorReturn(this, (BranchNode.__proto__ || Object.getPrototypeOf(BranchNode)).call(this, blueprint));\n\n    _this.numNodes = blueprint.nodes.length;\n    return _this;\n  }\n\n  _createClass(BranchNode, [{\n    key: 'run',\n    value: function run() {\n      var blackboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n\n      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n          _ref$indexes = _ref.indexes,\n          indexes = _ref$indexes === undefined ? [] : _ref$indexes,\n          rerun = _ref.rerun,\n          _ref$registryLookUp = _ref.registryLookUp,\n          registryLookUp = _ref$registryLookUp === undefined ? function (x) {\n        return x;\n      } : _ref$registryLookUp;\n\n      this.blueprint.start(blackboard);\n      var overallResult = this.START_CASE;\n      var currentIndex = indexes.shift() || 0;\n      while (currentIndex < this.numNodes) {\n        var node = registryLookUp(this.blueprint.nodes[currentIndex]);\n        var result = node.run(blackboard, { indexes: indexes, rerun: rerun, registryLookUp: registryLookUp });\n        if (result === _constants.RUNNING) {\n          return [currentIndex].concat(_toConsumableArray(indexes));\n        } else if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {\n          // array\n          return [].concat(_toConsumableArray(indexes), [currentIndex], _toConsumableArray(result));\n        } else if (result === this.OPT_OUT_CASE) {\n          overallResult = result;\n          break;\n        } else {\n          ++currentIndex;\n        }\n      }\n      this.blueprint.end(blackboard);\n      return overallResult;\n    }\n  }]);\n\n  return BranchNode;\n}(_Node3.default);\n\nexports.default = BranchNode;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/BranchNode.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/BranchNode.js?");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _Node2 = __webpack_require__(3);\n\nvar _Node3 = _interopRequireDefault(_Node2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Task = function (_Node) {\n  _inherits(Task, _Node);\n\n  function Task() {\n    _classCallCheck(this, Task);\n\n    return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));\n  }\n\n  return Task;\n}(_Node3.default);\n\nexports.default = Task;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/Task.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/Task.js?");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _constants = __webpack_require__(0);\n\nfunction _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar NOOP = function NOOP() {};\n\nvar Node = function () {\n  function Node(_ref) {\n    var _ref$run = _ref.run,\n        run = _ref$run === undefined ? NOOP : _ref$run,\n        _ref$start = _ref.start,\n        start = _ref$start === undefined ? NOOP : _ref$start,\n        _ref$end = _ref.end,\n        end = _ref$end === undefined ? NOOP : _ref$end,\n        props = _objectWithoutProperties(_ref, ['run', 'start', 'end']);\n\n    _classCallCheck(this, Node);\n\n    this.blueprint = _extends({ run: run, start: start, end: end }, props);\n  }\n\n  _createClass(Node, [{\n    key: 'run',\n    value: function run(blackboard) {\n      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n          _ref2$rerun = _ref2.rerun,\n          rerun = _ref2$rerun === undefined ? false : _ref2$rerun;\n\n      if (!rerun) this.blueprint.start(blackboard);\n      var result = this.blueprint.run(blackboard);\n      if (result !== _constants.RUNNING) {\n        this.blueprint.end(blackboard);\n      }\n      return result;\n    }\n  }]);\n\n  return Node;\n}();\n\nexports.default = Node;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/Node.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/Node.js?");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.RUNNING = exports.FAILURE = exports.SUCCESS = exports.Task = exports.createDecorator = exports.Decorator = exports.Random = exports.Sequence = exports.Selector = exports.Node = exports.BranchNode = undefined;\n\nvar _Decorator2 = __webpack_require__(5);\n\nObject.defineProperty(exports, 'createDecorator', {\n  enumerable: true,\n  get: function get() {\n    return _Decorator2.createDecorator;\n  }\n});\n\nvar _constants = __webpack_require__(0);\n\nObject.defineProperty(exports, 'SUCCESS', {\n  enumerable: true,\n  get: function get() {\n    return _constants.SUCCESS;\n  }\n});\nObject.defineProperty(exports, 'FAILURE', {\n  enumerable: true,\n  get: function get() {\n    return _constants.FAILURE;\n  }\n});\nObject.defineProperty(exports, 'RUNNING', {\n  enumerable: true,\n  get: function get() {\n    return _constants.RUNNING;\n  }\n});\n\nvar _BehaviorTree = __webpack_require__(6);\n\nvar _BehaviorTree2 = _interopRequireDefault(_BehaviorTree);\n\nvar _BranchNode2 = __webpack_require__(1);\n\nvar _BranchNode3 = _interopRequireDefault(_BranchNode2);\n\nvar _Node2 = __webpack_require__(3);\n\nvar _Node3 = _interopRequireDefault(_Node2);\n\nvar _Selector2 = __webpack_require__(7);\n\nvar _Selector3 = _interopRequireDefault(_Selector2);\n\nvar _Sequence2 = __webpack_require__(8);\n\nvar _Sequence3 = _interopRequireDefault(_Sequence2);\n\nvar _Random2 = __webpack_require__(9);\n\nvar _Random3 = _interopRequireDefault(_Random2);\n\nvar _Decorator3 = _interopRequireDefault(_Decorator2);\n\nvar _Task2 = __webpack_require__(2);\n\nvar _Task3 = _interopRequireDefault(_Task2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = _BehaviorTree2.default;\nexports.BranchNode = _BranchNode3.default;\nexports.Node = _Node3.default;\nexports.Selector = _Selector3.default;\nexports.Sequence = _Sequence3.default;\nexports.Random = _Random3.default;\nexports.Decorator = _Decorator3.default;\nexports.Task = _Task3.default;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.js\n// module id = 4\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.createDecorator = createDecorator;\n\nvar _Task = __webpack_require__(2);\n\nvar _Task2 = _interopRequireDefault(_Task);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// export default function decorator (config) {\n//   return node => {\n//     return new Task({\n//       run (blackboard, runConfig) {\n//         return node.run(blackboard, runConfig)\n//       }\n//     })\n//   }\n// }\n\nfunction createDecorator(decorator) {\n  return function (config) {\n    return function (node) {\n      return new _Task2.default({\n        run: function run(blackboard, runConfig) {\n          return decorator(function () {\n            return node.run(blackboard, runConfig);\n          }, blackboard, config);\n        }\n      });\n    };\n  };\n}\n\n/**\n * This decorator does nothing really, but demonstrates how a decorator works\n */\nexports.default = createDecorator(function (run) {\n  return run();\n});\n\n//\n//\n// class Decorator {\n//   constructor (config) {\n//     this.config = config\n//   }\n//\n//   apply (node) {\n//     return {\n//       run: (blackboard, runConfig) => {\n//         return node.run(blackboard, runConfig)\n//       }\n//     }\n//   }\n// }\n//\n// const InvertDecorator = createDecorator((run) => {\n//   const result = run()\n// })\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/Decorator.js\n// module id = 5\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/Decorator.js?");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _constants = __webpack_require__(0);\n\nvar _Task = __webpack_require__(2);\n\nvar _Task2 = _interopRequireDefault(_Task);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar registry = {};\n\nfunction registryLookUp(node) {\n  if (typeof node === 'string') {\n    var lookedUpNode = registry[node];\n    if (!lookedUpNode) {\n      throw new Error('No node with name ' + node + ' registered.');\n    }\n    return lookedUpNode;\n  }\n  return node;\n}\n\nvar BehaviorTree = function () {\n  function BehaviorTree(_ref) {\n    var tree = _ref.tree,\n        blackboard = _ref.blackboard;\n\n    _classCallCheck(this, BehaviorTree);\n\n    this.tree = tree;\n    this.blackboard = blackboard;\n    this.lastResult = null;\n  }\n\n  _createClass(BehaviorTree, [{\n    key: 'step',\n    value: function step() {\n      var indexes = this.lastResult && _typeof(this.lastResult) === 'object' ? this.lastResult : [];\n      var rerun = this.lastResult === _constants.RUNNING || indexes.length > 0;\n      this.lastResult = registryLookUp(this.tree).run(this.blackboard, { indexes: indexes, rerun: rerun, registryLookUp: registryLookUp });\n    }\n  }], [{\n    key: 'register',\n    value: function register(name, node) {\n      registry[name] = typeof node === 'function' ? new _Task2.default({ run: node }) : node;\n    }\n  }, {\n    key: 'cleanRegistry',\n    value: function cleanRegistry() {\n      registry = {};\n    }\n  }]);\n\n  return BehaviorTree;\n}();\n\nexports.default = BehaviorTree;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/BehaviorTree.js\n// module id = 6\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/BehaviorTree.js?");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _constants = __webpack_require__(0);\n\nvar _BranchNode2 = __webpack_require__(1);\n\nvar _BranchNode3 = _interopRequireDefault(_BranchNode2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Selector = function (_BranchNode) {\n  _inherits(Selector, _BranchNode);\n\n  function Selector(blueprint) {\n    _classCallCheck(this, Selector);\n\n    var _this = _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this, blueprint));\n\n    _this.START_CASE = _constants.FAILURE;\n    _this.OPT_OUT_CASE = _constants.SUCCESS;\n    return _this;\n  }\n\n  return Selector;\n}(_BranchNode3.default);\n\nexports.default = Selector;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/Selector.js\n// module id = 7\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/Selector.js?");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _constants = __webpack_require__(0);\n\nvar _BranchNode2 = __webpack_require__(1);\n\nvar _BranchNode3 = _interopRequireDefault(_BranchNode2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Sequence = function (_BranchNode) {\n  _inherits(Sequence, _BranchNode);\n\n  function Sequence(blueprint) {\n    _classCallCheck(this, Sequence);\n\n    var _this = _possibleConstructorReturn(this, (Sequence.__proto__ || Object.getPrototypeOf(Sequence)).call(this, blueprint));\n\n    _this.START_CASE = _constants.SUCCESS;\n    _this.OPT_OUT_CASE = _constants.FAILURE;\n    return _this;\n  }\n\n  return Sequence;\n}(_BranchNode3.default);\n\nexports.default = Sequence;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/Sequence.js\n// module id = 8\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/Sequence.js?");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _constants = __webpack_require__(0);\n\nvar _BranchNode2 = __webpack_require__(1);\n\nvar _BranchNode3 = _interopRequireDefault(_BranchNode2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Random = function (_BranchNode) {\n  _inherits(Random, _BranchNode);\n\n  function Random() {\n    _classCallCheck(this, Random);\n\n    return _possibleConstructorReturn(this, (Random.__proto__ || Object.getPrototypeOf(Random)).apply(this, arguments));\n  }\n\n  _createClass(Random, [{\n    key: 'run',\n    value: function run() {\n      var blackboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n\n      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},\n          _ref$indexes = _ref.indexes,\n          indexes = _ref$indexes === undefined ? [] : _ref$indexes,\n          rerun = _ref.rerun,\n          _ref$registryLookUp = _ref.registryLookUp,\n          registryLookUp = _ref$registryLookUp === undefined ? function (x) {\n        return x;\n      } : _ref$registryLookUp;\n\n      this.blueprint.start(blackboard);\n      var currentIndex = indexes.shift() || 0;\n      if (!rerun) {\n        currentIndex = Math.floor(Math.random() * this.numNodes);\n      }\n      console.log(rerun, currentIndex);\n      var node = registryLookUp(this.blueprint.nodes[currentIndex]);\n      var result = node.run(blackboard, { indexes: indexes, rerun: rerun, registryLookUp: registryLookUp });\n      if (result === _constants.RUNNING) {\n        return [currentIndex].concat(_toConsumableArray(indexes));\n      } else if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {\n        // array\n        return [].concat(_toConsumableArray(indexes), [currentIndex], _toConsumableArray(result));\n      }\n      this.blueprint.end(blackboard);\n      return result;\n    }\n  }]);\n\n  return Random;\n}(_BranchNode3.default);\n\nexports.default = Random;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/Random.js\n// module id = 9\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/Random.js?");

/***/ })
/******/ ]);
});