export declare function proxy(from: any, to: any, fns: any): void;
export declare function bind<T extends Function>(method: T, context: any, ...args: any[]): T;
export declare function callFunc(fn: Function, ctx: any, args?: any[]): any;
export declare function triggerMethodOn(obj: any, eventName: string, args?: any[]): void;
export declare function inherits<T extends FunctionConstructor, U>(parent: T, protoProps: Object, staticProps?: Object): T;
