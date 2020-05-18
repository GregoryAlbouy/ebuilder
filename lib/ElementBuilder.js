"use strict";
/**
 * Helper function that allows to fully create and set an element
 * (attributes, class, listeners...) and append it anywhere with a single
 * declaration, thanks to its chaining ability.
 *
 * More on github : https://github.com/gregoryalbouy/element-builder
 *
 * TODO: use class instead and use parameter decorators for checks
 * TODO: add .into(xxx, { at: 3 })
 * TODO: add execution order/priority manager in .set(), e.g:
 * ElementBuilder('a').set({})
 */

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElementBuilderAnimation_1 = require("./ElementBuilderAnimation");

var ElementBuilderError_1 = require("./ElementBuilderError");

var RuleManager = require("./RuleManager");

var check = require("./utils/checkers");

var _set = require("./utils/setters");

function ElementBuilder(source) {
  if (!check.isValidSource(source)) {
    new ElementBuilderError_1["default"]('Invalid source input (string or Element expected)', source);
    return;
  }

  var element = _set.sourceElement(source);

  var referenceMap = new Map();
  return {
    element: element,
    html: element ? element.outerHTML : undefined,
    isElementBuilder: true,
    referenceMap: referenceMap,
    given: function given() {
      var _this = this;

      for (var _len = arguments.length, references = new Array(_len), _key = 0; _key < _len; _key++) {
        references[_key] = arguments[_key];
      }

      references.forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
            target = _ref2[0],
            id = _ref2[1];

        _this.referenceMap.set(id, target);
      });
      return this;
    },
    into: function into(node) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$times = _ref3.times,
          times = _ref3$times === void 0 ? 1 : _ref3$times;

      if (!check.isTypeOf(times, 'number') || times < 1) {
        new ElementBuilderError_1["default"]('Invalid times value (whole number >= 1 expected)', times);
      } else if (times === 1) {
        node.appendChild(element);
      } else {
        console.log(times);

        var clone = function clone() {
          return element.cloneNode(true);
        };

        (0, _toConsumableArray2["default"])(Array(Math.floor(times))).forEach(function () {
          return node.appendChild(clone());
        });
      }

      window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    after: function after(node) {
      node.insertAdjacentElement('afterend', element);
      window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    before: function before(node) {
      node.insertAdjacentElement('beforebegin', element);
      window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    replace: function replace(node) {
      var _a;

      (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(element, node);
      window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
      return this;
    },
    dispatch: function dispatch(eventName) {
      window.dispatchEvent(new CustomEvent(eventName));
      return this;
    },
    set: function set() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var processed = RuleManager.processSourceObject(options);
      var Options = {
        properties: function properties(value) {
          return _set.Properties.call(_this2, value);
        },
        attributes: function attributes(value) {
          return _set.Attributes.call(_this2, value);
        },
        listeners: function listeners(value) {
          return _set.Listeners.call(_this2, value);
        },
        children: function children(value) {
          return _set.Children.call(_this2, value);
        }
      };
      Object.keys(processed).forEach(function (optionKey) {
        if (!(optionKey in Options)) return;
        var setter = Options[optionKey];
        var _processed$optionKey = processed[optionKey],
            value = _processed$optionKey.value,
            rules = _processed$optionKey.rules;

        var computedValue = function computedValue() {
          return RuleManager.getComputedValue.call(_this2, value);
        };

        var setEntry = function setEntry() {
          return setter(computedValue());
        };

        RuleManager.applyRules.call(_this2, rules, setEntry);
      });
      window.dispatchEvent(new CustomEvent('ElementBuilderSet'));
      return this;
    },
    setAttributes: function setAttributes(attributes) {
      _set.Attributes.call(this, attributes);

      return this;
    },
    setProperties: function setProperties(properties) {
      _set.Properties.call(this, properties);

      return this;
    },
    setListeners: function setListeners(listeners) {
      _set.Listeners.call(this, listeners);

      return this;
    },
    setChildren: function setChildren(children) {
      _set.Children.call(this, children);

      return this;
    },
    setStyles: function setStyles(styles) {
      _set.Styles.call(this, styles);

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
      var _element$classList, _ref4;

      (_element$classList = element.classList).add.apply(_element$classList, (0, _toConsumableArray2["default"])((_ref4 = []).concat.apply(_ref4, arguments)));

      return this;
    },
    swap: function () {
      var _swap = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(swapped, animate) {
        var elementsAreValid, ms, dummy;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                elementsAreValid = function elementsAreValid() {
                  return element instanceof HTMLElement && swapped instanceof HTMLElement && !!element.parentNode && !!swapped.parentNode && element !== swapped;
                };

                if (elementsAreValid()) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                if (!animate) {
                  _context.next = 7;
                  break;
                }

                ms = (0, _typeof2["default"])(animate) === 'object' && animate.animationDuration ? animate.animationDuration : undefined;
                _context.next = 7;
                return new ElementBuilderAnimation_1["default"](ms).swap2(element, swapped);

              case 7:
                dummy = document.createElement('div');
                element.parentNode.replaceChild(dummy, element);
                swapped.parentNode.replaceChild(element, swapped);
                dummy.parentNode.replaceChild(swapped, dummy);
                return _context.abrupt("return", this);

              case 12:
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
    setStyle: function setStyle() {
      var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (element instanceof HTMLElement) {
        Object.assign(element.style, styles);
      }

      return this;
    },
    toString: function toString() {
      return element.outerHTML;
    }
  };
};

module.exports = ElementBuilder; // console.log(
//     ElementBuilder('div')!.given(
//         [{ one: '1', two: 2 }, 'myObject'],
//         [(n: number) => 2*n, 'myFunction'],
//         [[1, 4, 'youpi'], 'myArray']
//     )
//     .into(document.body)
// )