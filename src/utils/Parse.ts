import * as Check from './Check'

export function elementStringSource (source: string) {
    const Rrule = /^@(\w+):/
    const Rvalue = /:(.+)?/

    const ruleMatch = source.match(Rrule)
    const valueMatch = source.match(Rvalue)

    const safeMatch = (match: any) => match ? match[1] : ''

    return {
        rule: safeMatch(ruleMatch),
        value: safeMatch(valueMatch)
    }
}

export function eventInput(this: EBObject, eventInput: string) {
    const elementFrom = (getRefResult: any) => {
        return 'isEBuilder' in getRefResult ? getRefResult.element : getRefResult
    }

    const [type, targetInput] = eventInput.split('#')
    const target = targetInput ? elementFrom(this.getRef(targetInput)) : this.element
    
    return [type, target]
}

export function getTrueElement(input: Element | EBObject) {
    return Check.isEBObject(input) ? input.element : input
}

export function getComputedValue(this: EBObject, value: any) {
    return Check.isFunction(value) ? value.call(this) : value
}


export function getComputedValue2(this: EBObject, value: any, boundData?: any[]) {
    return Check.isFunction(value) ? value.call(this, boundData) : value
}

export const inputObject = (source: AnyObject): ParsedObject => {
    // 'properties@once:click@interval:1000' => ['properties', 'once:click', 'interval:1000']
    const parseSourceKey = (sourceKey: string) => sourceKey.split('@')

    // 'once:click' => ['once', 'click']
    const parseRawRule = (rawRule: string) => rawRule.split(':')

    const parseEntries = (source: any): ProcessedEntry[] => {
        return Object.keys(source).map((sourceKey: any) => {
            // trueKey = 'properties', rawRules = ['once:click', 'interval:1000']
            const [trueKey, ...rawRules] = parseSourceKey(sourceKey)

            const ruleMap: RuleMap = new Map(rawRules.map(parseRawRule) as [])
            
            return {
                key: trueKey,
                value: source[sourceKey],
                rules: ruleMap
            }
        })
    }

    const getObjectFromEntries = (processedEntries: ProcessedEntry[]): ParsedObject  => {
        const object = Object.create(null)

        processedEntries.forEach((entry) => {
            Object.defineProperty(object, entry.key, {
                enumerable: true,
                value: {
                    value: entry.value,
                    rules: entry.rules,
                    hasRules: function() { return !!this.rules.size }
                }
            })
        })

        return object
    }

    // [{ key: 'attributes', value: {...}, rules: [] }, ...], 
    const processedEntries: ProcessedEntry[] = parseEntries(source)
    const finalObject: ParsedObject = getObjectFromEntries(processedEntries)
    // const finalMap = createMapFromProcessedEntries(processedEntries)

    return finalObject
}