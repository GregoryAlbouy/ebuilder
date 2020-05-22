export declare const RuleMap: FunctionObject;
export declare function On(this: EBObject, eventInput: string, callback: Function): void;
export declare function Once(this: EBObject, eventInput: string, callback: Function): void;
export declare function Interval(this: EBObject, rate: string, callback: Function): void;
export declare function Timeout(delay: string, callback: Function): void;
export declare function If(this: EBObject, conditionId: string, callback: Function): void;
export declare function For(this: EBObject, conditionId: string, callback: Function): void;
