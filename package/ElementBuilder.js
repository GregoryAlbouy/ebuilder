"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElementBuilderAnimation_1 = require("./ElementBuilderAnimation");

var ElementBuilderError_1 = require("./ElementBuilderError");

var Check = require("./Check");

var Parse = require("./Parse");

var Setter = require("./Setter");

var ElementBuilder = function ElementBuilder(source) {
  if (!Check.isValidSource(source)) {
    new ElementBuilderError_1["default"]('Invalid source input', source);
    return;
  }

  var element = Setter.element(source);
  var referenceMap = new Map([['window', window]]);
  return {
    el: element,
    element: element,
    htmlContent: function htmlContent() {
      return this.element.innerHTML;
    },
    isElementBuilder: true,
    referenceMap: referenceMap,
    getRef: function getRef(query) {
      return this.referenceMap.get(query) || (new ElementBuilderError_1["default"]('nul!', query), false);
    },
    given: function given() {
      var _this = this;

      var register = function register(ref) {
        if (Check.isArray(ref)) {
          var _ref = (0, _slicedToArray2["default"])(ref, 2),
              target = _ref[0],
              id = _ref[1];

          _this.referenceMap.set(id, target);
        } else if (Check.isNamedFunction(ref)) {
          _this.referenceMap.set(ref.name, ref);
        } else new ElementBuilderError_1["default"]('Invalid given() argument input', ref);
      };

      for (var _len = arguments.length, references = new Array(_len), _key = 0; _key < _len; _key++) {
        references[_key] = arguments[_key];
      }

      references.forEach(register);
      return this;
    },
    into: function into(targetInput) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$at = _ref2.at,
          at = _ref2$at === void 0 ? -1 : _ref2$at,
          _ref2$times = _ref2.times,
          times = _ref2$times === void 0 ? 1 : _ref2$times;

      if (!Check.isValidTarget(targetInput)) return;

      var getTarget = function getTarget(target) {
        return Check.isElementBuilder(target) ? target.element : target;
      };

      var insertAt = function insertAt(element, target, n) {
        if (!Check.isNumber(n)) return;

        var getPos = function getPos(n, length) {
          return n < 0 ? Math.max(length - 1 + n, 0) : Math.min(length - 1, n);
        };

        var childList = target.children;
        var p = getPos(n, childList.length);
        if (childList.length === 0 || childList.length - 1 === p) target.appendChild(element);else childList[p].insertAdjacentElement('beforebegin', element);
      };

      var target = getTarget(targetInput);
      var p = Math.floor(Number(at));
      Number.isNaN(p) ? target.appendChild(element) : insertAt(element, target, p); // if (!Check.isNumber(times) || times < 1) {
      //     new ElementBuilderError('Invalid times value (whole number >= 1 expected)', times)
      // }
      // else if (times === 1) {
      //     target.appendChild(element)
      // }
      // /**
      //  * FIX: elements appended but settings not applied
      //  */
      // else {
      //     console.log(times)
      //     const clone = () => element.cloneNode(true)
      //     ;[...Array(Math.floor(times))].forEach(() => target.appendChild(clone()))
      // }

      this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    after: function after(node) {
      node.insertAdjacentElement('afterend', element);
      this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    before: function before(node) {
      node.insertAdjacentElement('beforebegin', element);
      this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    replace: function replace(node) {
      var _a;

      (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(element, node);
      this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    swap: function () {
      var _swap = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(swapped, animate) {
        var ms, dummy;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (Check.isValidSwap(element, swapped)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                if (!animate) {
                  _context.next = 6;
                  break;
                }

                ms = (0, _typeof2["default"])(animate) === 'object' && animate.animationDuration ? animate.animationDuration : undefined;
                _context.next = 6;
                return new ElementBuilderAnimation_1["default"](ms).swap2(element, swapped);

              case 6:
                dummy = document.createElement('div');
                element.parentNode.replaceChild(dummy, element);
                swapped.parentNode.replaceChild(element, swapped);
                dummy.parentNode.replaceChild(swapped, dummy);
                return _context.abrupt("return", this);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function swap(_x, _x2) {
        return _swap.apply(this, arguments);
      }

      return swap;
    }(),
    out: function out() {
      var _a;

      (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
    },
    dispatch: function dispatch(nameInput, emitterInput) {
      var emitter = !emitterInput ? this.element : 'isElementBuilder' in emitterInput ? emitterInput.element : emitterInput;
      emitter.dispatchEvent(new CustomEvent(nameInput));
      console.log(emitter, nameInput);
      return this;
    },
    set: function set() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var Options = {
        properties: Setter.Properties,
        attributes: Setter.Attributes,
        listeners: Setter.Listeners,
        children: Setter.Children
      };

      var setOption = function setOption(name, value) {
        if (!(name in Options)) return;
        Options[name].call(_this2, value);
      };

      Setter.process.call(this, options, setOption);
      this.element.dispatchEvent(new CustomEvent('elbuilderset'));
      return this;
    },
    setAttributes: function setAttributes(attributes) {
      Setter.Attributes.call(this, attributes);
      return this;
    },
    setProperties: function setProperties(properties) {
      Setter.Properties.call(this, properties);
      return this;
    },
    setListeners: function setListeners(listeners) {
      Setter.Listeners.call(this, listeners);
      return this;
    },
    setChildren: function setChildren(children) {
      Setter.Children.call(this, children);
      return this;
    },
    setStyles: function setStyles(styles) {
      var value = Parse.getComputedValue.call(this, styles);
      Setter.Styles.call(this, value);
      return this;
    },
    // todo: (classes: string | array | object)
    // object: { add, remove, toggle }
    // setClasses: (classes: string[] | string, ...args: string[]) => {
    //     typeOf(classes) === 'array' ? element.classList.add(...classes)
    //                                 : element.classList.add(classes)
    //     return this
    // },
    setClasses: function setClasses() {
      var _element$classList, _ref3;

      (_element$classList = element.classList).add.apply(_element$classList, (0, _toConsumableArray2["default"])((_ref3 = []).concat.apply(_ref3, arguments)));

      return this;
    },
    setStyle: function setStyle() {
      var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (element instanceof HTMLElement) {
        Object.assign(element.style, styles);
      }

      return this;
    },
    textContent: function textContent(input) {
      element.textContent = input;
      return this;
    },
    toString: function toString() {
      return element.outerHTML;
    },

    /**
     * TODO: add filter parameter
     */
    count: function count() {
      return this.element.childNodes.length;
    }
  };
};

exports["default"] = ElementBuilder;