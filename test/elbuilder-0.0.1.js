var ElBuilder =
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

/***/ "./src/ElementBuilder.ts":
/*!*******************************!*\
  !*** ./src/ElementBuilder.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Helper function that allows to fully create and set an element
 * (attributes, class, listeners...) and append it anywhere with a single
 * declaration, thanks to its chaining ability.
 *
 * TODO: use class instead and use parameter decorators for checks
 * TODO: add .into(xxx, { at: 3 })
 * TODO: add execution order/priority manager in .set(), e.g:
 * ElementBuilder('a').set({})
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ElementBuilderAnimation_1 = __webpack_require__(/*! ./ElementBuilderAnimation */ "./src/ElementBuilderAnimation.ts");
const ElementBuilderError_1 = __webpack_require__(/*! ./ElementBuilderError */ "./src/ElementBuilderError.ts");
const RuleManager = __webpack_require__(/*! ./RuleManager */ "./src/RuleManager.ts");
const Check = __webpack_require__(/*! ./utils/Check */ "./src/utils/Check.ts");
const Setter = __webpack_require__(/*! ./utils/Setter */ "./src/utils/Setter.ts");
const ElementBuilder = function (source) {
    if (!Check.isValidSource(source)) {
        new ElementBuilderError_1.default('Invalid source input (string or Element expected)', source);
        return;
    }
    const element = Setter.sourceElement(source);
    const referenceMap = new Map();
    return {
        element: element,
        html: element ? element.outerHTML : undefined,
        isElementBuilder: true,
        referenceMap: referenceMap,
        given: function (...references) {
            references.forEach(([target, id]) => {
                this.referenceMap.set(id, target);
            });
            return this;
        },
        into: function (node, { times = 1 } = {}) {
            if (!Check.isTypeOf(times, 'number') || times < 1) {
                new ElementBuilderError_1.default('Invalid times value (whole number >= 1 expected)', times);
            }
            else if (times === 1) {
                node.appendChild(element);
            }
            /**
             * FIX: elements appended but settings not applied
             */
            else {
                console.log(times);
                const clone = () => element.cloneNode(true);
                [...Array(Math.floor(times))].forEach(() => node.appendChild(clone()));
            }
            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
            return this;
        },
        after: function (node) {
            node.insertAdjacentElement('afterend', element);
            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
            return this;
        },
        before: function (node) {
            node.insertAdjacentElement('beforebegin', element);
            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
            return this;
        },
        replace: function (node) {
            var _a;
            (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(element, node);
            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'));
            return this;
        },
        dispatch: function (eventName) {
            window.dispatchEvent(new CustomEvent(eventName));
            return this;
        },
        set: function (options = {}) {
            const processed = RuleManager.processSourceObject(options);
            const Options = {
                properties: (value) => Setter.Properties.call(this, value),
                attributes: (value) => Setter.Attributes.call(this, value),
                listeners: (value) => Setter.Listeners.call(this, value),
                children: (value) => Setter.Children.call(this, value)
            };
            const setterCallback = (name, value) => {
                if (!(name in Options))
                    return;
                Options[name](value);
            };
            RuleManager.assignWithSetter.call(this, options, setterCallback);
            window.dispatchEvent(new CustomEvent('ElementBuilderSet'));
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
        setStyles: function (styles) {
            Setter.Styles.call(this, styles);
            return this;
        },
        // todo: (classes: string | array | object)
        // object: { add, remove, toggle }
        // setClasses: (classes: string[] | string, ...args: string[]) => {
        //     typeOf(classes) === 'array' ? element.classList.add(...classes)
        //                                 : element.classList.add(classes)
        //     return this
        // },
        setClasses: function (...classes) {
            element.classList.add(...[].concat(...classes));
            return this;
        },
        swap: async function (swapped, animate) {
            const elementsAreValid = () => {
                return (element instanceof HTMLElement && swapped instanceof HTMLElement
                    && (!!element.parentNode && !!swapped.parentNode)
                    && element !== swapped);
            };
            if (!elementsAreValid())
                return;
            if (animate) {
                const ms = typeof animate === 'object' && animate.animationDuration
                    ? animate.animationDuration
                    : undefined;
                await new ElementBuilderAnimation_1.default(ms).swap2(element, swapped);
            }
            const dummy = document.createElement('div');
            element.parentNode.replaceChild(dummy, element);
            swapped.parentNode.replaceChild(element, swapped);
            dummy.parentNode.replaceChild(swapped, dummy);
            return this;
        },
        setStyle: function (styles = {}) {
            if (element instanceof HTMLElement) {
                Object.assign(element.style, styles);
            }
            return this;
        },
        toString: function () {
            return element.outerHTML;
        }
    };
};
exports.default = ElementBuilder;


/***/ }),

/***/ "./src/ElementBuilderAnimation.ts":
/*!****************************************!*\
  !*** ./src/ElementBuilderAnimation.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ElementBuilderError_1 = __webpack_require__(/*! ./ElementBuilderError */ "./src/ElementBuilderError.ts");
class ElementBuilderAnimation {
    constructor(duration) {
        this.duration = 200;
        this.then = {
            then: (resolve) => setTimeout(resolve, this.duration)
        };
        if (duration && duration < 0)
            throw new ElementBuilderError_1.default('Invalid animation duration', name);
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
exports.default = ElementBuilderAnimation;


/***/ }),

/***/ "./src/ElementBuilderError.ts":
/*!************************************!*\
  !*** ./src/ElementBuilderError.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ElementBuilderError extends Error {
    constructor(message, suspect) {
        super(message);
        this.name = 'ElementBuilderError';
        this.suspect = suspect;
        console.warn(`${this.name}: ${this.message}:\n`, this.suspect, '\n', this.stack);
    }
}
exports.default = ElementBuilderError;


/***/ }),

/***/ "./src/Rule.ts":
/*!*********************!*\
  !*** ./src/Rule.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.For = exports.If = exports.Timeout = exports.Interval = exports.Once = exports.On = void 0;
const ElementBuilderError_1 = __webpack_require__(/*! ./ElementBuilderError */ "./src/ElementBuilderError.ts");
function On(eventName, callback) {
    window.addEventListener(eventName, () => callback());
}
exports.On = On;
function Once(eventName, callback) {
    const listener = () => {
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
        new ElementBuilderError_1.default(`Condition id not found. Make sure to provide the corresponding pair [Function: boolean, conditionId: string] as an argument of the .given() method before using an @if rule `, conditionId);
    }
    else if (this.referenceMap.get(conditionId)()) {
        callback();
    }
}
exports.If = If;
function For(conditionId, callback) {
}
exports.For = For;


/***/ }),

/***/ "./src/RuleManager.ts":
/*!****************************!*\
  !*** ./src/RuleManager.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.processSourceObject = exports.getComputedValue = exports.applyRules = exports.assignWithSetter = void 0;
const Check = __webpack_require__(/*! ./utils/Check */ "./src/utils/Check.ts");
const Rule = __webpack_require__(/*! ./Rule */ "./src/Rule.ts");
const RuleMap = {
    on: Rule.On,
    once: Rule.Once,
    interval: Rule.Interval,
    timeout: Rule.Timeout,
    if: Rule.If,
    for: Rule.For
};
function assignWithSetter(source, callback, keyRestriction) {
    const parsedObject = exports.processSourceObject(source);
    const processEntry = (key) => {
        if (keyRestriction && !(key in keyRestriction))
            return;
        const { value, rules } = parsedObject[key];
        const computedValue = () => exports.getComputedValue.call(this, value);
        const setEntry = () => callback(key, computedValue());
        const hasRules = (entry) => !!entry.rules.size;
        hasRules(parsedObject[key]) ? submitToRules(rules, setEntry) : setEntry();
    };
    const submitToRules = (rules, callback) => {
        let ruleApplied = false;
        const applyRule = (ruleValue, ruleName) => {
            const ruleKey = ruleName.toLowerCase();
            if (ruleKey in RuleMap) {
                RuleMap[ruleKey].call(this, ruleValue, callback);
                ruleApplied = true;
            }
        };
        rules.forEach(applyRule);
        if (!ruleApplied)
            callback();
    };
    Object.keys(parsedObject).forEach(processEntry);
}
exports.assignWithSetter = assignWithSetter;
function applyRules(rules, callback) {
    let ruleApplied = false;
    rules.forEach((ruleValue, ruleName) => {
        const ruleKey = ruleName.toLowerCase();
        if (ruleKey in RuleMap) {
            RuleMap[ruleKey].call(this, ruleValue, callback);
            ruleApplied = true;
        }
    });
    if (!ruleApplied)
        callback();
}
exports.applyRules = applyRules;
exports.getComputedValue = function (value) {
    return Check.isTypeOf(value, 'function') ? value.call(this) : value;
};
exports.processSourceObject = (source) => {
    // 'properties@once:click@interval:1000' => ['properties', 'once:click', 'interval:1000']
    const parseSourceKey = (sourceKey) => sourceKey.split('@');
    // 'once:click' => ['once', 'click']
    const parseRawRule = (rawRule) => rawRule.split(':');
    const getProcessedEntriesFromSource = (source) => {
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
                value: { value: entry.value, rules: entry.rules }
            });
        });
        return object;
    };
    // const createMapFromProcessedEntries = (processedEntries: ProcessedEntry[]) => {
    //     return new Map(processedEntries.map((entry) => {
    //         return [entry.key, { value: entry.value, rules: entry.rules }]
    //     }))
    // }
    // [{ key: 'attributes', value: {...}, rules: [] }, ...], 
    const processedEntries = getProcessedEntriesFromSource(source);
    const finalObject = getObjectFromEntries(processedEntries);
    // const finalMap = createMapFromProcessedEntries(processedEntries)
    return finalObject;
};
// const processedSource = processSourceObject(options)
// processSourceObject(options)
const getFromReferenceMap = function (query) {
    if (!this.referenceMap.has(query))
        return false;
    return this.referenceMap.get(query);
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ./ElementBuilder.ts */ "./src/ElementBuilder.ts").default;


/***/ }),

/***/ "./src/utils/Check.ts":
/*!****************************!*\
  !*** ./src/utils/Check.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidChild = exports.isValidSource = exports.isStringObject = exports.isArrayArray = exports.isEventTupleArray = exports.isEventTuple = exports.isTypeOf = exports.typeOf = void 0;
exports.typeOf = (s) => {
    return `${{}.toString.call(s)}`
        .replace(/^\[object ([a-z]+)\]$/i, '$1')
        .toLowerCase();
};
exports.isTypeOf = (x, ...types) => {
    return types
        .map((type) => exports.typeOf(x) === type.toLocaleLowerCase())
        .reduce((a, c) => a || c);
};
exports.isEventTuple = (subject) => {
    return (exports.isTypeOf(subject, 'array')
        && exports.isTypeOf(subject[0], 'string')
        && exports.isTypeOf(subject[1], 'function')
        && (!subject[2] || exports.isTypeOf(subject[2], 'boolean', 'object')));
};
exports.isEventTupleArray = (subject) => {
    return (exports.isTypeOf(subject, 'array')
        && subject.every(exports.isEventTuple));
};
exports.isArrayArray = (subject) => {
    return (exports.isTypeOf(subject, 'array')
        && subject.every((item) => exports.isTypeOf(item, 'array')));
};
exports.isStringObject = (subject) => {
    return (exports.isTypeOf(subject, 'object')
        && Object.keys(subject).every((item) => exports.isTypeOf(item, 'string')));
};
exports.isValidSource = (source) => {
    return source instanceof Element || exports.typeOf(source) === 'string';
};
exports.isValidChild = (child) => {
    return (exports.isTypeOf(child, 'string', 'number')
        || child instanceof Node
        || child.isElementBuilder);
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
exports.Children = exports.Listeners = exports.Styles = exports.Attributes = exports.Properties = exports.sourceElement = void 0;
const check = __webpack_require__(/*! ./Check */ "./src/utils/Check.ts");
const RuleManager = __webpack_require__(/*! ../RuleManager */ "./src/RuleManager.ts");
const ElementBuilderError_1 = __webpack_require__(/*! ../ElementBuilderError */ "./src/ElementBuilderError.ts");
function sourceElement(source) {
    return check.isTypeOf(source, 'string') ? document.createElement(source) : source;
}
exports.sourceElement = sourceElement;
function Properties(properties = {}) {
    const setProperty = (name, value) => {
        this.element[name] = value;
    };
    RuleManager.assignWithSetter.call(this, properties, setProperty);
}
exports.Properties = Properties;
function Attributes(attributes = {}) {
    const addAttribute = (name, value) => {
        if (this.element instanceof Element) {
            this.element.setAttribute(name, value);
        }
    };
    RuleManager.assignWithSetter.call(this, attributes, addAttribute);
}
exports.Attributes = Attributes;
function Styles(styles = {}) {
    const setStyle = (name, value) => {
        if (this.element instanceof HTMLElement) {
            this.element.style[name] = value;
        }
    };
    RuleManager.assignWithSetter.call(this, styles, setStyle);
}
exports.Styles = Styles;
function Listeners(listeners) {
    const addListener = ([event, listener, options]) => {
        this.element.addEventListener(event, listener, options);
    };
    if (check.isEventTuple(listeners))
        addListener(listeners);
    else if (check.isEventTupleArray(listeners))
        listeners.forEach(addListener);
    else
        new ElementBuilderError_1.default('Invalid input for listeners input ([string, Function] or [string, Function][] expected)', listeners);
}
exports.Listeners = Listeners;
function Children(children) {
    const addChild = (child) => {
        if (!check.isValidChild(child)) {
            new ElementBuilderError_1.default('Invalid child (Node, string, number or ElementBuilder instance expected)', child);
            return;
        }
        if (child instanceof Node) {
            this.element.appendChild(child);
        }
        else if (check.isTypeOf(child, 'string', 'number')) {
            this.element.innerHTML += `${child}`;
        }
        else if (child.isElementBuilder) {
            this.element.appendChild(child.element);
        }
        else
            new ElementBuilderError_1.default(`Invalid input in children array`, child);
    };
    check.isValidChild(children)
        ? addChild(children)
        : check.isTypeOf(children, 'array')
            ? children.forEach(addChild)
            : new ElementBuilderError_1.default(`Invalid input for children value`, children);
    // if (v.isValidChild(children)) addChild(children as ValidChild)
    // else if (v.isTypeOf(children, 'array')) (children as []).forEach(addChild)
    // else new ElementBuilderError(`Invalid input for children value`, children)
}
exports.Children = Children;


/***/ })

/******/ });
//# sourceMappingURL=elbuilder-0.0.1.js.map