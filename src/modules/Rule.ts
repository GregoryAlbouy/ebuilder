import EBuilderError from './EBuilderError'
import * as Check from '../utils/Check'
import * as Parse from '../utils/Parse'
import { isArray } from 'util'

export const RuleMap: FunctionObject = {
    on: On,
    once: Once,
    interval: Interval,
    timeout: Timeout,
    if: If,
    for: For
}

function handleEvent(
    this: EBObject,
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
    this: EBObject,
    eventInput: string,
    callback: Function
): void {
    handleEvent.call(this, eventInput, callback)
}

export function Once(
    this: EBObject,
    eventInput: string,
    callback: Function
): void {
    handleEvent.call(this, eventInput, callback, true)
}

export function Interval(
    this: EBObject,
    rate: string,
    callback: Function
): void {
    this.interval = setInterval(callback, parseInt(rate))
}

export function Timeout(delay: string, callback: Function): void {
    setTimeout(callback, parseInt(delay))
}

export function If(
    this: EBObject,
    conditionId: string,
    callback: Function
): void {
    if (!this.referenceMap.has(conditionId)) {
        new EBuilderError(`Condition id not found. Make sure to provide the corresponding pair [Function: boolean, conditionId: string] as an argument of the .given() method before using an @if rule `, conditionId)
    } else if ((this.referenceMap.get(conditionId) as Function)()) {
        callback()
    }
}

export function For(
    this: EBObject,
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

export function For2(
    this: EBObject,
    ref: any[],
    callback: Function
): void {
    if (!Check.isArray(ref)) return callback.call(this), void

    ref.forEach((v: any, i: number, a: any[]) => {
        callback.call(this, v, i, a)
    } )
}