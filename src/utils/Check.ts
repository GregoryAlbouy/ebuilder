/* Type checks */

export const typeOf = (input: any): string => {
    return `${{}.toString.call(input)}`
        .replace(/^\[object ([a-z]+)\]$/i, '$1')
        .toLowerCase()
}

export const isTypeOf = (input: any, ...types: string[]): boolean => {
    return types
        .map((type) => typeOf(input) === type.toLowerCase())
        .reduce((a, c) => a || c)
}

export const isNumber = (input: any): input is number => {
    return isTypeOf(input, 'number')
}

export const isString = (input: any): input is string => {
    return isTypeOf(input, 'string')
}

export const isFunction = (input: any): input is Function => {
    return isTypeOf(input, 'function')
}

export const isArray = (input: any): input is [] => {
    return isTypeOf(input, 'array')
}

export const isArrayArray = (input: any): input is [][] => {
    return (
        isTypeOf(input, 'array')
        && input.every((item: any) => isTypeOf(item, 'array'))
    ) 
}

export const isStringObject = (input: any): input is StringObject => {
    return (
        isTypeOf(input, 'object')
        && Object.keys(input).every((item: any) => isTypeOf(item, 'string'))
    )
}

export const isEventTuple = (input: any): input is EventTuple => {
    return (
        isTypeOf(input, 'array')
        && isTypeOf(input[0], 'string')
        && isTypeOf(input[1], 'function')
        && (!input[2] || isTypeOf(input[2], 'boolean', 'object'))
    )
}

export const isEventTupleArray = (input: any): input is EventTuple[] => {
    return (
        isTypeOf(input, 'array')
        && input.every(isEventTuple)
    )
}

export const isElement = (input: any): input is Element => {
    return input instanceof Element
}

export const isEBObject = (input: any): input is EBObject => {
    return (
        input instanceof Object
        && (input as EBObject).isEBuilder
    )
}

export const isValidChild = (input: any): input is EBChild => {
    return (
        isTypeOf(input, 'string', 'number')
        || input instanceof Node
        || (input as EBObject).isEBuilder
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
    return isEBObject(target) || target instanceof Element
}

export const hasName = (input: Function): boolean => {
    return !!input.name
}

export const isNamedFunction = (input: any): boolean => {
    return isFunction(input) && hasName(input)
}