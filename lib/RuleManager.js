"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.If = exports.Timeout = exports.Interval = exports.Once = exports.On = exports.processSourceObject = exports.getComputedValue = exports.applyRules = exports.assignWithSetter = void 0; //@ts-nocheck

var check = require("./utils/checkers");

var ElementBuilderError_1 = require("./ElementBuilderError");

var RuleMap = {
  on: On,
  once: Once,
  interval: Interval,
  timeout: Timeout,
  "if": If
}; // export const assignWithSetter = (source: AnyObject, callback: SetterCallback) => {
// }

function assignWithSetter(source, callback) {
  var _this = this;

  var parsedObject = exports.processSourceObject(source);

  if (callback.name === 'setStyle') {
    console.log(parsedObject);
  }

  Object.keys(parsedObject).forEach(function (key) {
    var _parsedObject$key = parsedObject[key],
        value = _parsedObject$key.value,
        rules = _parsedObject$key.rules;

    var computedValue = function computedValue() {
      return exports.getComputedValue.call(_this, value);
    };

    var setEntry = function setEntry() {
      return callback(key, computedValue());
    };

    applyRules.call(_this, rules, setEntry);
  });
}

exports.assignWithSetter = assignWithSetter;

function applyRules(rules, callback) {
  var _this2 = this;

  var ruleApplied = false;
  rules.forEach(function (ruleValue, ruleName) {
    var ruleKey = ruleName.toLowerCase();

    if (ruleKey in RuleMap) {
      RuleMap[ruleKey].call(_this2, ruleValue, callback);
      ruleApplied = true;
    }
  });
  if (!ruleApplied) callback();
}

exports.applyRules = applyRules;

exports.getComputedValue = function (value) {
  return check.isTypeOf(value, 'function') ? value.call(this) : value;
};

exports.processSourceObject = function (source) {
  // 'properties@once:click@interval:1000' => ['properties', 'once:click', 'interval:1000']
  var parseSourceKey = function parseSourceKey(sourceKey) {
    return sourceKey.split('@');
  }; // 'once:click' => ['once', 'click']


  var parseRawRule = function parseRawRule(rawRule) {
    return rawRule.split(':');
  };

  var getProcessedEntriesFromSource = function getProcessedEntriesFromSource(source) {
    return Object.keys(source).map(function (sourceKey) {
      // trueKey = 'properties', rawRules = ['once:click', 'interval:1000']
      var _parseSourceKey = parseSourceKey(sourceKey),
          _parseSourceKey2 = (0, _toArray2["default"])(_parseSourceKey),
          trueKey = _parseSourceKey2[0],
          rawRules = _parseSourceKey2.slice(1);

      var ruleMap = new Map(rawRules.map(parseRawRule));
      return {
        key: trueKey,
        value: source[sourceKey],
        rules: ruleMap
      };
    });
  };

  var getObjectFromEntries = function getObjectFromEntries(processedEntries) {
    var object = Object.create(null);
    processedEntries.forEach(function (entry) {
      Object.defineProperty(object, entry.key, {
        enumerable: true,
        value: {
          value: entry.value,
          rules: entry.rules
        }
      });
    });
    return object;
  }; // const createMapFromProcessedEntries = (processedEntries: ProcessedEntry[]) => {
  //     return new Map(processedEntries.map((entry) => {
  //         return [entry.key, { value: entry.value, rules: entry.rules }]
  //     }))
  // }
  // [{ key: 'attributes', value: {...}, rules: [] }, ...], 


  var processedEntries = getProcessedEntriesFromSource(source);
  var finalObject = getObjectFromEntries(processedEntries); // const finalMap = createMapFromProcessedEntries(processedEntries)

  return finalObject;
}; // const processedSource = processSourceObject(options)
// processSourceObject(options)
// class EBRule


function On(eventName, callback) {
  window.addEventListener(eventName, function () {
    return callback();
  });
}

exports.On = On;

function Once(eventName, callback) {
  var listener = function listener() {
    window.removeEventListener(eventName, listener);
    callback();
  };

  window.addEventListener(eventName, listener);
}

exports.Once = Once;

function Interval(rate, callback) {
  setInterval(callback, parseInt(rate));
}

exports.Interval = Interval;

function Timeout(delay, callback) {
  setTimeout(callback, parseInt(delay));
}

exports.Timeout = Timeout;

function If(conditionId, callback) {
  if (!this.referenceMap.has(conditionId)) {
    new ElementBuilderError_1["default"]("Condition id not found. Make sure to provide the corresponding pair [Function: boolean, conditionId: string] as an argument of the .given() method before using an @if rule ", conditionId);
  } else {
    if (this.referenceMap.get(conditionId)()) {
      callback();
    }
  }

  console.log(this);
}

exports.If = If;