import * as Check from './Check'

/**
 * In progress
 */
export function insert(
    input: string | Element | EBObject | Function,
    target: Element,
    at?: number | string
) {
    const posFromString = (at: string, childList: HTMLCollection) => {
        const posMap: NumberObject = {
            start: 0,
            middle: Math.floor(childList.length / 2),
            end: childList.length - 1
        }

        return at in posMap ? posMap[at] : posMap.end
    }

    const safePos = (n: number, length: number) => {
        return n < 0
            ? Math.max(length - 1 + n, 0)
            : Math.min(length - 1, n)
    }

    const childList = target.children
    const n = Check.isString(at) ? posFromString(at as string, childList) : Math.floor(at as number)
    const p = safePos(n, childList.length)

    if (childList.length === 0 || childList.length - 1 === p) target.appendChild(input as Element)
    else childList[p].insertAdjacentElement('beforebegin', input as Element)
}