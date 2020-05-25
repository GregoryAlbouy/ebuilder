# EBuilder : an HTML element builder

Build and manipulate elements the intuitive way, in a single statement with a touch a functionnal programming.

```javascript
const p = EBuilder('p').setContent('Lopsum Irem').into(document.body)
```

## Installation

### Using npm

```shell
npm i ebuilder-js
```
```javascript
import EBuilder from 'ebuilder-js'
```

### Using bundle

```html
<script src="./path/to/ebuilder.min.js"></script>
```

## Doc

### EBuilder input

```typescript
EBuilder(input: string | Element | EBObject)
```
| Argument type | Example |
|---------------|---------|
| string        | EBuilder(`'p'`) |
| html string   | EBuilder(`'<p>Hello <span class="italic">World</span>!</p>'`) |
| @rule string  | EBuilder(`'@select:p.paragraph:nth-child(1)'`) |
| Element       | Ebuilder(`document.querySelector('p')`) |
| EBObject      | EBuilder(`EBuilder('p')`) |


## Methods

### DOM methods

#### into(`target`, `options`?)
* `target`: a Node or EBObject
* `options`: { `at`?, `times`? }
    * `at`: the position in the parent. Accepts a number (`0` is first, `-1` is last, floats are rounded), or `'start'` or `'middle'` or `'end'`. Default value: `-1`
    * `times`: number of copies. Default value: `1`

Example:
```javascript
const list = EBuilder('ul')
    .setChildren([ '<li>First</li>', '<li>Last</li>' ])
    .into(document.body)

EBuilder('<li>HERE WE ARE</li>').into(list, { at: 'middle', times: 3 })

/*
- First
- HERE WE ARE
- HERE WE ARE
- HERE WE ARE
- Last
*/
```
#### before(`target`)
Places the element right before the target
#### after(`target`)
Places the element right after the target
#### replace(`target`)
Places the element at the target's position and removes the target
#### swap(`target`, `animate?`)
If both the element and the target are in the DOM, makes them swap.
If `animate` is `true`, shows the animation.
#### out()
Removes the element from the DOM


### Setter methods

#### set()

Signature: 
```typescript
EBuilder(x).set({}: {
    attributes?: { [attributeName: string]: string },
    properties?: { [propertyName: string]: any },
    style?: { [styleName: string]: string },
    listeners?: EventTuple | EventTuple[],
    children?:  EBChild | EBChild[],
})
```
* `EventTuple`: array of addEventListener arguments, e.g.:
```javascript
[ 'click', () => console.log('clicked'), false ]
```
* `EBChild`: any valid EBuilder `children` input (html string, Node, EBObject):
```javascript
children: [
    '<h3>My article</h3>',
    document.querySelector('p'),
    EBuilder('button').setContent('read more')
]
```

Note that any value can be replaced with a function returning that value, see [Function as value](#function-as-value)

#### setAttributes(`object`)
#### setProperties(`object`)
#### setListeners(`array`)
#### setChildren(`EBChild` | `EBChild[]`)
#### setClasses(`string` | `array`)
#### setStyle(`object`)
#### setContent(`string | EBObject`)


### Miscellaneous

#### toString()
Returns the current element's *outerHTML*, allowing a convenient access to that value:

```javascript
const button = EBuilder('button').set({ ... })

someElement.innerHTML += button
```

#### dispatch(`string`)
Emits an event from the current element with the input string as a name.
See [event-name example](#event-name) for a practical use.

#### given(`ReferencePair` | `ReferencePair[]`)
ReferencePair: [ `anyReference`, `'unique-string-id'` ]
Registers any reference in the EBuilder object, allowing to be accessed with an `@at-rule` followed by `unique-string-id`.  
Note that if the `anyReference` is a **named function**, the string id can be omitted and the function name will be used as an id in this cas

See [event-emitter example](#event-emitter) or [@if example](#if) for a practical uses.


## Properties

* `el` or `element`: the generated HTML element.
* `htmlContent`: element's innerHTML
* `count`: number of children
* `children`: node list of children
* ... and more to come!

## Function as value

Any value can be replaced with a function to be executed in the process (provided that function returns an appropriate value). This can be useful in many situations:
* Dynamic rendering
* Conditional value
* Self-reference with `this` or bound argument

### Dynamic rendering

```javascript
// value is fixed
EBuilder('p').setProperties({ 'textContent@interval:500': Math.random() })

// value is dynamic
EBuilder('p').setProperties({ 'textContent@interval:500': () => Math.random() })
```

### Conditionnal value

### Self-reference

Function expressions are bound to the current EBuilder object through `this` argument, so you can get its reference within the same statement:

```javascript
EBuilder('<ul><li>0</li></ul>').setProperties({
    'innerHTML@on:click': function() { return this.htmlContent + `<li>${this.count}</li>` }
})

// also available as the first parameter:

EBuilder('<ul><li>0</li></ul>').setProperties({
    'innerHTML@on:click': (self) => self.htmlContent + `<li>${self.count}</li>`
})
```

## @-rules

Added at the end of a key string, @-rules allow conditionnal evaluation of the corresponding value in an object. Such rules are available in every object argument of a setting method (.setStyles(), .setChildren()...), including the set() method at both levels:

```javascript
EBuilder('button').set({
    'properties@on:mouseover': {
        'textContent@interval:1000': () => new Date().getSeconds()
    }
}).into(document.body)
```

### @on, @once

The corresponding value will be set when an `:eventName` event is emitted by the current element.

`{ 'key@on:eventName': 'value' }` would  basically translate to
```javascript
this.addEventListener('eventName', () => element.key = 'value')
```

This allows to do funny things quite straight-forwardly:
```javascript
EBuilder('<button>click me</button>').setProperties({
    'textContent@on:click': () => Math.random() < .5 ? 'win!' : 'loose!',
    'innerHTML@on:mouseleave': 'Hey <strong>come back</strong>!'
}).into(document.body)
```

With `@on` the value will be updated each time the event occurs, but only the first time with `@once`

#### :event-name

The event name can be any string value:
* A built-in event: `click`, `keydown`...
* A specific EBuilder event: `EBuilderinsert`, `EBuilderset`
* Or any custom event of your own, such as: `'faisons comme ça!'`

Note that EBuilder allows to dispatch such events easily with the `dispatch()` method, which allows to do such things:

```javascript
EBuilder('ul')
    .setProperties({ 'innerHTML@once:hi-there': (self) => self.htmlContent + '<li>2</li>' })
    .setChildren('<li>1</li>')
    .dispatch('hi-there')

/*
- 1
- 2
*/
```

#### #event-emitter

By default, the listener is set on the current element. But what if I want my element to react to an external event, like a click on a button?  
To achieve this you can designate a specific target using `#` in the string key after the event name. But there's a catch: for EBuilder to recover the right object from that string, it must have been previously referenced with the `given()` method, as in the example below:

```javascript
const myButton = EBuilder('button').into(document.body)

EBuilder('p')
    .given([myButton, 'buttonRef'])
    .setProperties({ 'textContent@once:click#buttonRef': 'Hello!' })
    .into(document.body)
```
(More details about `given()` above)

The `window` object is an exception to this rule, as it doesn't need to be pre-indexed.

### @timeout, @interval

`'key@timeout:duration'`, `'key@interval:duration'`

These methods have the same behaviour as the eponym functions. Example:

```javascript
EBuilder('div').into(document.body).setStyles({
    width: '200px',
    height: '200px',
    transition: 'background 1s',
    'background@interval:1000': () => `hsl(${360 * Math.random()}, 50%, 50%)`
})
```

Note: the interval function is referenced as the `.interval` property, which means you can clear it using `clearInterval(myEBuilderObject.interval)`.

### @if

`'key@if:functionReference: 'value'`  
The corresponding value is assigned if the specified `:functionReference` function returns `true`.
See [given() method](#Miscellaneous) for more details about references.

```javascript
const isLucky = () => Math.random() < .5

EBuilder('<button>click me</button>')
    .given(isLucky)
    .set({
        'properties@on:click': { 'textContent@if:isLucky': 'Bravo!' }
})
```

### @for

-- NOT YET AVAILABLE --

`'key@for:arrayReference: 'value'`  