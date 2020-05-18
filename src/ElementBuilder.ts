/**
 * Helper function that allows to fully create and set an element
 * (attributes, class, listeners...) and append it anywhere with a single
 * declaration, thanks to its chaining ability.
 * 
 * TODO: use class instead and use parameter decorators for checks
 * TODO: add .into(xxx, { at: 3 })
 * TODO: add execution order/priority manager in .set(), e.g:
 * ElementBuilder('a').set({})
 */

import ElementBuilderAnimation from './ElementBuilderAnimation'
import ElementBuilderError from './ElementBuilderError'
import * as RuleManager from './RuleManager'
import * as Check from './utils/Check'
import * as Setter from './utils/Setter'

const ElementBuilder = function(this: any, source: Element | string)
{
    if (!Check.isValidSource(source)) {
        new ElementBuilderError('Invalid source input (string or Element expected)', source)
        return
    }

    const element: Element = Setter.sourceElement(source)
    const referenceMap: ReferenceMap = new Map()

    return {
        element: element,
        html: element ? element.outerHTML : undefined,
        isElementBuilder: true,
        referenceMap: referenceMap,

        given: function(...references: ReferencePair[]) {
            references.forEach(([target, id]) => {
                this.referenceMap.set(id, target)
            })
            return this
        },

        into: function(node: Node, { times = 1 }: { times?: number } = {}) {
            if (!Check.isTypeOf(times, 'number') || times < 1) {
                new ElementBuilderError('Invalid times value (whole number >= 1 expected)', times)
            }
            else if (times === 1) {
                node.appendChild(element)
            }

            /**
             * FIX: elements appended but settings not applied
             */
            else {
                console.log(times)
                const clone = () => element.cloneNode(true)
                ;[...Array(Math.floor(times))].forEach(() => node.appendChild(clone()))
            }

            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'))

            return this
        },

        after: function(node: Element) {
            node.insertAdjacentElement('afterend', element)

            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'))

            return this
        },

        before: function(node: Element) {
            node.insertAdjacentElement('beforebegin', element)

            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'))

            return this
        },

        replace: function(node: Node) {
            node.parentNode?.replaceChild(element, node)

            window.dispatchEvent(new CustomEvent('ElementBuilderInsert'))
        
            return this
        },

        dispatch: function(eventName: string) {
            window.dispatchEvent(new CustomEvent(eventName))

            return this
        },

        set: function(options: SetOptions = {}) {
            const processed = RuleManager.processSourceObject(options)

            const Options: FunctionObject = {
                properties: (value: any) => Setter.Properties.call(this, value),
                attributes: (value: any) => Setter.Attributes.call(this, value),
                listeners: (value: any) => Setter.Listeners.call(this, value),
                children: (value: any) => Setter.Children.call(this, value)
            }

            const setterCallback = (name: any, value: any) => {
                if (!(name in Options)) return

                Options[name](value)
            }

            RuleManager.assignWithSetter.call(this, options, setterCallback)

            window.dispatchEvent(new CustomEvent('ElementBuilderSet'))

            return this
        },

        setAttributes: function(attributes: StringObject) {
            Setter.Attributes.call(this, attributes)
            
            return this
        },

        setProperties: function(properties: AnyObject) {
            Setter.Properties.call(this, properties)

            return this
        },

        setListeners: function(listeners: EventTuple | EventTuple[]) {
            Setter.Listeners.call(this, listeners)

            return this
        },

        setChildren: function(children: ValidChild | ValidChild[]) {
            Setter.Children.call(this, children)

            return this
        },

        setStyles: function(styles: StringObject | Function) {
            Setter.Styles.call(this, styles)

            return this
        },

        // todo: (classes: string | array | object)
        // object: { add, remove, toggle }
        // setClasses: (classes: string[] | string, ...args: string[]) => {
        //     typeOf(classes) === 'array' ? element.classList.add(...classes)
        //                                 : element.classList.add(classes)

        //     return this
        // },

        setClasses: function(...classes: (string | string[])[]) {
            element.classList.add(...([] as string[]).concat(...classes))

            return this
        },

        swap: async function(
            swapped: HTMLElement,
            animate?: (boolean | { animationDuration?: number, animationType?: string })
        ) {
            const elementsAreValid = (): boolean => {
                return (
                    element instanceof HTMLElement && swapped instanceof HTMLElement
                    && (!!element.parentNode && !!swapped.parentNode)
                    && element !== swapped
                )
            }
            
            if (!elementsAreValid()) return

            if (animate) {
                const ms = typeof animate === 'object' && animate.animationDuration
                    ? animate.animationDuration
                    : undefined

                await new ElementBuilderAnimation(ms).swap2(element as HTMLElement, swapped)
            }

            const dummy = document.createElement('div')
            element.parentNode!.replaceChild(dummy, element)
            swapped.parentNode!.replaceChild(element, swapped)
            dummy.parentNode!.replaceChild(swapped, dummy)
            return this
        },

        setStyle: function(styles: StringObject = {}) {
            if (element instanceof HTMLElement) {
                Object.assign((element as HTMLElement).style, styles)
            }

            return this
        },

        toString: function() {
            return element.outerHTML
        }
    }
}

export default ElementBuilder