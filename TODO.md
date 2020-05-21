# EBuilder: todo list

* finish README
* use classes to allow TypeScript decorators?
* more accurate/consistent function names:
    * setXXX({ add?: T | T[], remove?: T | T[] replace/edit?: [T,K] | [T,K][] })
    * remove/deleteXXX()
    * addXXX()
* allow various inputs in main function
    * html to immediately transform it into an element, e.g. `elBuilder('<button>my button</button>')`
    * css selector
    * template element to be immediately processed? 

```typescript
function EBuilder(input: 
    string // tag name only
    | HTMLElement
    | { html?: string, selector?: string, tagName?: string }
)
```
OR
```typescript
function EBuilder(input:
    string // 'h2', '@select:h2.title:not[hidden]', '@html:<h2><span>Title</span></h2>
    | HTMLElement
)
```

* check Element / HTMLElement consistency
* finish error handling, use Enum or json for error description -> if (error) new ElBuilderError(E.SETSTYLES_INVALID_INPUT, input)