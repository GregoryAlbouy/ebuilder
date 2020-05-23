import EBuilderError from '../modules/EBuilderError'
import * as Check from './Check'
import * as Parse from './Parse'
import * as Rule from '../modules/Rule'

/**
 * Determinate the source element to work on depending on the input:
 * element => element
 * 'div' or '@element:div' => div element
 * '<div>hello</div> or '@html:<div>hello</div> => element built upon html
 * '@select:div.mydiv' => document.querySelector('div.mydiv')
 */
export function element(source: string | Element | EBObject): Element {
    const hasRule = (input: string) => input.charAt(0) === '@'

    const inputType = (input: string) => /^<.*>$/.test(input) ? 'html' : 'element'

    const getElementFromHTML = (html: string) => {
        const template = document.createElement('template')
        template.innerHTML = html
        return template.content.firstElementChild
    }

    const ruleMap: FunctionObject = {
        'html': (value: any) => getElementFromHTML(value),
        'select': (value: any) => document.querySelector(value), // TODO: allow choice of ELEMENT.querySelector,
        'element': (value: any) => document.createElement(value)
    }

    if (Check.isElement(source)) return source

    if (Check.isEBObject(source)) return source.element
    
    source = `${source}`

    if (hasRule(source)) {
        const { rule, value } = Parse.elementStringSource(source)
    
        if (!value) new EBuilderError('Invalid ElBuilder source input', source)
    
        const safeRule = rule ?? 'element'
    
        return ruleMap[safeRule](value)
    }

    return ruleMap[inputType(source)](source)
}

export function Properties(this: EBObject, properties: AnyObject | Function = {}): void {
    const setProperty = (name: string, value: any) => {
        (this.element as AnyObject)[name] = value
    }

    process.call(this, properties, setProperty)
}

export function Attributes(this: EBObject, attributes: StringObject | Function = {}): void {
    const addAttribute = (name: string, value: any) => {
        if (this.element instanceof Element) {
            this.element.setAttribute(name, value)
        }
    }
    
    process.call(this, attributes, addAttribute)
}

export function Style(this: EBObject, style: StringObject | Function = {}): void {
    const setStyle = (name: string, value: any) => {
        if (this.element instanceof HTMLElement) {
            (this.element.style as AnyObject)[name] = value
        }
    }
    
    process.call(this, style, setStyle)
}

export function Listeners(this: EBObject, listeners: EventTuple | EventTuple[] | Function): void {
    const addListener = ([event, listener, options]: EventTuple): void => {
        this.element.addEventListener(event, listener, options)
    }

    if (Check.isEventTuple(listeners)) addListener(listeners)
    else if (Check.isEventTupleArray(listeners)) (listeners).forEach(addListener)
    else new EBuilderError('Invalid input for listeners input ([string, Function] or [string, Function][] expected)', listeners)
}

export function Children(this: EBObject, children: EBChild | EBChild[] | Function): void {
    const addChild = (child: EBChild): void => {
        if (!Check.isValidChild(child)) {
            new EBuilderError('Invalid child (Node, string, number or EBuilder instance expected)', child)
            return
        }
        if (child instanceof Node) {
            this.element.appendChild(child)
        } 
        else if (Check.isTypeOf(child, 'string', 'number')) {
            this.element.innerHTML += `${child}`
        } 
        else if (Check.isEBObject(child)) {
            this.element.appendChild((child).element)
        }
        else new EBuilderError(`Invalid input in children array`, child)
    }

    const childrenValue = Parse.getComputedValue.call(this, children)
    
    Check.isValidChild(childrenValue)
        ? addChild(childrenValue)
        : Check.isTypeOf(childrenValue, 'array')
            ? (childrenValue).forEach(addChild)
            : new EBuilderError(`Invalid input for children value`, childrenValue)
}


export function process(
    this: EBObject,
    source: AnyObject,
    callback: SetterCallback,
    keyRestriction?: Object
) {
    const parsedObject: ParsedObject = Parse.inputObject(source)

    const processEntry = (key: string) => {
        if (keyRestriction && !(key in keyRestriction)) return

        const currentEntry = parsedObject[key]
        const { value, rules } = currentEntry

        /**
         * Possible entry point for calling additionnal parameters for, e.g., @-for rule
         */
        const computedValue = () => Parse.getComputedValue.call(this, value)
        const computedValue2 = (boundData?: any[]) => Parse.getComputedValue2.call(this, value, boundData)
        const setEntry = () => callback(key, computedValue())
    
        currentEntry.hasRules() ? submitToRules(rules, setEntry) : setEntry()
    }

    const submitToRules = (rules: RuleMap, callback: Function) => {
        let ruleApplied = false

        const applyRule = (ruleValue: any, ruleName: string) => {
            const ruleKey = ruleName.toLowerCase()
            if (ruleKey in Rule.RuleMap) {
                Rule.RuleMap[ruleKey].call(this, ruleValue, callback)
                ruleApplied = true
            }
        }
    
        rules.forEach(applyRule)
    
        if (!ruleApplied) callback()
    }

    Object.keys(parsedObject).forEach(processEntry)
}

export function insertAt(element: Element, target: Element, n: number) {
    if (!Check.isNumber(n)) return

    const getPos = (n: number, length: number) => {
        return n < 0
            ? Math.max(length - 1 + n, 0)
            : Math.min(length - 1, n)
    }

    const childList = target.children
    const p = getPos(n, childList.length)

    if (childList.length === 0 || childList.length - 1 === p) target.appendChild(element)
    else childList[p].insertAdjacentElement('beforebegin', element)
}