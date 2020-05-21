"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.For = exports.If = exports.Timeout = exports.Interval = exports.Once = exports.On = exports.RuleMap = void 0;

var EBuilderError_1 = require("./EBuilderError");

var Parse = require("./Parse");

exports.RuleMap = {
  on: On,
  once: Once,
  interval: Interval,
  timeout: Timeout,
  "if": If,
  "for": For
};

function handleEvent(eventInput, callback, isOnce) {
  var _Parse$eventInput$cal = Parse.eventInput.call(this, eventInput),
      _Parse$eventInput$cal2 = (0, _slicedToArray2["default"])(_Parse$eventInput$cal, 2),
      type = _Parse$eventInput$cal2[0],
      emitter = _Parse$eventInput$cal2[1];

  var once = function once() {
    emitter.removeEventListener(type, once);
    callback();
  };

  var handler = isOnce ? once : callback;
  if ('addEventListener' in emitter) emitter.addEventListener(type, handler);
}

function On(eventInput, callback) {
  handleEvent.call(this, eventInput, callback);
}

exports.On = On;

function Once(eventInput, callback) {
  handleEvent.call(this, eventInput, callback, true);
}

exports.Once = Once;

function Interval(rate, callback) {
  this.interval = setInterval(callback, parseInt(rate));
}

exports.Interval = Interval;

function Timeout(delay, callback) {
  setTimeout(callback, parseInt(delay));
}

exports.Timeout = Timeout;

function If(conditionId, callback) {
  if (!this.referenceMap.has(conditionId)) {
    new EBuilderError_1["default"]("Condition id not found. Make sure to provide the corresponding pair [Function: boolean, conditionId: string] as an argument of the .given() method before using an @if rule ", conditionId);
  } else if (this.referenceMap.get(conditionId)()) {
    callback();
  }
}

exports.If = If;

function For(conditionId, callback) {
  var array = this.getRef(conditionId);
  console.log(array, conditionId);
  array.forEach(function (v, i, a) {
    // TODO: find a way to get the (function) value of an entry with @for rule
    // const realValue = entryValue.bind.call(this, v, i a)
    console.log(callback);
    callback();
  });
}

exports.For = For;