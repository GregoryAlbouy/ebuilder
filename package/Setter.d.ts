export declare function element(source: string | Element): Element;
export declare function Properties(this: EBObject, properties?: AnyObject): void;
export declare function Attributes(this: EBObject, attributes?: StringObject): void;
export declare function Styles(this: EBObject, styles?: StringObject | Function): void;
export declare function Listeners(this: EBObject, listeners: EventTuple | EventTuple[]): void;
export declare function Children(this: EBObject, children: EBChild | EBChild[] | Function): void;
export declare function process(this: EBObject, source: AnyObject, callback: SetterCallback, keyRestriction?: Object): void;
