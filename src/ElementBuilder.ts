import ElementBuilderAnimation from './ElementBuilderAnimation'
import ElementBuilderError from './ElementBuilderError'
import * as Check from './Check'
import * as Parse from './Parse'
import * as Setter from './Setter'

const ElementBuilder = function(this: any, source: Element | string)
{
    if (!Check.isValidSource(source)) {
        new ElementBuilderError('Invalid source input', source)
        return
    }

    const element: Element = Setter.element(source)
    const referenceMap: ReferenceMap = new Map([['window', window]])

    return {
        el: element,
        element: element,
        htmlContent: function() { return this.element.innerHTML },
        isElementBuilder: true,
        referenceMap: referenceMap,

        getRef: function(query: string): any {
            return this.referenceMap.get(query) || (new ElementBuilderError('nul!', query), false)
        },

        given: function(...references: ReferencePair[]) {
            const register = (ref: ReferencePair | Function) => {
                if (Check.isArray(ref)) {
                    const [target, id] = ref as ReferencePair
                    this.referenceMap.set(id, target)
                } else if (Check.isNamedFunction(ref)) {
                    this.referenceMap.set((ref as Function).name, ref)
                } else new ElementBuilderError('Invalid given() argument input', ref)
            }

            references.forEach(register)
            return this
        },

        into: function( targetInput: EBTarget, { at = -1, times = 1 }: IntoOptions = {}) {
            if (!Check.isValidTarget(targetInput)) return

            const getTarget = (target: EBTarget) => {
                return Check.isElementBuilder(target)
                    ? (target as ElementBuilderObject).element as Element
                    : target as Element
            } 

            const insertAt = (element: Element, target: Element, n: number) => {
                if (!Check.isNumber(n)) return

                const getPos = (n: number, length: number) => {
                    return n < 0
                        ? Math.max(length - 1 + n, 0)
                        : Math.min(length - 1, n)
                }

                const childList = target.children
                const p = getPos(n, childList.length)

                if (childList.length === 0 || childList.length - 1 === p) target.appendChild(element)
                else childList[p].insertAdjacentElement('beforebegin', element)
            }

            const target = getTarget(targetInput)
            const p = Math.floor(Number(at))
            Number.isNaN(p) ? target.appendChild(element) : insertAt(element, target, p)

            // if (!Check.isNumber(times) || times < 1) {
            //     new ElementBuilderError('Invalid times value (whole number >= 1 expected)', times)
            // }
            // else if (times === 1) {
            //     target.appendChild(element)
            // }

            // /**
            //  * FIX: elements appended but settings not applied
            //  */
            // else {
            //     console.log(times)
            //     const clone = () => element.cloneNode(true)
            //     ;[...Array(Math.floor(times))].forEach(() => target.appendChild(clone()))
            // }

            this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'))

            return this
        },

        after: function(node: Element) {
            node.insertAdjacentElement('afterend', element)

            this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'))

            return this
        },

        before: function(node: Element) {
            node.insertAdjacentElement('beforebegin', element)

            this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'))

            return this
        },

        replace: function(node: Node) {
            node.parentNode?.replaceChild(element, node)

            this.element.dispatchEvent(new CustomEvent('ElementBuilderInsert'))
        
            return this
        },

        swap: async function(
            swapped: HTMLElement,
            animate?: (boolean | { animationDuration?: number, animationType?: string })
        ) {            
            if (!Check.isValidSwap(element, swapped)) return

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

        out: function() {
            element.parentNode?.removeChild(element)
        },

        dispatch: function(nameInput: string, emitterInput?: any) {
            const emitter = !emitterInput
                ? this.element 
                : 'isElementBuilder' in emitterInput
                    ? emitterInput.element
                    : emitterInput

            
            emitter.dispatchEvent(new CustomEvent(nameInput))
            console.log(emitter, nameInput)
            return this
        },

        set: function(options: SetOptions = {}) {
            const Options: FunctionObject = {
                properties: Setter.Properties,
                attributes: Setter.Attributes,
                listeners: Setter.Listeners,
                children: Setter.Children,
            }

            const setOption = (name: any, value: any) => {
                if (!(name in Options)) return

                Options[name].call(this, value)
            }

            Setter.process.call(this, options, setOption)

            this.element.dispatchEvent(new CustomEvent('elbuilderset'))

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

        setChildren: function(children: EBChild | EBChild[] | Function) {
            Setter.Children.call(this, children)

            return this
        },

        setStyles: function(styles: StringObject | Function) {
            const value = Parse.getComputedValue.call(this, styles)
            Setter.Styles.call(this, value)

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

        setStyle: function(styles: StringObject = {}) {
            if (element instanceof HTMLElement) {
                Object.assign((element as HTMLElement).style, styles)
            }

            return this
        },

        textContent: function(input: string) {
            element.textContent = input

            return this
        },

        toString: function() {
            return element.outerHTML
        },

        /**
         * TODO: add filter parameter
         */
        count: function() {
            return this.element.childNodes.length
        }
    }
}

export default ElementBuilder