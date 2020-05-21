"use strict";
/* Type checks */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNamedFunction = exports.hasName = exports.isValidTarget = exports.isValidSwap = exports.isValidSource = exports.isValidChild = exports.isEBuilder = exports.isElement = exports.isEventTupleArray = exports.isEventTuple = exports.isStringObject = exports.isArrayArray = exports.isArray = exports.isFunction = exports.isNumber = exports.isTypeOf = exports.typeOf = void 0;

exports.typeOf = function (s) {
  return "".concat({}.toString.call(s)).replace(/^\[object ([a-z]+)\]$/i, '$1').toLowerCase();
};

exports.isTypeOf = function (x) {
  for (var _len = arguments.length, types = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    types[_key - 1] = arguments[_key];
  }

  return types.map(function (type) {
    return exports.typeOf(x) === type.toLocaleLowerCase();
  }).reduce(function (a, c) {
    return a || c;
  });
};

exports.isNumber = function (subject) {
  return exports.isTypeOf(subject, 'number');
};

exports.isFunction = function (subject) {
  return exports.isTypeOf(subject, 'function');
};

exports.isArray = function (subject) {
  return exports.isTypeOf(subject, 'array');
};

exports.isArrayArray = function (subject) {
  return exports.isTypeOf(subject, 'array') && subject.every(function (item) {
    return exports.isTypeOf(item, 'array');
  });
};

exports.isStringObject = function (subject) {
  return exports.isTypeOf(subject, 'object') && Object.keys(subject).every(function (item) {
    return exports.isTypeOf(item, 'string');
  });
};

exports.isEventTuple = function (subject) {
  return exports.isTypeOf(subject, 'array') && exports.isTypeOf(subject[0], 'string') && exports.isTypeOf(subject[1], 'function') && (!subject[2] || exports.isTypeOf(subject[2], 'boolean', 'object'));
};

exports.isEventTupleArray = function (subject) {
  return exports.isTypeOf(subject, 'array') && subject.every(exports.isEventTuple);
};

exports.isElement = function (subject) {
  return subject instanceof Element;
};

exports.isEBuilder = function (subject) {
  return subject instanceof Object && 'isEBuilder' in subject && 'el' in subject && subject.isEBuilder && subject.el;
};

exports.isValidChild = function (child) {
  return exports.isTypeOf(child, 'string', 'number') || child instanceof Node || child.isEBuilder;
};

exports.isValidSource = function (source) {
  return source instanceof Element || exports.isTypeOf(source, 'string');
};

exports.isValidSwap = function (element, swapped) {
  return element instanceof HTMLElement && swapped instanceof HTMLElement && !!element.parentNode && !!swapped.parentNode && element !== swapped;
};

exports.isValidTarget = function (target) {
  return exports.isEBuilder(target) || target instanceof Element;
};

exports.hasName = function (input) {
  return !!input.name;
};

exports.isNamedFunction = function (input) {
  return exports.isFunction(input) && exports.hasName(input);
};