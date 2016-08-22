export declare function isObject(obj: any): obj is Object;
export declare function isString(a: any): a is String;
export declare function isNumber(a: any): a is Number;
export declare function isRegExp(a: any): a is RegExp;
export declare function isDate(a: any): a is Date;
export declare function isArray(a: any): a is Array<any>;
export declare function isFunction(a: any): a is Function;
/** Generate an unique id with an optional prefix
 * @param { string } prefix
 * @return { string }
 */
export declare function uniqueId(prefix?: string): string;
export declare function equal(a: any, b: any): boolean;
export declare function getOption<T>(option: string, objs: any[]): T;
export declare const nextTick: (fn: Function) => void;
export declare function xmlHttpRequest(): XMLHttpRequest;
