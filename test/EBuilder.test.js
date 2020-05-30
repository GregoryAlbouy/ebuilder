/**
 * Fly you fools! I haven't cleaned this place yet.
 */

const Test = {
    constructor: (errors) => {
        console.log('---- MAIN PARAMETER ----')

        const log = (v, i) => console.log(`${i}:`, v)

        if (!errors) {
            console.log('-- VALID --')

            const validEntries = [
                new EBuilder('div').into(document.body),
                new EBuilder(document.createElement('div')),
                new EBuilder(new EBuilder('div').element),
                new EBuilder('@select:div:nth-of-type(3)'),
                new EBuilder('@html:<div><span></span></div>'),
                new EBuilder('<div><span></span></div>'),
                `${new EBuilder('<ul><li></ul>')}` // toString() -> elt.outerHTML
            ]

            validEntries.forEach(log)

        } else {
            console.log('-- ERRORS --')

            const invalidEntries = [
                new EBuilder(true),
                new EBuilder(42),
                new EBuilder([]),
                new EBuilder({}),
                new EBuilder(() => {})
            ]

            invalidEntries.forEach(log)
        }
    },

    setters: (errors) => {
        console.log('---- SETTERS ----')

        const ul = new EBuilder('ul').into(document.body)

        if (!errors) {
            console.log('-- VALID --')

            ul.set({
                attributes: {
                    'style@interval:1000': () => `background: hsl(${Math.floor(90*Math.random())}, 50%, 50%); transition: 1s linear`,
                    onclick: 'alert("clicked")',
                    'data-shit': function() { console.log(this); return null }
                },
                properties: {
                    'innerHTML@on:keydown': function() { return this.element.innerHTML + `<li>I have ${this.element.childNodes.length + 1} children</li>`},
                },
                'listeners@timeout:2000': [
                    ['mouseover', function() { this.style.boxShadow = '0 0 2rem rgba(0,0,0,.4)' }],
                    ['mouseleave', function() { ul.setStyle({ boxShadow: null }) }],
                ],
                'children@once:ALLYOURBASEAREBELONGTOUS': () => [
                    '<li class="first"><span>Added first !</span></li>',
                    document.createElement('li'),
                    new EBuilder('li').set({ children: 3 }),
                    new EBuilder('li').element,
                    new EBuilder('li')
                        .set({ children: document.createElement('p') })
                        .element
                ]
            })
            .setAttributes({ class: 'added-after', tabIndex: '1' })
            .setProperties({ innerHTML: ul.element.innerHTML + '<!-- added after -->' })
            .setChildren(new EBuilder('li').setChildren('added after'))
            .dispatch('ALLYOURBASEAREBELONGTOUS')
            .setListeners(['keydown', () => { console.log('event added after') }])


        } else {
            console.log('-- ERRORS --')
            
        }
    },

    insertions: (errors) => {
        console.log('---- INTO(), BEFORE(), AFTER(), SWAP() ----')
        console.log([...Array(5)].map(() => '<li>child</li>'))
        if (!errors) {
            console.log('-- VALID --')

            const elList = new EBuilder('ol').into(document.body)
                .setChildren(() => [...Array(5)].map(() => '<li>child</li>'))

            const stranger = new EBuilder('li')
                .setContent('<b>stranger!</b>')
                .into(elList, { at: 'start', times: 3 })
                .setStyle({ color: 'red' })
                .into(elList, { at: 'middle', times: 2 })
                .setStyle({ color: 'green' })
                .into(elList, { at: -1 })
                .out(true)
                .into()

        } else {
            console.log('-- ERRORS --')
        }
    },

    rules: (errors) => {
        console.log('---- @-RULES ----')
        console.log(document.body)

        const isLucky = () => Date.now() % 2

        const button = new EBuilder('button').into(document.body).setChildren('my button')
        const array = ['wesh', true, 42]


        const div = new EBuilder('div')
            .into(document.body)
            .given(isLucky, [array, 'myArray'], [button, 'myButton'])

            console.log(div.getRef('isLucky'))

        if (!errors) {
            console.log('-- VALID --')

            div.set({
                attributes: { style: 'width:100px;height:100px;background:black;color:#FFF' },
                // 'children@for:myArray': function(v, i, a) {
                //     return `<p>${i}: ${v}</p>`
                // }
                'children@if:isLucky': 'ROUGE'
            })
            .setStyle({
                'background@if:isLucky': 'red',
                'transform@on:click#myButton': () => `scale(${1 + 0.2 * Math.random()})`
            })
            // .setStyle({ background: () => isLucky() ? 'red' : 'black' })


        } else {
            console.log('-- ERRORS --')
        }
    }
}

// Test.constructor(false)
// Test.constructor(true)

// Test.setters(false)
// Test.setters(true)

// Test.insertions(false)
// Test.insertions(true)

Test.rules(false)
// Test.rules(true)

const counter = new EBuilder('span')
    .setProperties({ 'textContent@interval:1000': ((i) => () => ++i)(0) })
    .into(document.body)

// new EBuilder('ul').setProperties({
//     'innerHTML@on:click#window': (self) => self.htmlContent + `<li>I have ${self.count} children.</li>`
// }).into(document.body)

// const crazyList = new EBuilder('ul').setProperties({
//     'innerHTML@interval:1000': (self) => self.htmlContent + `<li>I have ${self.count + 1} children.</li>`
// }).into(document.body)

// new EBuilder('<button>Stop it!</button>')
//     .setProperties({ onclick: () => () => clearInterval(crazyList.interval) })
//     .before(crazyList)

// new EBuilder('<button>click me</button>').setProperties({
//     'textContent@on:click': () => Math.random() < .5 ? 'win!' : 'loose!',
//     'innerHTML@on:mouseleave': 'Hey <strong>come back</strong>!'
// }).into(document.body)

// new EBuilder('button').into(document.body).setListeners(['click', function(e) { console.log(e,this)}])





new EBuilder('ul')
    .setProperties({ 'innerHTML@once:hi-there': (self) => self.htmlContent + '<li>2</li>' })
    .setChildren('<li>1</li>')
    .dispatch('hi-there')
    .into(document.body)