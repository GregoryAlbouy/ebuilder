"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = exports.Children = exports.Listeners = exports.Styles = exports.Attributes = exports.Properties = exports.element = void 0;

var EBuilderError_1 = require("./EBuilderError");

var Check = require("./Check");

var Parse = require("./Parse");

var Rule = require("./Rule");

function element(source) {
  var hasRule = function hasRule(input) {
    return input.charAt(0) === '@';
  };

  var inputType = function inputType(input) {
    return /^<.*>$/.test(input) ? 'html' : 'element';
  };

  var getElementFromHTML = function getElementFromHTML(value) {
    var template = document.createElement('template');
    template.innerHTML = value;
    return template.content.firstElementChild;
  };

  var ruleMap = {
    'html': function html(value) {
      return getElementFromHTML(value);
    },
    'select': function select(value) {
      return document.querySelector(value);
    },
    'element': function element(value) {
      return document.createElement(value);
    }
  };
  if (source instanceof Element) return source;

  if (hasRule(source)) {
    var _Parse$elementStringS = Parse.elementStringSource(source),
        rule = _Parse$elementStringS.rule,
        value = _Parse$elementStringS.value;

    if (!value) new EBuilderError_1["default"]('Invalid ElBuilder source input', source);
    var safeRule = rule !== null && rule !== void 0 ? rule : 'element';
    return ruleMap[safeRule](value);
  }

  return ruleMap[inputType(source)](source);
}

exports.element = element;

function Properties() {
  var _this = this;

  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var setProperty = function setProperty(name, value) {
    _this.element[name] = value;
  };

  process.call(this, properties, setProperty);
}

exports.Properties = Properties;

function Attributes() {
  var _this2 = this;

  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var addAttribute = function addAttribute(name, value) {
    if (_this2.element instanceof Element) {
      _this2.element.setAttribute(name, value);
    }
  };

  process.call(this, attributes, addAttribute);
}

exports.Attributes = Attributes;

function Styles() {
  var _this3 = this;

  var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var setStyle = function setStyle(name, value) {
    if (_this3.element instanceof HTMLElement) {
      _this3.element.style[name] = value;
    }
  };

  process.call(this, styles, setStyle);
}

exports.Styles = Styles;

function Listeners(listeners) {
  var _this4 = this;

  var addListener = function addListener(_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 3),
        event = _ref2[0],
        listener = _ref2[1],
        options = _ref2[2];

    _this4.element.addEventListener(event, listener, options);
  };

  if (Check.isEventTuple(listeners)) addListener(listeners);else if (Check.isEventTupleArray(listeners)) listeners.forEach(addListener);else new EBuilderError_1["default"]('Invalid input for listeners input ([string, Function] or [string, Function][] expected)', listeners);
}

exports.Listeners = Listeners;

function Children(children) {
  var _this5 = this;

  var addChild = function addChild(child) {
    if (!Check.isValidChild(child)) {
      new EBuilderError_1["default"]('Invalid child (Node, string, number or EBuilder instance expected)', child);
      return;
    }

    if (child instanceof Node) {
      _this5.element.appendChild(child);
    } else if (Check.isTypeOf(child, 'string', 'number')) {
      _this5.element.innerHTML += "".concat(child);
    } else if (child.isEBuilder) {
      _this5.element.appendChild(child.element);
    } else new EBuilderError_1["default"]("Invalid input in children array", child);
  };

  var childrenValue = Parse.getComputedValue.call(this, children);
  Check.isValidChild(childrenValue) ? addChild(childrenValue) : Check.isTypeOf(childrenValue, 'array') ? childrenValue.forEach(addChild) : new EBuilderError_1["default"]("Invalid input for children value", childrenValue);
}

exports.Children = Children;

function process(source, callback, keyRestriction) {
  var _this6 = this;

  var parsedObject = Parse.sourceObject(source);

  var processEntry = function processEntry(key) {
    if (keyRestriction && !(key in keyRestriction)) return;
    var currentEntry = parsedObject[key];
    var value = currentEntry.value,
        rules = currentEntry.rules;
    /**
     * Possible entry point for calling additionnal parameters for, e.g., @-for rule
     */

    var computedValue = function computedValue() {
      return Parse.getComputedValue.call(_this6, value);
    };

    var setEntry = function setEntry() {
      return callback(key, computedValue());
    };

    currentEntry.hasRules() ? submitToRules(rules, setEntry) : setEntry();
  };

  var submitToRules = function submitToRules(rules, callback) {
    var ruleApplied = false;

    var applyRule = function applyRule(ruleValue, ruleName) {
      var ruleKey = ruleName.toLowerCase();

      if (ruleKey in Rule.RuleMap) {
        Rule.RuleMap[ruleKey].call(_this6, ruleValue, callback);
        ruleApplied = true;
      }
    };

    rules.forEach(applyRule);
    if (!ruleApplied) callback();
  };

  Object.keys(parsedObject).forEach(processEntry);
}

exports.process = process;