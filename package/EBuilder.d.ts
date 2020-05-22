declare const EBuilder: (this: any, source: Element | string) => {
    el: Element;
    element: Element;
    htmlContent: () => string;
    isEBuilder: boolean;
    referenceMap: ReferenceMap;
    getRef: (query: string) => any;
    given: (...references: ReferencePair[]) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    into: (targetInput: EBTarget, { at, times }?: IntoOptions) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: any;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    } | undefined;
    after: (node: Element) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    before: (node: Element) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    replace: (node: Node) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    swap: (swapped: HTMLElement, animate?: boolean | {
        animationDuration?: number | undefined;
        animationType?: string | undefined;
    } | undefined) => Promise<{
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: any;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    } | undefined>;
    out: () => void;
    dispatch: (nameInput: string, emitterInput?: any) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    set: (options?: SetOptions) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    setAttributes: (attributes: StringObject) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    setProperties: (properties: AnyObject) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    setListeners: (listeners: EventTuple | EventTuple[]) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    setChildren: (children: EBChild | EBChild[] | Function) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    setStyles: (styles: StringObject | Function) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    setClasses: (...classes: (string | string[])[]) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: any;
        setStyle: (styles?: StringObject) => any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    setStyle: (styles?: StringObject) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: any;
        textContent: (input: string) => any;
        toString: () => string;
        count: () => number;
    };
    textContent: (input: string) => {
        el: Element;
        element: Element;
        htmlContent: () => string;
        isEBuilder: boolean;
        referenceMap: ReferenceMap;
        getRef: (query: string) => any;
        given: (...references: ReferencePair[]) => any;
        into: (targetInput: EBTarget, { at, times }?: IntoOptions) => any | undefined;
        after: (node: Element) => any;
        before: (node: Element) => any;
        replace: (node: Node) => any;
        swap: (swapped: HTMLElement, animate?: boolean | {
            animationDuration?: number | undefined;
            animationType?: string | undefined;
        } | undefined) => Promise<any | undefined>;
        out: () => void;
        dispatch: (nameInput: string, emitterInput?: any) => any;
        set: (options?: SetOptions) => any;
        setAttributes: (attributes: StringObject) => any;
        setProperties: (properties: AnyObject) => any;
        setListeners: (listeners: EventTuple | EventTuple[]) => any;
        setChildren: (children: EBChild | EBChild[] | Function) => any;
        setStyles: (styles: StringObject | Function) => any;
        setClasses: (...classes: (string | string[])[]) => any;
        setStyle: (styles?: StringObject) => any;
        textContent: any;
        toString: () => string;
        count: () => number;
    };
    toString: () => string;
    count: () => number;
} | undefined;
export default EBuilder;
