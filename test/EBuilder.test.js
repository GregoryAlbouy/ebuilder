
const Test = {
    constructor: (errors) => {
        console.log('---- MAIN PARAMETER ----')

        const log = (v, i) => console.log(`${i}:`, v)

        if (!errors) {
            console.log('-- VALID --')

            const validEntries = [
                EBuilder('div').into(document.body),
                EBuilder(document.createElement('div')),
                EBuilder(EBuilder('div').element),
                EBuilder('@select:div:nth-of-type(3)'),
                EBuilder('@html:<div><span></span></div>'),
                EBuilder('<div><span></span></div>'),
                `${EBuilder('<ul><li></ul>')}` // toString() -> elt.outerHTML
            ]

            validEntries.forEach(log)

        } else {
            console.log('-- ERRORS --')

            const invalidEntries = [
                EBuilder(true),
                EBuilder(42),
                EBuilder([]),
                EBuilder({}),
                EBuilder(() => {})
            ]

            invalidEntries.forEach(log)
        }
    },

    setters: (errors) => {
        console.log('---- SETTERS ----')

        const ul = EBuilder('ul').into(document.body)

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
                    EBuilder('li').set({ children: 3 }),
                    EBuilder('li').element,
                    EBuilder('li')
                        .set({ children: document.createElement('p') })
                        .element
                ]
            })
            .setAttributes({ class: 'added-after', tabIndex: '1' })
            .setProperties({ innerHTML: ul.element.innerHTML + '<!-- added after -->' })
            .setChildren(EBuilder('li').setChildren('added after'))
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

            const elList = EBuilder('ol').into(document.body)
                .setChildren(() => [...Array(5)].map(() => '<li>child</li>'))

            const stranger = EBuilder('li')
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

        const button = EBuilder('button').into(document.body).setChildren('my button')
        const array = ['wesh', true, 42]


        const div = EBuilder('div')
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

// Test.rules(false)
// Test.rules(true)


// const div = EBuilder('div')
//     .setStyle(() => ({ width: '100px', height: '100px', background: '#39C' }))
//     .into(document.body, { times: 3 })

// console.log(div)



/**
 * README demos
 */

// const items = ['one', 'due', 'trois', 'cuattro', 'fünf']

// // Create a list containing a list-item for each value in items
// const ol = document.createElement('ol')
// ol.classList.add('list', 'list-1')
// for (const [i, item] of items.entries()) {
//     const li = document.createElement('li')
//     li.classList.add('item')
//     li.textContent = item
//     li.addEventListener('click', function() { this.remove() })
//     ol.appendChild(li)
// }
// document.body.appendChild(ol)

// EBuilder('ol').set({
//     attributes: { class: 'list list-2' },
//     children: () => items.map((item, i, arr) => EBuilder('li').set({
//         attributes: { class: 'item' },
//         properties: { textContent: item },
//         listeners: function() { return ['click', () => this.swap(document.querySelector('.list-2 li'), true) ]}
//     }))
// }).into(document.body).before(ol)


// const elList = EBuilder('ol').into(document.body)

// elList.set({
//     properties: {
//         'innerHTML@once:hi-there': () => elList.el.innerHTML + '<li>2</li>'
//     }
// }).setChildren('<li>1</li>').dispatch('hi-there')

// const myButton = EBuilder('button').into(document.body)

// EBuilder('p')
//     .given([ myButton, 'buttonRef' ])
//     .setProperties({ 'textContent@once:click#buttonRef': 'Hello!' })
//     .into(document.body)

// const colors = EBuilder('div')
// colors.setStyle({
//     width: '200px',
//     height: '200px',
//     transition: 'background 1s',
//     'background@interval:1000': () => `hsl(${360 * Math.random()}, 50%, 50%)`
// })
// document.body.innerHTML += colors

// const elList2 = EBuilder('ul').into(document.body)
// elList2.setProperties({
//     'innerHTML@on:click#window': elList2.el.innerHTML + `<p>I have ${elList2.count()} children.</p>`
// })

// const elList3 = EBuilder('ul').into(document.body)
// elList3.setProperties({
//     'innerHTML@interval:1000': () => elList3.el.innerHTML + `<li>I have ${elList3.count() + 1} children.</li>`
// })

// EBuilder('button').setProperties({ onclick: () => () => clearInterval(elList3.interval) }).into(document.body)

// EBuilder('<button>click me</button>').setProperties({
//     'textContent@on:click': () => Math.random() < .5 ? 'win!' : 'loose!',
//     'innerHTML@on:mouseleave': 'Hey <strong>come back</strong>!'
// }).into(document.body)

// EBuilder('h2').setContent('Beware of the crazy button').set({
//     style: {
//         borderLeft: '4px solid #333',
//         font: '2rem sans-serif'
//     }
// }).before(EBuilder('@select:button'))


// const p = EBuilder('p').setContent('Lopsum Irem').into(document.body, { times: 3 })

// const title = EBuilder('<h1>Hello <strong>World</strong>!</h1>').before(p)

// const button = EBuilder('button').set({
//     style: {
//         'background@interval:500': () => `hsl(360 * Math.random(), 50%, 50%`
//     }
// }).into(document.body)




// EBuilder('button').into(document.body).setListeners(['click', function(e) { console.log(e,this)}])



// const numbers = [ 'one', 'dos', 'trois', 'quattro'  ]

// // renders only even numbers
// EBuilder('ul').setChildren(numbers.map((v, i) => i % 2 ? `<li>${v}</li>` : ''))
//     .into(document.body)



EBuilder('<button>click me</button>').setProperties({
    'textContent@on:click': () => Math.random() < .5 ? 'win!' : 'loose!',
    'innerHTML@on:mouseleave': 'Hey <strong>come back</strong>!'
}).into(document.body)