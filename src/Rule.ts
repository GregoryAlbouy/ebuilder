import ElementBuilderError from './ElementBuilderError'
import * as Parse from './Parse'

export const RuleMap: FunctionObject = {
    on: On,
    once: Once,
    interval: Interval,
    timeout: Timeout,
    if: If,
    for: For
}

function handleEvent(
    this: ElementBuilderObject,
    eventInput: string,
    callback: Function,
    isOnce?: boolean
) {
    const [type, emitter] = Parse.eventInput.call(this, eventInput)

    const once = () => {
        emitter.removeEventListener(type, once)
        callback()
    }

    const handler = isOnce ? once : callback

    if ('addEventListener' in emitter) emitter.addEventListener(type, handler)
}

export function On(
    this: ElementBuilderObject,
    eventInput: string,
    callback: Function
): void {
    handleEvent.call(this, eventInput, callback)
}

export function Once(
    this: ElementBuilderObject,
    eventInput: string,
    callback: Function
): void {
    handleEvent.call(this, eventInput, callback, true)
}

export function Interval(
    this: ElementBuilderObject,
    rate: string,
    callback: Function
): void {
    this.interval = setInterval(callback, parseInt(rate))
}

export function Timeout(delay: string, callback: Function): void {
    setTimeout(callback, parseInt(delay))
}

export function If(
    this: ElementBuilderObject,
    conditionId: string,
    callback: Function
): void {
    if (!this.referenceMap.has(conditionId)) {
        new ElementBuilderError(`Condition id not found. Make sure to provide the corresponding pair [Function: boolean, conditionId: string] as an argument of the .given() method before using an @if rule `, conditionId)
    } else if ((this.referenceMap.get(conditionId) as Function)()) {
        callback()
    }
}

export function For(
    this: ElementBuilderObject,
    conditionId: string,
    callback: Function
): void {
    const array = this.getRef(conditionId)
    console.log(array, conditionId)


    array.forEach((v: any, i: number, a: []) => {
        
        // TODO: find a way to get the (function) value of an entry with @for rule
        // const realValue = entryValue.bind.call(this, v, i a)
        console.log(callback)
        callback()
    } )
}