const Test = {
    constructor: (errors) => {
        console.log('---- MAIN PARAMETER ----')

        if (!errors) {
            console.log('-- VALID --')

            console.log(ElBuilder('div'))
            console.log(ElBuilder(document.createElement('div')))
            console.log(ElBuilder(ElBuilder('div').element))
            console.log(`${ElBuilder('div')}`) // toString() -> elt.outerHTML
        } else {
            console.log('-- ERRORS --')

            console.log(ElBuilder(true))
            console.log(ElBuilder(42))
            console.log(ElBuilder([]))
            console.log(ElBuilder({}))
            console.log(ElBuilder(() => {}))
        }
    },

    setters: (errors) => {
        console.log('---- SETTERS ----')

        const ul = ElBuilder('ul').into(document.body)

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
                    ElBuilder('li').set({ children: 3 }),
                    ElBuilder('li').element,
                    ElBuilder('li')
                        .set({ children: document.createElement('p') })
                        .element
                ]
            })
            .setAttributes({ class: 'added-after', tabIndex: '1' })
            .setProperties({ innerHTML: ul.element.innerHTML + '<!-- added after -->' })
            .setChildren(ElBuilder('li').setChildren('added after'))
            .dispatch('ALLYOURBASEAREBELONGTOUS')
            .setListeners(['keydown', () => { console.log('event added after') }])


        } else {
            console.log('-- ERRORS --')
            
        }
    },

    insertions: (errors) => {
        console.log('---- INTO(), BEFORE(), AFTER(), SWAP() ----')

        if (!errors) {
            console.log('-- VALID --')

        } else {
            console.log('-- ERRORS --')
        }
    },

    rules: (errors) => {
        console.log('---- @-RULES ----')

        const isLucky = () => Math.floor(2 * Math.random()) % 2 === 0
        const isTrue = () => true
        const isFalse = () => false

        const div = ElBuilder('div')
            .into(document.body)
            .given([isLucky, 'isLucky'], [isTrue, 'isTrue'], [isFalse, 'isFalse'])

        if (!errors) {
            console.log('-- VALID --')

            div.set({
                attributes: { style: 'width:100px; height: 100px; background: black' }
            })
            .setStyles({ 'background@if:isLucky': 'red' })

        } else {
            console.log('-- ERRORS --')
        }

    }
}

// Test.constructor(false)
// Test.constructor(true)

Test.setters(false)
// Test.setters(true)

// Test.insertions(false)
// Test.insertions(true)

Test.rules(false)
// Test.rules(true)



/**
 * README demos
 */

// const items = ['one', 'due', 'trois', 'cuattro', 'fünf']

// Create a list containing a list-item for each value in items
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

// ElBuilder('ol').set({
//     attributes: { class: 'list list-2' },
//     children: () => items.map((item, i, arr) => ElBuilder('li').set({
//         attributes: { class: 'item' },
//         properties: { textContent: item },
//         listeners: function() { return ['click', () => this.swap(document.querySelector('.list-2 li'), true) ]}
//     }))
// }).into(document.body).before(ol)