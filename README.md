# EBuilder : an HTML element builder

Build and manipulate elements the functionnal way, in a single statement.

```javascript
const p = EBuilder('p').setContent('Lopsum Irem').into(document.body, { times: 3 })

const title = EBuilder('<h1>Hello <strong>World</strong>!</h1>').before(p)

const button = EBuilder('button').set({
    style: {
        'background@interval:500': () => `hsl(360 * Math.random(), 50%, 50%`
    }
}).
```

**README in progress!**

## Overview / Main features

* freedom of input
* chainability, functionnal aspect
* single declaration
* this binding

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
<script src="./path/to/ebuilder.min.js">
```

## Doc

### EBuilder inputs

* 

## Properties

* `el`, `element`: the generated HTML element.

## Methods

### Setter methods

#### setAttributes()
#### setProperties()
#### setListeners()
#### setChildren()
#### setClasses()
#### setStyles()
#### set()

### Miscellaneous

* `htmlContent()`: returns the current element's *innerHTML*
* `count()`: returns the current element's amount of child nodes (might change to child **element** nodes instead)
* `toString()`: returns the current element's *outerHTML*. It can be handy to add it to the DOM quite quickly
```javascript
const elButton = EBuilder('button').set({ ... })

someElement.innerHTML += elButton
```

Signature: 
```typescript
EBuilder(myElement).set({}: {
    attributes?: { [attributeName: string]: string },
    properties?: { [propertyName: string]: any },
    listeners?: EventTuple | EventTuple[]
    children?:  ValidChild | ValidChild[],
})
```

### DOM methods

* into()
* before()
* after()
* replace()
* swap()

### Function as value

Any value can be replaced with a function to be executed in the process (provided that function returns an appropriate value). This can be useful in many situations:
* Non-static value
* Conditional value
* Since value functions are called with the current EBuilder object as `this`, it allows auto-reference
This can be useful when you want to render a non-static result. Consider the following:
```javascript
EBuilder(myElement).setProperties({
    'innerHTML@on:click': myElement.el.htmlContent() + `<p>I have ${myElement.el.count()} children.</p>`
})
```
This won't work as expected as the `length` value is calculated once and will always output the value at the moment of declaration.
Instead, use the following:

```javascript
EBuilder(myElement).setProperties({
    'innerHTML@on:click': () => myElement.el.htmlContent() + `<p>I have ${myElement.el.count()} children.</p>`
})
```

Note that function expressions are called with `this` value as the current EBuilder instance, so you can do instead :

```javascript
EBuilder(myElement).setProperties({
    'innerHTML@on:click': function() { return this.htmlContent() + `<p>I have ${this.count()} children.</p>` }
})
```

#### children

Expects an array of / a single value of :
* HTML string (ex.)
* EBuilder instance (ex.)
* An Element (ex)
* ...?

## @-rules

Added at the end of a key string, @-rules allow conditionnal evaluation of the corresponding value in an object. Such rules are available in every object argument of a setting method (.setStyles(), .setChildren()...), including the set() method at both levels:

```javascript
const elButton = EBuilder('button').set({
    'properties@on:mouseover': {
        'textContent@interval:1000': () => new Date().getSeconds()
    }
}).into(document.body)
```

### `@on`, `@once`

The corresponding value will be set when an `:eventName` event is emitted by the current element.

`{ 'key@on:eventName': 'value' }` would  basically translate to
```javascript
this.addEventListener('eventName', () => element.key = 'value')
```

With `@on` the value will be updated each time the event occurs, and only the first time with `@once`

#### `:eventName`

The event name can be any string value:
* A built-in event: `click`, `keydown`...
* A specific EBuilder event: `EBuilderinsert`, `EBuilderset`
* Or any custom event of your own, such as: `'faisons comme ça!'`

Note that EBuilder allows to dispatch such events easily with the `dispatch()` method, which allows to do such things:

Considering  `const elList = EBuilder('ul').into(document.body)`,

```javascript
elList.set({
    properties: {
        'innerHTML@once:hi-there': () => elList.htmlContent() + '<li>2</li>'
    }
}).setChildren('<li>1</li>').dispatch('hi-there')
```
will output:
* 1
* 2

#### `#event-emitter`

By default, the listener is set on the current element. But what if I want my element to react to an external event, like a click on a button?  
To achieve this you can designate a specific target using `#` in the string key after the event name. But there's a catch: for EBuilder to recover the right object from that string, it must have been previously referenced with the `given()` method, as in the example below:

```javascript
const myButton = EBuilder('button').into(document.body)

EBuilder('p')
    .given([ myButton, 'buttonRef' ])
    .setProperties({ 'textContent@once:click#buttonRef': 'Hello!' })
    .into(document.body)
```
(More details about `given()` below)

The `window` object is an exception to this rule, as it doesn't need to be pre-indexed.

### `@timeout` `@interval`

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

### `@if`

`'key@if:functionReference: 'value'`
The corresponding value is assigned if the specified `:functionReference` function returns `true`.
See `given()` for more info about references.

### `@for`

-- EXPERIMENTAL --

`'key@for:arrayReference: 'value'`
The corresponding value is assigned a number of times equal to the length of `:arrayReference`
See `given()` for more info about references.