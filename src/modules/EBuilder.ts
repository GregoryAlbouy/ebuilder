import EBuilderAnimation from './EBuilderAnimation'
import EBuilderError from './EBuilderError'
import * as Check from '../utils/Check'
import * as DOM from '../utils/DOM'
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
    const cloneList: Element[] = []

    return {
        get el() { return element },
        get element() { return element },
        get htmlContent() { return this.element.innerHTML },
        get count() { return this.element.childNodes.length },
        get children() { return this.element.childNodes },
        isEBuilder: true,
        referenceMap: referenceMap,
        cloneList: cloneList,

        getRef: function(query?: string): any {
            return query ? this.referenceMap.get(query) : (new EBuilderError('nul!', query), false)
        },

        given: function(...references: ReferencePair[]) {
            const register = (ref: ReferencePair | Function) => {
                if (Check.isArray(ref)) {
                    const [target, id] = ref as unknown as ReferencePair // come back here later
                    this.referenceMap.set(id, target)
                } else if (Check.isNamedFunction(ref)) {
                    this.referenceMap.set((ref as Function).name, ref)
                } else new EBuilderError('Invalid given() argument input', ref)
            }

            references.forEach(register)
            return this
        },

        into: function(targetInput: EBTarget, { at = -1, times = 1 }: IntoOptions = {}) {
            if (!Check.isValidTarget(targetInput) || !Check.isNumber(times)) return

            // use Parse.getTrueElement() instead
            const getTarget = (target: EBTarget) => {
                return Check.isEBObject(target)
                    ? (target as EBObject).element as Element
                    : target as Element
            }
            
            DOM.insertV1.call(this, this.element, getTarget(targetInput), at, times)
            
            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

            return this
        },

        after: function(inputTarget: Element | EBObject) {
            const target = Parse.getTrueElement(inputTarget)

            target.insertAdjacentElement('afterend', element)

            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

            return this
        },

        before: function(inputTarget: Element | EBObject) {
            const target = Parse.getTrueElement(inputTarget)

            target.insertAdjacentElement('beforebegin', element)

            this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

            return this
        },

        replace: function(inputTarget: Element | EBObject) {
            const target = Parse.getTrueElement(inputTarget)

            target.parentNode?.replaceChild(element, target)

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

        out: function(all?: boolean) {
            element.parentNode?.removeChild(element)
            if (all) this.clearClones

            return this
        },

        clearClones: function() {
            this.cloneList.forEach((clone) => clone.parentNode?.removeChild(clone))

            return this
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
                style: Setter.Style
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

        setStyle: function(style: StringObject | Function) {
            // const value = Parse.getComputedValue.call(this, style)
            Setter.Style.call(this, style)

            return this
        },

        setClasses: function(...classes: (string | string[])[]) {
            element.classList.add(...([] as string[]).concat(...classes))

            return this
        },
        
        // + setContent(options = { add?, remove?,  })
        setContent: function(input: string | Element | EBObject | Function) {
            const value = Parse.getComputedValue.call(this, input)
            this.element.innerHTML = `${value}`
            // DOM.insert.call(this, input, element, at, 1)

            return this
        },

        toString: function() {
            return element.outerHTML
        },

        // setElement: function(value: Element) {
        //     this.element = value
        //     this.el = value
        // }
    }
}

export default EBuilder