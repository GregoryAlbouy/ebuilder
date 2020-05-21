import EBuilderError from './EBuilderError'
import * as Check from './Check'
import * as Parse from './Parse'
import * as Rule from './Rule'

export function element(source: string | Element): Element {
    const hasRule = (input: string) => input.charAt(0) === '@'

    const inputType = (input: string) => /^<.*>$/.test(input) ? 'html' : 'element'

    const getElementFromHTML = (value: string) => {
        const template = document.createElement('template')
        template.innerHTML = value
        return template.content.firstElementChild
    }

    const ruleMap: FunctionObject = {
        'html': (value: any) => getElementFromHTML(value),
        'select': (value: any) => document.querySelector(value), // TODO: allow choice of ELEMENT.querySelector,
        'element': (value: any) => document.createElement(value)
    }

    if (source instanceof Element) return source

    if (hasRule(source)) {
        const { rule, value } = Parse.elementStringSource(source)
    
        if (!value) new EBuilderError('Invalid ElBuilder source input', source)
    
        const safeRule = rule ?? 'element'
    
        return ruleMap[safeRule](value)
    }

    return ruleMap[inputType(source)](source)
}

export function Properties(this: EBObject, properties: AnyObject = {}): void {
    const setProperty = (name: string, value: any) => {
        (this.element as AnyObject)[name] = value
    }

    process.call(this, properties, setProperty)
}

export function Attributes(this: EBObject, attributes: StringObject = {}): void {
    const addAttribute = (name: string, value: any) => {
        if (this.element instanceof Element) {
            this.element.setAttribute(name, value)
        }
    }
    
    process.call(this, attributes, addAttribute)
}

export function Styles(this: EBObject, styles: StringObject | Function = {}): void {
    const setStyle = (name: string, value: any) => {
        if (this.element instanceof HTMLElement) {
            (this.element.style as AnyObject)[name] = value
        }
    }
    
    process.call(this, styles, setStyle)
}

export function Listeners(this: EBObject, listeners: EventTuple | EventTuple[]): void {
    const addListener = ([event, listener, options]: EventTuple): void => {
        this.element.addEventListener(event, listener, options)
    }

    if (Check.isEventTuple(listeners)) addListener(listeners as EventTuple)
    else if (Check.isEventTupleArray(listeners)) (listeners as EventTuple[]).forEach(addListener)
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
        else if ((child as EBObject).isEBuilder) {
            this.element.appendChild((child as EBObject).element)
        }
        else new EBuilderError(`Invalid input in children array`, child)
    }
    const childrenValue = Parse.getComputedValue.call(this, children)
    Check.isValidChild(childrenValue)
        ? addChild(childrenValue as EBChild)
        : Check.isTypeOf(childrenValue, 'array')
            ? (childrenValue as []).forEach(addChild)
            : new EBuilderError(`Invalid input for children value`, childrenValue)
}


export function process(
    this: EBObject,
    source: AnyObject,
    callback: SetterCallback,
    keyRestriction?: Object
) {
    const parsedObject: ProcessedObject = Parse.sourceObject(source)

    const processEntry = (key: string) => {
        if (keyRestriction && !(key in keyRestriction)) return

        const currentEntry = parsedObject[key]
        const { value, rules } = currentEntry

        /**
         * Possible entry point for calling additionnal parameters for, e.g., @-for rule
         */
        const computedValue = () => Parse.getComputedValue.call(this, value)
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