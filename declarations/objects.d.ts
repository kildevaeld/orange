/**
 * Takes a nested object and returns a shallow object keyed with the path names
 * e.g. { "level1.level2": "value" }
 *
 * @param  {Object}      Nested object e.g. { level1: { level2: 'value' } }
 * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
 */
export declare function objToPaths(obj: Object, separator?: string): {};
export declare function isEmpty(obj: any): boolean;
export declare function extend<T>(obj: Object, ...args: Object[]): any;
export declare function assign(target: any, ...args: any[]): any;
export declare function has(obj: any, prop: any): boolean;
export declare function pick(obj: Object, props: string[]): any;
export declare function omit(obj: Object, props: string[]): any;
export declare function result(obj: any, prop: string, ctx?: any, args?: any[]): any;
export declare function values<T>(obj: Object): T[];
export declare function intersection(results: any[], ...args: any[]): any[];
