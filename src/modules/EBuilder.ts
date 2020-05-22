import EBuilderAnimation from './EBuilderAnimation'
import EBuilderError from './EBuilderError'
import * as Check from '../utils/Check'
import * as Parse from '../utils/Parse'
import * as Setter from '../utils/Setter'

const EBuilder = function(this: any, source: Element | string)
{
    if (!Check.isValidSource(source)) {
        new EBuilderError('Invalid source input', source)
        return
    }

    const element: Element = Setter.element(source)
    const referenceMap: ReferenceMap = new Map([['window', window]])

    return {
        el: element,
        element: element,
        htmlContent: function() { return this.element.innerHTML },
        isEBuilder: true,
        referenceMap: referenceMap,

        getRef: function(query: string): any {
            return this.referenceMap.get(query) || (new EBuilderError('nul!', query), false)
        },

        given: function(...references: ReferencePair[]) {
            const register = (ref: ReferencePair | Function) => {
                if (Check.isArray(ref)) {
                    const [target, id] = ref as ReferencePair
                    this.referenceMap.set(id, target)
                } else if (Check.isNamedFunction(ref)) {
                    this.referenceMap.set((ref as Function).name, ref)
                } else new EBuilderError('Invalid given() argument input', ref)
            }

            references.forEach(register)
            return this
        },

        into: function( targetInput: EBTarget, { at = -1, times = 1 }: IntoOptions = {}) {
            if (!Check.isValidTarget(targetInput)) return

            const getTarget = (target: EBTarget) => {
                return Check.isEBuilder(target)
                    ? (target as EBObject).element as Element
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

            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

            return this
        },

        after: function(node: Element) {
            node.insertAdjacentElement('afterend', element)

            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

            return this
        },

        before: function(node: Element) {
            node.insertAdjacentElement('beforebegin', element)

            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

            return this
        },

        replace: function(node: Node) {
            node.parentNode?.replaceChild(element, node)

            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))
        
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

                await new EBuilderAnimation(ms).swap2(element as HTMLElement, swapped)
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
                : 'isEBuilder' in emitterInput
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

            this.element.dispatchEvent(new CustomEvent('ebuilderset'))

            return this
        },

        setAttributes: function(attributes: StringObject | Function) {
            Setter.Attributes.call(this, attributes)
            
            return this
        },

        setProperties: function(properties: AnyObject | Function) {
            Setter.Properties.call(this, properties)

            return this
        },

        setListeners: function(listeners: EventTuple | EventTuple[] | Function) {
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

        setClasses: function(...classes: (string | string[])[]) {
            element.classList.add(...([] as string[]).concat(...classes))

            return this
        },
        
        textContent: function(input: string) {
            element.textContent = input

            return this
        },

        toString: function() {
            return element.outerHTML
        },

        count: function() {
            return this.element.childNodes.length
        }
    }
}

export default EBuilder