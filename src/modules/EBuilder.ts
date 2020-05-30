import EBuilderAnimation from './EBuilderAnimation'
import EBuilderError from './EBuilderError'
import * as Check from '../utils/Check'
import * as DOM from '../utils/DOM'
import * as Parse from '../utils/Parse'
import * as Setter from '../utils/Setter'

class EBuilder
{
    isEBuilder = true
    element: Element
    referenceMap: ReferenceMap
    cloneList: Element[]

    constructor(source: string | Element) {
        if (!Check.isValidSource(source)) {
            new EBuilderError('Invalid source input', source)
            // return
        }
    
        this.element = Setter.element(source)
        this.referenceMap = new Map([['window', window]])
        this.cloneList = []
    }

    get el() { return this.element }
    get htmlContent() { return this.element.innerHTML }
    get count() { return this.element.childNodes.length }
    get children() { return this.element.childNodes }


    getRef(query?: string): any {
        return query ? this.referenceMap.get(query) : (new EBuilderError('nul!', query), false)
    }

    given(...references: ReferencePair[]) {
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
    }

    into(targetInput: EBTarget, { at = -1, times = 1 }: IntoOptions = {}) {
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
    }

    after(inputTarget: Element | EBObject) {
        const target = Parse.getTrueElement(inputTarget)

        target.insertAdjacentElement('afterend', this.element)

        this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

        return this
    }

    before(inputTarget: Element | EBObject) {
        const target = Parse.getTrueElement(inputTarget)

        target.insertAdjacentElement('beforebegin', this.element)

        this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))

        return this
    }

    replace(inputTarget: Element | EBObject) {
        const target = Parse.getTrueElement(inputTarget)

        target.parentNode?.replaceChild(this.element, target)

        this.element.dispatchEvent(new CustomEvent('ebuilderinsert'))
    
        return this
    }

    async swap(
        swapped: HTMLElement,
        animate?: (boolean | { animationDuration?: number, animationType?: string })
    ) {            
        if (!Check.isValidSwap(this.element, swapped)) return

        if (animate) {
            const ms = typeof animate === 'object' && animate.animationDuration
                ? animate.animationDuration
                : undefined

            await new EBuilderAnimation(ms).swap2(this.element as HTMLElement, swapped)
        }

        const dummy = document.createElement('div')
        this.element.parentNode!.replaceChild(dummy, this.element)
        swapped.parentNode!.replaceChild(this.element, swapped)
        dummy.parentNode!.replaceChild(swapped, dummy)

        return this
    }

    out(all?: boolean) {
        this.element.parentNode?.removeChild(this.element)
        if (all) this.clearClones

        return this
    }

    clearClones() {
        this.cloneList.forEach((clone) => clone.parentNode?.removeChild(clone))

        return this
    }

    dispatch(nameInput: string, emitterInput?: any) {
        const emitter = !emitterInput
            ? this.element 
            : 'isEBuilder' in emitterInput
                ? emitterInput.element
                : emitterInput

        
        emitter.dispatchEvent(new CustomEvent(nameInput))
        return this
    }

    set(options: SetOptions = {}) {
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
    }

    setAttributes(attributes: StringObject | Function) {
        Setter.Attributes.call(this, attributes)
        
        return this
    }

    setProperties(properties: AnyObject | Function) {
        Setter.Properties.call(this, properties)

        return this
    }

    setListeners(listeners: EventTuple | EventTuple[] | Function) {
        Setter.Listeners.call(this, listeners)

        return this
    }

    setChildren(children: EBChild | EBChild[] | Function) {
        Setter.Children.call(this, children)

        return this
    }

    setStyle(style: StringObject | Function) {
        Setter.Style.call(this, style)

        return this
    }

    setClasses(...classes: (string | string[])[]) {
        this.element.classList.add(...([] as string[]).concat(...classes))

        return this
    }
    
    // + setContent(options = { add?, remove?,  })
    setContent(input: string | Element | EBObject | Function) {
        const value = Parse.getComputedValue.call(this, input)
        this.element.innerHTML = `${value}`
        // DOM.insert.call(this, input, this.element, at, 1)

        return this
    }

    toString() {
        return this.element.outerHTML
    }
}

export default EBuilder