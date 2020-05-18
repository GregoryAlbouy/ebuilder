"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidChild = exports.isValidSource = exports.isStringObject = exports.isArrayArray = exports.isEventTupleArray = exports.isEventTuple = exports.isTypeOf = exports.typeOf = void 0;

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

exports.isEventTuple = function (subject) {
  return exports.isTypeOf(subject, 'array') && exports.isTypeOf(subject[0], 'string') && exports.isTypeOf(subject[1], 'function') && (!subject[2] || exports.isTypeOf(subject[2], 'boolean', 'object'));
};

exports.isEventTupleArray = function (subject) {
  return exports.isTypeOf(subject, 'array') && subject.every(exports.isEventTuple);
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

exports.isValidSource = function (source) {
  return source instanceof Element || exports.typeOf(source) === 'string';
};

exports.isValidChild = function (child) {
  return exports.isTypeOf(child, 'string', 'number') || child instanceof Node || child.isElementBuilder;
};