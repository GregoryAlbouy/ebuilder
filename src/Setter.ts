import ElementBuilderError from './ElementBuilderError'
import * as Check from './Check'
import * as Parse from './Parse'
import * as Rule from './Rule'


export function sourceElement(source: any): Element {
    return Check.isTypeOf(source, 'string') ? document.createElement(source) : source
}

export function Properties(this: ElementBuilderObject, properties: AnyObject = {}): void {
    const setProperty = (name: string, value: any) => {
        (this.element as AnyObject)[name] = value
    }

    process.call(this, properties, setProperty)
}

export function Attributes(this: ElementBuilderObject, attributes: StringObject = {}): void {
    const addAttribute = (name: string, value: any) => {
        if (this.element instanceof Element) {
            this.element.setAttribute(name, value)
        }
    }
    
    process.call(this, attributes, addAttribute)
}

export function Styles(this: ElementBuilderObject, styles: StringObject | Function = {}): void {
    const setStyle = (name: string, value: any) => {
        if (this.element instanceof HTMLElement) {
            (this.element.style as AnyObject)[name] = value
        }
    }
    
    process.call(this, styles, setStyle)
}

export function Listeners(this: ElementBuilderObject, listeners: EventTuple | EventTuple[]): void {
    const addListener = ([event, listener, options]: EventTuple): void => {
        this.element.addEventListener(event, listener, options)
    }

    if (Check.isEventTuple(listeners)) addListener(listeners as EventTuple)
    else if (Check.isEventTupleArray(listeners)) (listeners as EventTuple[]).forEach(addListener)
    else new ElementBuilderError('Invalid input for listeners input ([string, Function] or [string, Function][] expected)', listeners)
}

export function Children(this: ElementBuilderObject, children: EBChild | EBChild[] | Function): void {
    const addChild = (child: EBChild): void => {
        if (!Check.isValidChild(child)) {
            new ElementBuilderError('Invalid child (Node, string, number or ElementBuilder instance expected)', child)
            return
        }
        if (child instanceof Node) {
            this.element.appendChild(child)
        } 
        else if (Check.isTypeOf(child, 'string', 'number')) {
            this.element.innerHTML += `${child}`
        } 
        else if ((child as ElementBuilderObject).isElementBuilder) {
            this.element.appendChild((child as ElementBuilderObject).element)
        }
        else new ElementBuilderError(`Invalid input in children array`, child)
    }
    const childrenValue = Parse.getComputedValue.call(this, children)
    Check.isValidChild(childrenValue)
        ? addChild(childrenValue as EBChild)
        : Check.isTypeOf(childrenValue, 'array')
            ? (childrenValue as []).forEach(addChild)
            : new ElementBuilderError(`Invalid input for children value`, childrenValue)
}


export function process(
    this: ElementBuilderObject,
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