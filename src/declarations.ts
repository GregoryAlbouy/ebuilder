type AnyObject = { [key: string]: any }
type ObjectObject = { [key: string]: object }
type NumberObject = { [key: string]: number }
type StringObject = { [key: string]: string }
type FunctionObject = { [key: string]: Function }
type Vector = { [key: string]: number }
type ReferencePair = [Object, string]

type Thenable = { then: Function }

type EBChild = string | number | Node | EBObject
type EBTarget = Node | EBObject

type ReferenceMap = Map<string, Object>

type EventTuple = [
    string,
    EventListenerOrEventListenerObject,
    (boolean | EventListenerOptions)?
]

type SetterCallback = (key: string, value: any) => void

interface SetOptions {
    properties?: AnyObject | Function
    attributes?: StringObject | Function
    listeners?: EventTuple | EventTuple[] | Function
    children?: EBChild | EBChild[] | Function
}

interface IntoOptions {
    times?: number,
    at?: number
}

interface EBObject {
    isEBuilder: boolean
    html?: string
    el: Element
    element: Element
    referenceMap: ReferenceMap
    interval?: number
    cloneList: Element[]
    getRef: (query: string) => any
    setElement: (value: Element) => void
}


type RuleMap = Map<string, string>
// type RuleMap = any

interface ProcessedEntry {
    key: string,
    value: any,
    rules: RuleMap
}

interface ParsedObject {
    [key: string]: {
        value: any,
        rules: RuleMap
        hasRules: () => boolean
    }
}

declare module 'ebuilder-js' {
    const value: any
    export default value
}