/* Type checks */

export const typeOf = (s: any): string => {
    return `${{}.toString.call(s)}`
        .replace(/^\[object ([a-z]+)\]$/i, '$1')
        .toLowerCase()
}

export const isTypeOf = (x: any, ...types: string[]): boolean => {
    return types
        .map((type) => typeOf(x) === type.toLocaleLowerCase())
        .reduce((a, c) => a || c)
}

export const isNumber = (subject: any): boolean => {
    return isTypeOf(subject, 'number')
}

export const isFunction = (subject: any): boolean => {
    return isTypeOf(subject, 'function')
}

export const isArray = (subject: any): boolean => {
    return isTypeOf(subject, 'array')
}

export const isArrayArray = (subject: any): boolean => {
    return (
        isTypeOf(subject, 'array')
        && subject.every((item: any) => isTypeOf(item, 'array'))
    ) 
}

export const isStringObject = (subject: any): boolean => {
    return (
        isTypeOf(subject, 'object')
        && Object.keys(subject).every((item: any) => isTypeOf(item, 'string'))
    )
}

export const isEventTuple = (subject: any): boolean => {
    return (
        isTypeOf(subject, 'array')
        && isTypeOf(subject[0], 'string')
        && isTypeOf(subject[1], 'function')
        && (!subject[2] || isTypeOf(subject[2], 'boolean', 'object'))
    )
}

export const isEventTupleArray = (subject: any): boolean => {
    return (
        isTypeOf(subject, 'array')
        && subject.every(isEventTuple)
    )
}

export const isElement = (subject: any): boolean => {
    return subject instanceof Element
}

export const isEBuilder = (subject: any): boolean => {
    return (
        subject instanceof Object
        && 'isEBuilder' in subject && 'el' in subject
        && subject.isEBuilder && subject.el
    )
}

export const isValidChild = (child: any): boolean => {
    return (
        isTypeOf(child, 'string', 'number')
        || child instanceof Node
        || (child as EBObject).isEBuilder
    )
}

export const isValidSource = (source: any): boolean => {
    return (
        source instanceof Element || isTypeOf(source, 'string')
    )
}

export const isValidSwap = (element: Element, swapped: Element): boolean => {
    return (
        element instanceof HTMLElement && swapped instanceof HTMLElement
        && (!!element.parentNode && !!swapped.parentNode)
        && element !== swapped
    )
}

export const isValidTarget = (target: any) => {
    return isEBuilder(target) || target instanceof Element
}

export const hasName = (input: Function): boolean => {
    return !!input.name
}

export const isNamedFunction = (input: any): boolean => {
    return isFunction(input) && hasName(input)
}