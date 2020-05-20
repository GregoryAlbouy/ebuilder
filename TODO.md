# elBuilder: todo list

* use classes to allow TypeScript decorators
* add .into(xxx, { at: 3 })
* more accurate/consistent function names:
    * setXXX({ add?: T | T[], remove?: T | T[] replace/edit?: [T,K] | [T,K][] })
    * remove/deleteXXX()
    * addXXX()
* allow various inputs in main function
    * html to immediately transform it into an element, e.g. `elBuilder('<button>my button</button>')`

```typescript
    function elBuilder(input: 
        string // tag name
        | HTMLElement // existing html element
        | { html?: string, template?: HTMLTemplateElement }
    )
```