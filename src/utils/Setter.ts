import * as check from './Check'
import * as RuleManager from '../RuleManager'
import ElementBuilderError from '../ElementBuilderError'


export function sourceElement(source: any): Element {
    return check.isTypeOf(source, 'string') ? document.createElement(source) : source
}

export function Properties(this: ElementBuilderObject, properties: AnyObject = {}): void {
    const setProperty = (name: string, value: any) => {
        (this.element as AnyObject)[name] = value
    }

    RuleManager.assignWithSetter.call(this, properties, setProperty)
}

export function Attributes(this: ElementBuilderObject, attributes: StringObject = {}): void {
    const addAttribute = (name: string, value: any) => {
        if (this.element instanceof Element) {
            this.element.setAttribute(name, value)
        }
    }
    
    RuleManager.assignWithSetter.call(this, attributes, addAttribute)
}

export function Styles(this: ElementBuilderObject, styles: StringObject | Function = {}): void {
    const setStyle = (name: string, value: any) => {
        if (this.element instanceof HTMLElement) {
            (this.element.style as AnyObject)[name] = value
        }
    }
    
    RuleManager.assignWithSetter.call(this, styles, setStyle)
}

export function Listeners(this: ElementBuilderObject, listeners: EventTuple | EventTuple[]): void {
    const addListener = ([event, listener, options]: EventTuple): void => {
        this.element.addEventListener(event, listener, options)
    }

    if (check.isEventTuple(listeners)) addListener(listeners as EventTuple)
    else if (check.isEventTupleArray(listeners)) (listeners as EventTuple[]).forEach(addListener)
    else new ElementBuilderError('Invalid input for listeners input ([string, Function] or [string, Function][] expected)', listeners)
}

export function Children(this: ElementBuilderObject, children: ValidChild | ValidChild[]): void {
    const addChild = (child: ValidChild): void => {
        if (!check.isValidChild(child)) {
            new ElementBuilderError('Invalid child (Node, string, number or ElementBuilder instance expected)', child)
            return
        }
        if (child instanceof Node) {
            this.element.appendChild(child)
        } 
        else if (check.isTypeOf(child, 'string', 'number')) {
            this.element.innerHTML += `${child}`
        } 
        else if ((child as ElementBuilderObject).isElementBuilder) {
            this.element.appendChild((child as ElementBuilderObject).element)
        }
        else new ElementBuilderError(`Invalid input in children array`, child)
    }

    check.isValidChild(children)
        ? addChild(children as ValidChild)
        : check.isTypeOf(children, 'array')
            ? (children as []).forEach(addChild)
            : new ElementBuilderError(`Invalid input for children value`, children)
            
    // if (v.isValidChild(children)) addChild(children as ValidChild)
    // else if (v.isTypeOf(children, 'array')) (children as []).forEach(addChild)
    // else new ElementBuilderError(`Invalid input for children value`, children)
}