
import * as Check from './utils/Check'
import * as Rule from './Rule'

const RuleMap: FunctionObject = {
    on: Rule.On,
    once: Rule.Once,
    interval: Rule.Interval,
    timeout: Rule.Timeout,
    if: Rule.If,
    for: Rule.For
}

export function assignWithSetter(
    this: ElementBuilderObject,
    source: AnyObject,
    callback: SetterCallback,
    keyRestriction?: Object
) {

    const parsedObject: ProcessedObject = processSourceObject(source)

    const processEntry = (key: string) => {
        if (keyRestriction && !(key in keyRestriction)) return

        const { value, rules } = parsedObject[key]
        const computedValue = () => getComputedValue.call(this, value)
        const setEntry = () => callback(key, computedValue())
        const hasRules = (entry: any) => !!entry.rules.size

        hasRules(parsedObject[key]) ? submitToRules(rules, setEntry) : setEntry()
    }

    const submitToRules = (rules: RuleMap, callback: Function) => {
        let ruleApplied = false

        const applyRule = (ruleValue: any, ruleName: string) => {
            const ruleKey = ruleName.toLowerCase()
            if (ruleKey in RuleMap) {
                RuleMap[ruleKey].call(this, ruleValue, callback)
                ruleApplied = true
            }
        }
    
        rules.forEach(applyRule)
    
        if (!ruleApplied) callback()
    }

    Object.keys(parsedObject).forEach(processEntry)
}


export function applyRules(
    this: ElementBuilderObject,
    rules: RuleMap,
    callback: Function
)
: void {
    let ruleApplied = false

    rules.forEach((ruleValue: any, ruleName: string) => {
        const ruleKey = ruleName.toLowerCase()
        if (ruleKey in RuleMap) {
            RuleMap[ruleKey].call(this, ruleValue, callback)
            ruleApplied = true
        }
    })

    if (!ruleApplied) callback()
}

export const getComputedValue = function(this: ElementBuilderObject, value: any) {
    return Check.isTypeOf(value, 'function') ? value.call(this) : value
}

export const processSourceObject = (source: AnyObject): ProcessedObject => {
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
                value: { value: entry.value, rules: entry.rules }
            })
        })

        return object
    }

    // const createMapFromProcessedEntries = (processedEntries: ProcessedEntry[]) => {
    //     return new Map(processedEntries.map((entry) => {
    //         return [entry.key, { value: entry.value, rules: entry.rules }]
    //     }))
    // }

    // [{ key: 'attributes', value: {...}, rules: [] }, ...], 
    const processedEntries: ProcessedEntry[] = getProcessedEntriesFromSource(source)
    const finalObject: ProcessedObject = getObjectFromEntries(processedEntries)
    // const finalMap = createMapFromProcessedEntries(processedEntries)

    return finalObject
}
// const processedSource = processSourceObject(options)
// processSourceObject(options)

const getFromReferenceMap = function(this: ElementBuilderObject, query: string): any {
    if (!this.referenceMap.has(query)) return false
    return this.referenceMap.get(query)
}