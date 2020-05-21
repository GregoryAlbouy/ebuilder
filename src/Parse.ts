import * as Check from './Check'

export function eventInput(this: ElementBuilderObject, eventInput: string) {
    const elementFrom = (getRefResult: any) => {
        return 'isElementBuilder' in getRefResult ? getRefResult.element : getRefResult
    }

    const [type, targetInput] = eventInput.split('#')
    const target = targetInput ? elementFrom(this.getRef(targetInput)) : this.element
    
    return [type, target]
}

export function getComputedValue(this: ElementBuilderObject, value: any) {
    return Check.isFunction(value) ? value.call(this) : value
}

export const sourceObject = (source: AnyObject): ProcessedObject => {
    // 'properties@once:click@interval:1000' => ['properties', 'once:click', 'interval:1000']
    const parseSourceKey = (sourceKey: string) => sourceKey.split('@')

    // 'once:click' => ['once', 'click']
    const parseRawRule = (rawRule: string) => rawRule.split(':')

    const getProcessedEntriesFromSource = (source: any): ProcessedEntry[] => {
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

    const getObjectFromEntries = (processedEntries: ProcessedEntry[]): ProcessedObject  => {
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
    const processedEntries: ProcessedEntry[] = getProcessedEntriesFromSource(source)
    const finalObject: ProcessedObject = getObjectFromEntries(processedEntries)
    // const finalMap = createMapFromProcessedEntries(processedEntries)

    return finalObject
}