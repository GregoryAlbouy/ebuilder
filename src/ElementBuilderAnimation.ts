import ElementBuilderError from './ElementBuilderError'

export default class ElementBuilderAnimation
{
    duration: number = 200
    then: Thenable = {
        then: (resolve: any) => setTimeout(resolve, this.duration)
    }


    constructor(duration?: number)
    {
        if (duration && duration < 0) throw new ElementBuilderError('Invalid animation duration', name)
        else this.duration = duration || this.duration
    }

    /*
     * Using css transitions
     */
    swap(a: HTMLElement, b: HTMLElement)
    {
        const offset: Vector = {
            h: b.getBoundingClientRect().left - a.getBoundingClientRect().left,
            v: b.getBoundingClientRect().top - a.getBoundingClientRect().top
        };

        [a, b].map((elt: HTMLElement, ) => elt.style.transition = `transform ${this.duration}ms`)

        a.style.transform = `translate(${offset.h}px, ${offset.v}px)`
        b.style.transform = `translate(${-offset.h}px, ${-offset.v}px)`

        setTimeout(() => {
            [a, b].forEach((elt: HTMLElement) => {
                elt.style.transform = ''
                elt.style.transition = ''
            })
        }, this.duration)
    }

    swap2(a: HTMLElement, b: HTMLElement): Thenable
    {
        const dist: Vector = {
            x: b.getBoundingClientRect().left - a.getBoundingClientRect().left,
            y: b.getBoundingClientRect().top - a.getBoundingClientRect().top
        }

        const vOffsetMax = a.getBoundingClientRect().height / 2

        const step = (timestamp: number) => {
            progress = (timestamp - start) / this.duration
            if (progress > 1) progress = 1 
            dy = progress <= .5 ? vOffsetMax * progress * 2 : vOffsetMax * (1 - progress) * 2

            a.style.transform = `translate(${dist.x * progress}px, ${dist.y * progress + dy}px)`
            b.style.transform = `translate(${-dist.x * progress}px, ${-dist.y * progress - dy}px)`

            progress < 1 ? requestAnimationFrame(step) : end()
        }

        const end = () => {
            [a, b].forEach((elt) => elt.style.transform = '')
        }

        let
            dy = 0,
            progress = 0,
            start = performance.now()

        requestAnimationFrame(step)

        return this.then
    }
}