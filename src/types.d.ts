type AnyObject = { [key: string]: any }
type ObjectObject = { [key: string]: object }
type StringObject = { [key: string]: string }
type FunctionObject = { [key: string]: Function }
type Vector = { [key: string]: number }
type ReferencePair = [Object, string]

type Thenable = { then: Function }

type EBChild = string | number | Node | ElementBuilderObject
type EBTarget = Node | ElementBuilderObject

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

interface ElementBuilderObject {
    isElementBuilder: boolean
    html?: string
    el: Element
    element: Element
    referenceMap: ReferenceMap
    interval?: number
    getRef: (query: string) => any
}


type RuleMap = Map<string, string>
// type RuleMap = any

interface ProcessedEntry {
    key: string,
    value: any,
    rules: RuleMap
}

interface ProcessedObject {
    [key: string]: {
        value: any,
        rules: RuleMap
        hasRules: () => boolean
    }
}