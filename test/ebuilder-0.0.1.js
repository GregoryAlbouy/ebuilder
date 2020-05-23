var EBuilder =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ./modules/EBuilder */ "./src/modules/EBuilder.ts").default;


/***/ }),

/***/ "./src/modules/EBuilder.ts":
/*!*********************************!*\
  !*** ./src/modules/EBuilder.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const EBuilderAnimation_1 = __webpack_require__(/*! ./EBuilderAnimation */ "./src/modules/EBuilderAnimation.ts");
const EBuilderError_1 = __webpack_require__(/*! ./EBuilderError */ "./src/modules/EBuilderError.ts");
const Check = __webpack_require__(/*! ../utils/Check */ "./src/utils/Check.ts");
const DOM = __webpack_require__(/*! ../utils/DOM */ "./src/utils/DOM.ts");
const Parse = __webpack_require__(/*! ../utils/Parse */ "./src/utils/Parse.ts");
const Setter = __webpack_require__(/*! ../utils/Setter */ "./src/utils/Setter.ts");
const EBuilder = function (source) {
    if (!Check.isValidSource(source)) {
        new EBuilderError_1.default('Invalid source input', source);
        return;
    }
    const element = Setter.element(source);
    const referenceMap = new Map([['window', window]]);
    return {
        el: element,
        element: element,
        getHTML: function () { return this.element.innerHTML; },
        isEBuilder: true,
        referenceMap: referenceMap,
        getRef: function (query) {
            return this.referenceMap.get(query) || (new EBuilderError_1.default('nul!', query), false);
        },
        given: function (...references) {
            const register = (ref) => {
                if (Check.isArray(ref)) {
                    const [target, id] = ref; // come back here later
                    this.referenceMap.set(id, target);
                }
                else if (Check.isNamedFunction(ref)) {
                    this.referenceMap.set(ref.name, ref);
                }
                else
                    new EBuilderError_1.default('Invalid given() argument input', ref);
            };
            references.forEach(register);
            return this;
        },
        into: function (targetInput, { at = -1, times = 1 } = {}) {
            if (!Check.isValidTarget(targetInput))
                return;
            const getTarget = (target) => {
                return Check.isEBObject(target)
                    ? target.element
                    : target;
            };
            const insertAt = (element, target, n) => {
                if (!Check.isNumber(n))
                    return;
                const getPos = (n, length) => {
                    return n < 0
                        ? Math.max(length - 1 + n, 0)
                        : Math.min(length - 1, n);
                };
                const childList = target.children;
                const p = getPos(n, childList.length);
                if (childList.length === 0 || childList.length - 1 === p)
                    target.appendChild(element);
                else
                    childList[p].insertAdjacentElement('beforebegin', element);
            };
            const target = getTarget(targetInput);
            const p = Math.floor(Number(at));
            Number.isNaN(p) ? target.appendChild(element) : insertAt(element, target, p);
            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'));
            return this;
        },
        after: function (inputTarget) {
            const target = Parse.getTrueElement(inputTarget);
            target.insertAdjacentElement('afterend', element);
            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'));
            return this;
        },
        before: function (inputTarget) {
            const target = Parse.getTrueElement(inputTarget);
            target.insertAdjacentElement('beforebegin', element);
            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'));
            return this;
        },
        replace: function (inputTarget) {
            var _a;
            const target = Parse.getTrueElement(inputTarget);
            (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(element, target);
            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'));
            return this;
        },
        swap: async function (swapped, animate) {
            if (!Check.isValidSwap(element, swapped))
                return;
            if (animate) {
                const ms = typeof animate === 'object' && animate.animationDuration
                    ? animate.animationDuration
                    : undefined;
                await new EBuilderAnimation_1.default(ms).swap2(element, swapped);
            }
            const dummy = document.createElement('div');
            element.parentNode.replaceChild(dummy, element);
            swapped.parentNode.replaceChild(element, swapped);
            dummy.parentNode.replaceChild(swapped, dummy);
            return this;
        },
        out: function () {
            var _a;
            (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
        },
        dispatch: function (nameInput, emitterInput) {
            const emitter = !emitterInput
                ? this.element
                : 'isEBuilder' in emitterInput
                    ? emitterInput.element
                    : emitterInput;
            emitter.dispatchEvent(new CustomEvent(nameInput));
            console.log(emitter, nameInput);
            return this;
        },
        set: function (options = {}) {
            const Options = {
                properties: Setter.Properties,
                attributes: Setter.Attributes,
                listeners: Setter.Listeners,
                children: Setter.Children,
                style: Setter.Style
            };
            const setOption = (name, value) => {
                if (!(name in Options))
                    return;
                Options[name].call(this, value);
            };
            Setter.process.call(this, options, setOption);
            this.element.dispatchEvent(new CustomEvent('ebuilderset'));
            return this;
        },
        setAttributes: function (attributes) {
            Setter.Attributes.call(this, attributes);
            return this;
        },
        setProperties: function (properties) {
            Setter.Properties.call(this, properties);
            return this;
        },
        setListeners: function (listeners) {
            Setter.Listeners.call(this, listeners);
            return this;
        },
        setChildren: function (children) {
            Setter.Children.call(this, children);
            return this;
        },
        setStyle: function (style) {
            // const value = Parse.getComputedValue.call(this, style)
            Setter.Style.call(this, style);
            return this;
        },
        setClasses: function (...classes) {
            element.classList.add(...[].concat(...classes));
            return this;
        },
        setContent: function (input, at) {
            DOM.insert(input, element, at);
            return this;
        },
        toString: function () {
            return element.outerHTML;
        },
        count: function () {
            return this.element.childNodes.length;
        }
    };
};
exports.default = EBuilder;


/***/ }),

/***/ "./src/modules/EBuilderAnimation.ts":
/*!******************************************!*\
  !*** ./src/modules/EBuilderAnimation.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const EBuilderError_1 = __webpack_require__(/*! ./EBuilderError */ "./src/modules/EBuilderError.ts");
class EBuilderAnimation {
    constructor(duration) {
        this.duration = 200;
        this.then = {
            then: (resolve) => setTimeout(resolve, this.duration)
        };
        if (duration && duration < 0)
            throw new EBuilderError_1.default('Invalid animation duration', name);
        else
            this.duration = duration || this.duration;
    }
    /*
     * Using css transitions
     */
    swap(a, b) {
        const offset = {
            h: b.getBoundingClientRect().left - a.getBoundingClientRect().left,
            v: b.getBoundingClientRect().top - a.getBoundingClientRect().top
        };
        [a, b].map((elt) => elt.style.transition = `transform ${this.duration}ms`);
        a.style.transform = `translate(${offset.h}px, ${offset.v}px)`;
        b.style.transform = `translate(${-offset.h}px, ${-offset.v}px)`;
        setTimeout(() => {
            [a, b].forEach((elt) => {
                elt.style.transform = '';
                elt.style.transition = '';
            });
        }, this.duration);
    }
    swap2(a, b) {
        const dist = {
            x: b.getBoundingClientRect().left - a.getBoundingClientRect().left,
            y: b.getBoundingClientRect().top - a.getBoundingClientRect().top
        };
        const vOffsetMax = a.getBoundingClientRect().height / 2;
        const step = (timestamp) => {
            progress = (timestamp - start) / this.duration;
            if (progress > 1)
                progress = 1;
            dy = progress <= .5 ? vOffsetMax * progress * 2 : vOffsetMax * (1 - progress) * 2;
            a.style.transform = `translate(${dist.x * progress}px, ${dist.y * progress + dy}px)`;
            b.style.transform = `translate(${-dist.x * progress}px, ${-dist.y * progress - dy}px)`;
            progress < 1 ? requestAnimationFrame(step) : end();
        };
        const end = () => {
            [a, b].forEach((elt) => elt.style.transform = '');
        };
        let dy = 0, progress = 0, start = performance.now();
        requestAnimationFrame(step);
        return this.then;
    }
}
exports.default = EBuilderAnimation;


/***/ }),

/***/ "./src/modules/EBuilderError.ts":
/*!**************************************!*\
  !*** ./src/modules/EBuilderError.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class EBuilderError extends Error {
    constructor(message, suspect) {
        super(message);
        this.name = 'EBuilderError';
        this.suspect = suspect;
        console.warn(`${this.name}: ${this.message}:\n`, this.suspect, '\n');
    }
}
exports.default = EBuilderError;


/***/ }),

/***/ "./src/modules/Rule.ts":
/*!*****************************!*\
  !*** ./src/modules/Rule.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.For = exports.If = exports.Timeout = exports.Interval = exports.Once = exports.On = exports.RuleMap = void 0;
const EBuilderError_1 = __webpack_require__(/*! ./EBuilderError */ "./src/modules/EBuilderError.ts");
const Parse = __webpack_require__(/*! ../utils/Parse */ "./src/utils/Parse.ts");
exports.RuleMap = {
    on: On,
    once: Once,
    interval: Interval,
    timeout: Timeout,
    if: If,
    for: For
};
function handleEvent(eventInput, callback, isOnce) {
    const [type, emitter] = Parse.eventInput.call(this, eventInput);
    const once = () => {
        emitter.removeEventListener(type, once);
        callback();
    };
    const handler = isOnce ? once : callback;
    if ('addEventListener' in emitter)
        emitter.addEventListener(type, handler);
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
        new EBuilderError_1.default(`Condition id not found. Make sure to provide the corresponding pair [Function: boolean, conditionId: string] as an argument of the .given() method before using an @if rule `, conditionId);
    }
    else if (this.referenceMap.get(conditionId)()) {
        callback();
    }
}
exports.If = If;
function For(conditionId, callback) {
    const array = this.getRef(conditionId);
    console.log(array, conditionId);
    array.forEach((v, i, a) => {
        // TODO: find a way to get the (function) value of an entry with @for rule
        // const realValue = entryValue.bind.call(this, v, i a)
        console.log(callback);
        callback();
    });
}
exports.For = For;


/***/ }),

/***/ "./src/utils/Check.ts":
/*!****************************!*\
  !*** ./src/utils/Check.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Type checks */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNamedFunction = exports.hasName = exports.isValidTarget = exports.isValidSwap = exports.isValidSource = exports.isValidChild = exports.isEBObject = exports.isElement = exports.isEventTupleArray = exports.isEventTuple = exports.isStringObject = exports.isArrayArray = exports.isArray = exports.isFunction = exports.isString = exports.isNumber = exports.isTypeOf = exports.typeOf = void 0;
exports.typeOf = (input) => {
    return `${{}.toString.call(input)}`
        .replace(/^\[object ([a-z]+)\]$/i, '$1')
        .toLowerCase();
};
exports.isTypeOf = (input, ...types) => {
    return types
        .map((type) => exports.typeOf(input) === type.toLocaleLowerCase())
        .reduce((a, c) => a || c);
};
exports.isNumber = (input) => {
    return exports.isTypeOf(input, 'number');
};
exports.isString = (input) => {
    return exports.isTypeOf(input, 'string');
};
exports.isFunction = (input) => {
    return exports.isTypeOf(input, 'function');
};
exports.isArray = (input) => {
    return exports.isTypeOf(input, 'array');
};
exports.isArrayArray = (input) => {
    return (exports.isTypeOf(input, 'array')
        && input.every((item) => exports.isTypeOf(item, 'array')));
};
exports.isStringObject = (input) => {
    return (exports.isTypeOf(input, 'object')
        && Object.keys(input).every((item) => exports.isTypeOf(item, 'string')));
};
exports.isEventTuple = (input) => {
    return (exports.isTypeOf(input, 'array')
        && exports.isTypeOf(input[0], 'string')
        && exports.isTypeOf(input[1], 'function')
        && (!input[2] || exports.isTypeOf(input[2], 'boolean', 'object')));
};
exports.isEventTupleArray = (input) => {
    return (exports.isTypeOf(input, 'array')
        && input.every(exports.isEventTuple));
};
exports.isElement = (input) => {
    return input instanceof Element;
};
exports.isEBObject = (input) => {
    return (input instanceof Object
        && input.isEBuilder);
};
exports.isValidChild = (input) => {
    return (exports.isTypeOf(input, 'string', 'number')
        || input instanceof Node
        || input.isEBuilder);
};
exports.isValidSource = (source) => {
    return (source instanceof Element || exports.isTypeOf(source, 'string'));
};
exports.isValidSwap = (element, swapped) => {
    return (element instanceof HTMLElement && swapped instanceof HTMLElement
        && (!!element.parentNode && !!swapped.parentNode)
        && element !== swapped);
};
exports.isValidTarget = (target) => {
    return exports.isEBObject(target) || target instanceof Element;
};
exports.hasName = (input) => {
    return !!input.name;
};
exports.isNamedFunction = (input) => {
    return exports.isFunction(input) && exports.hasName(input);
};


/***/ }),

/***/ "./src/utils/DOM.ts":
/*!**************************!*\
  !*** ./src/utils/DOM.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = void 0;
const Check = __webpack_require__(/*! ./Check */ "./src/utils/Check.ts");
/**
 * In progress
 */
function insert(input, target, at) {
    const posFromString = (at, childList) => {
        const posMap = {
            start: 0,
            middle: Math.floor(childList.length / 2),
            end: childList.length - 1
        };
        return at in posMap ? posMap[at] : posMap.end;
    };
    const safePos = (n, length) => {
        return n < 0
            ? Math.max(length - 1 + n, 0)
            : Math.min(length - 1, n);
    };
    const childList = target.children;
    const n = Check.isString(at) ? posFromString(at, childList) : Math.floor(at);
    const p = safePos(n, childList.length);
    if (childList.length === 0 || childList.length - 1 === p)
        target.appendChild(input);
    else
        childList[p].insertAdjacentElement('beforebegin', input);
}
exports.insert = insert;


/***/ }),

/***/ "./src/utils/Parse.ts":
/*!****************************!*\
  !*** ./src/utils/Parse.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.inputObject = exports.getComputedValue2 = exports.getComputedValue = exports.getTrueElement = exports.eventInput = exports.elementStringSource = void 0;
const Check = __webpack_require__(/*! ./Check */ "./src/utils/Check.ts");
function elementStringSource(source) {
    const Rrule = /^@(\w+):/;
    const Rvalue = /:(.+)?/;
    const ruleMatch = source.match(Rrule);
    const valueMatch = source.match(Rvalue);
    const safeMatch = (match) => match ? match[1] : '';
    return {
        rule: safeMatch(ruleMatch),
        value: safeMatch(valueMatch)
    };
}
exports.elementStringSource = elementStringSource;
function eventInput(eventInput) {
    const elementFrom = (getRefResult) => {
        return 'isEBuilder' in getRefResult ? getRefResult.element : getRefResult;
    };
    const [type, targetInput] = eventInput.split('#');
    const target = targetInput ? elementFrom(this.getRef(targetInput)) : this.element;
    return [type, target];
}
exports.eventInput = eventInput;
function getTrueElement(input) {
    return Check.isEBObject(input) ? input.element : input;
}
exports.getTrueElement = getTrueElement;
function getComputedValue(value) {
    return Check.isFunction(value) ? value.call(this) : value;
}
exports.getComputedValue = getComputedValue;
function getComputedValue2(value, boundData) {
    return Check.isFunction(value) ? value.call(this, boundData) : value;
}
exports.getComputedValue2 = getComputedValue2;
exports.inputObject = (source) => {
    // 'properties@once:click@interval:1000' => ['properties', 'once:click', 'interval:1000']
    const parseSourceKey = (sourceKey) => sourceKey.split('@');
    // 'once:click' => ['once', 'click']
    const parseRawRule = (rawRule) => rawRule.split(':');
    const parseEntries = (source) => {
        return Object.keys(source).map((sourceKey) => {
            // trueKey = 'properties', rawRules = ['once:click', 'interval:1000']
            const [trueKey, ...rawRules] = parseSourceKey(sourceKey);
            const ruleMap = new Map(rawRules.map(parseRawRule));
            return {
                key: trueKey,
                value: source[sourceKey],
                rules: ruleMap
            };
        });
    };
    const getObjectFromEntries = (processedEntries) => {
        const object = Object.create(null);
        processedEntries.forEach((entry) => {
            Object.defineProperty(object, entry.key, {
                enumerable: true,
                value: {
                    value: entry.value,
                    rules: entry.rules,
                    hasRules: function () { return !!this.rules.size; }
                }
            });
        });
        return object;
    };
    // [{ key: 'attributes', value: {...}, rules: [] }, ...], 
    const processedEntries = parseEntries(source);
    const finalObject = getObjectFromEntries(processedEntries);
    // const finalMap = createMapFromProcessedEntries(processedEntries)
    return finalObject;
};


/***/ }),

/***/ "./src/utils/Setter.ts":
/*!*****************************!*\
  !*** ./src/utils/Setter.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAt = exports.process = exports.Children = exports.Listeners = exports.Style = exports.Attributes = exports.Properties = exports.element = void 0;
const EBuilderError_1 = __webpack_require__(/*! ../modules/EBuilderError */ "./src/modules/EBuilderError.ts");
const Check = __webpack_require__(/*! ./Check */ "./src/utils/Check.ts");
const Parse = __webpack_require__(/*! ./Parse */ "./src/utils/Parse.ts");
const Rule = __webpack_require__(/*! ../modules/Rule */ "./src/modules/Rule.ts");
/**
 * Determinate the source element to work on depending on the input:
 * element => element
 * 'div' or '@element:div' => div element
 * '<div>hello</div> or '@html:<div>hello</div> => element built upon html
 * '@select:div.mydiv' => document.querySelector('div.mydiv')
 */
function element(source) {
    const hasRule = (input) => input.charAt(0) === '@';
    const inputType = (input) => /^<.*>$/.test(input) ? 'html' : 'element';
    const getElementFromHTML = (html) => {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstElementChild;
    };
    const ruleMap = {
        'html': (value) => getElementFromHTML(value),
        'select': (value) => document.querySelector(value),
        'element': (value) => document.createElement(value)
    };
    if (Check.isElement(source))
        return source;
    if (Check.isEBObject(source))
        return source.element;
    source = `${source}`;
    if (hasRule(source)) {
        const { rule, value } = Parse.elementStringSource(source);
        if (!value)
            new EBuilderError_1.default('Invalid ElBuilder source input', source);
        const safeRule = rule !== null && rule !== void 0 ? rule : 'element';
        return ruleMap[safeRule](value);
    }
    return ruleMap[inputType(source)](source);
}
exports.element = element;
function Properties(properties = {}) {
    const setProperty = (name, value) => {
        this.element[name] = value;
    };
    process.call(this, properties, setProperty);
}
exports.Properties = Properties;
function Attributes(attributes = {}) {
    const addAttribute = (name, value) => {
        if (this.element instanceof Element) {
            this.element.setAttribute(name, value);
        }
    };
    process.call(this, attributes, addAttribute);
}
exports.Attributes = Attributes;
function Style(style = {}) {
    const setStyle = (name, value) => {
        if (this.element instanceof HTMLElement) {
            this.element.style[name] = value;
        }
    };
    process.call(this, style, setStyle);
}
exports.Style = Style;
function Listeners(listeners) {
    const addListener = ([event, listener, options]) => {
        this.element.addEventListener(event, listener, options);
    };
    if (Check.isEventTuple(listeners))
        addListener(listeners);
    else if (Check.isEventTupleArray(listeners))
        (listeners).forEach(addListener);
    else
        new EBuilderError_1.default('Invalid input for listeners input ([string, Function] or [string, Function][] expected)', listeners);
}
exports.Listeners = Listeners;
function Children(children) {
    const addChild = (child) => {
        if (!Check.isValidChild(child)) {
            new EBuilderError_1.default('Invalid child (Node, string, number or EBuilder instance expected)', child);
            return;
        }
        if (child instanceof Node) {
            this.element.appendChild(child);
        }
        else if (Check.isTypeOf(child, 'string', 'number')) {
            this.element.innerHTML += `${child}`;
        }
        else if (Check.isEBObject(child)) {
            this.element.appendChild((child).element);
        }
        else
            new EBuilderError_1.default(`Invalid input in children array`, child);
    };
    const childrenValue = Parse.getComputedValue.call(this, children);
    Check.isValidChild(childrenValue)
        ? addChild(childrenValue)
        : Check.isTypeOf(childrenValue, 'array')
            ? (childrenValue).forEach(addChild)
            : new EBuilderError_1.default(`Invalid input for children value`, childrenValue);
}
exports.Children = Children;
function process(source, callback, keyRestriction) {
    const parsedObject = Parse.inputObject(source);
    const processEntry = (key) => {
        if (keyRestriction && !(key in keyRestriction))
            return;
        const currentEntry = parsedObject[key];
        const { value, rules } = currentEntry;
        /**
         * Possible entry point for calling additionnal parameters for, e.g., @-for rule
         */
        const computedValue = () => Parse.getComputedValue.call(this, value);
        const computedValue2 = (boundData) => Parse.getComputedValue2.call(this, value, boundData);
        const setEntry = () => callback(key, computedValue());
        currentEntry.hasRules() ? submitToRules(rules, setEntry) : setEntry();
    };
    const submitToRules = (rules, callback) => {
        let ruleApplied = false;
        const applyRule = (ruleValue, ruleName) => {
            const ruleKey = ruleName.toLowerCase();
            if (ruleKey in Rule.RuleMap) {
                Rule.RuleMap[ruleKey].call(this, ruleValue, callback);
                ruleApplied = true;
            }
        };
        rules.forEach(applyRule);
        if (!ruleApplied)
            callback();
    };
    Object.keys(parsedObject).forEach(processEntry);
}
exports.process = process;
function insertAt(element, target, n) {
    if (!Check.isNumber(n))
        return;
    const getPos = (n, length) => {
        return n < 0
            ? Math.max(length - 1 + n, 0)
            : Math.min(length - 1, n);
    };
    const childList = target.children;
    const p = getPos(n, childList.length);
    if (childList.length === 0 || childList.length - 1 === p)
        target.appendChild(element);
    else
        childList[p].insertAdjacentElement('beforebegin', element);
}
exports.insertAt = insertAt;


/***/ })

/******/ });
//# sourceMappingURL=ebuilder-0.0.1.js.map