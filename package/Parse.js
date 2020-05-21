"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceObject = exports.getComputedValue = exports.eventInput = exports.elementStringSource = void 0;

var Check = require("./Check");

function elementStringSource(source) {
  var Rrule = /^@(\w+):/;
  var Rvalue = /:(.+)?/;
  var ruleMatch = source.match(Rrule);
  var valueMatch = source.match(Rvalue);

  var safeMatch = function safeMatch(match) {
    return match ? match[1] : '';
  };

  return {
    rule: safeMatch(ruleMatch),
    value: safeMatch(valueMatch)
  };
}

exports.elementStringSource = elementStringSource;

function eventInput(eventInput) {
  var elementFrom = function elementFrom(getRefResult) {
    return 'isEBuilder' in getRefResult ? getRefResult.element : getRefResult;
  };

  var _eventInput$split = eventInput.split('#'),
      _eventInput$split2 = (0, _slicedToArray2["default"])(_eventInput$split, 2),
      type = _eventInput$split2[0],
      targetInput = _eventInput$split2[1];

  var target = targetInput ? elementFrom(this.getRef(targetInput)) : this.element;
  return [type, target];
}

exports.eventInput = eventInput;

function getComputedValue(value) {
  return Check.isFunction(value) ? value.call(this) : value;
}

exports.getComputedValue = getComputedValue;

exports.sourceObject = function (source) {
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
          rules: entry.rules,
          hasRules: function hasRules() {
            return !!this.rules.size;
          }
        }
      });
    });
    return object;
  }; // [{ key: 'attributes', value: {...}, rules: [] }, ...], 


  var processedEntries = getProcessedEntriesFromSource(source);
  var finalObject = getObjectFromEntries(processedEntries); // const finalMap = createMapFromProcessedEntries(processedEntries)

  return finalObject;
};