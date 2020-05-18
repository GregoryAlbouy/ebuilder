"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Children = exports.Listeners = exports.Styles = exports.Attributes = exports.Properties = exports.sourceElement = void 0;

var check = require("./checkers");

var RuleManager = require("../RuleManager");

var ElementBuilderError_1 = require("../ElementBuilderError");

function sourceElement(source) {
  return check.isTypeOf(source, 'string') ? document.createElement(source) : source;
}

exports.sourceElement = sourceElement;

function Properties() {
  var _this = this;

  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var setProperty = function setProperty(name, value) {
    _this.element[name] = value;
  };

  RuleManager.assignWithSetter.call(this, properties, setProperty);
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

  RuleManager.assignWithSetter.call(this, attributes, addAttribute);
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

  RuleManager.assignWithSetter.call(this, styles, setStyle);
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

  if (check.isEventTuple(listeners)) addListener(listeners);else if (check.isEventTupleArray(listeners)) listeners.forEach(addListener);else new ElementBuilderError_1["default"]('Invalid input for listeners input ([string, Function] or [string, Function][] expected)', listeners);
}

exports.Listeners = Listeners;

function Children(children) {
  var _this5 = this;

  var addChild = function addChild(child) {
    if (!check.isValidChild(child)) {
      new ElementBuilderError_1["default"]('Invalid child (Node, string, number or ElementBuilder instance expected)', child);
      return;
    }

    if (child instanceof Node) {
      _this5.element.appendChild(child);
    } else if (check.isTypeOf(child, 'string', 'number')) {
      _this5.element.innerHTML += "".concat(child);
    } else if (child.isElementBuilder) {
      _this5.element.appendChild(child.element);
    } else new ElementBuilderError_1["default"]("Invalid input in children array", child);
  };

  check.isValidChild(children) ? addChild(children) : check.isTypeOf(children, 'array') ? children.forEach(addChild) : new ElementBuilderError_1["default"]("Invalid input for children value", children); // if (v.isValidChild(children)) addChild(children as ValidChild)
  // else if (v.isTypeOf(children, 'array')) (children as []).forEach(addChild)
  // else new ElementBuilderError(`Invalid input for children value`, children)
}

exports.Children = Children;