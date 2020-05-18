
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


export const isValidSource = (source: any): boolean => {
    return source instanceof Element || typeOf(source) === 'string'
}

export const isValidChild = (child: any): boolean => {
    return (
        isTypeOf(child, 'string', 'number')
        || child instanceof Node
        || (child as ElementBuilderObject).isElementBuilder
    )
}