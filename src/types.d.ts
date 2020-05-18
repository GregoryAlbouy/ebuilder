type AnyObject = { [key: string]: any }
type ObjectObject = { [key: string]: object }
type StringObject = { [key: string]: string }
type FunctionObject = { [key: string]: Function }
type Vector = { [key: string]: number }
type ReferencePair = [Object, string]

type Thenable = { then: Function }

type ValidChild = string | number | Node | ElementBuilderObject

type ReferenceMap = Map<string, Object>

type EventTuple = [
    string,
    EventListenerOrEventListenerObject,
    (boolean | EventListenerOptions)?
]

type SetterCallback = (key: string, value: any) => void

interface SetOptions {
    properties?: AnyObject
    attributes?: StringObject
    listeners?: EventTuple | EventTuple[]
    children?: Node | Node[] | string
}

interface ElementBuilderObject {
    isElementBuilder: boolean
    html?: string
    element: Element
    referenceMap: ReferenceMap
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
    }
}