import ElementBuilderError from './ElementBuilderError'

export function On(eventName: string, callback: Function): void {
    window.addEventListener(eventName, () => callback())
}

export function Once(eventName: string, callback: Function): void {
    const listener = () => {
        window.removeEventListener(eventName, listener)
        callback()
    }
    window.addEventListener(eventName, listener)
}

export function Interval(rate: string, callback: Function): void {
    setInterval(callback, parseInt(rate))
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
    callback: Function)
: void {

}