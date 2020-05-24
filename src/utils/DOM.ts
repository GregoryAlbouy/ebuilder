import * as Check from './Check'
import * as Parse from './Parse'

/**
 * In progress
 */
// export function insert(
//     this: EBObject,
//     input: string | Element | EBObject | Function,
//     target: Element,
//     at?: number | string,
//     times?: number
// ) {
//     const posFromString = (at: string, childList: HTMLCollection) => {
//         const posMap: NumberObject = {
//             start: 0,
//             middle: Math.floor(childList.length / 2),
//             end: childList.length
//         }

//         return at in posMap ? posMap[at] : posMap.end
//     }

//     const safePos = (n: number, length: number) => {
//         return n < 0
//             ? Math.max(length + (n + 1), 0)
//             : Math.min(length, n)
//     }
    
//     const safeTimes = times ? Math.abs(Math.floor(times)) : 1
//     const computedInput = Parse.getComputedValue.call(this, input)
//     const fragment = Parse.getFragmentFrom(computedInput, safeTimes)
//     const childList = target.children
//     const n = Check.isString(at) ? posFromString(at, childList) : Math.floor(at as number)
//     const p = safePos(n, childList.length)

//     // console.log(
//     //     `input: ${input}\n`,
//     //     `computedInput: ${computedInput}\n`,
//     //     `targetLength: ${childList.length}\n`,
//     //     `at: ${at}\n`,
//     //     `position: ${n}\n`,
//     //     `safePosition: ${p}\n`,
//     //     `times: ${times}\n`,
//     //     `fragment:`, fragment
//     // )

//     this.setElement(fragment.firstElementChild!) // needs checks

//     if (childList.length === 0 || childList.length === p) {
//         target.appendChild(fragment)
//     } 
//     else {
//         target.insertBefore(fragment, childList[p])
//     }
// }

export function insertV1(
    this: EBObject,
    input: Element,
    target: Element,
    at?: number | string,
    times?: number
) {
    const posFromString = (at: string, childList: HTMLCollection) => {
        const posMap: NumberObject = {
            start: 0,
            middle: Math.floor(childList.length / 2),
            end: childList.length
        }

        return at in posMap ? posMap[at] : posMap.end
    }

    const safePos = (n: number, length: number) => {
        return n < 0
            ? Math.max(length + (n + 1), 0)
            : Math.min(length, n)
    }
    
    let safeTimes = times ? Math.abs(Math.floor(times)) : 1
    const clones = [...Array(safeTimes - 1)].map(() => input.cloneNode(true))
    const childList = target.children
    const n = Check.isString(at) ? posFromString(at, childList) : Math.round(at as number)
    const p = safePos(n, childList.length)

    this.cloneList.push(...clones as Element[])

    // needs refacto
    if (childList.length === 0 || childList.length === p) {
        target.appendChild(input)
        clones.forEach((clone) => target.appendChild(clone))
    } 
    else {
        const childRef = childList[p]
        target.insertBefore(input, childRef)
        clones.forEach((clone) => target.insertBefore(clone, childRef))
    }
}