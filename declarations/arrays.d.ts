export declare function unique<T>(array: T[]): T[];
export declare function any(array: any[], predicate: Function): boolean;
export declare function indexOf(array: any, item: any): number;
export declare function find<T>(array: T[], callback: (item: T, index?: number) => boolean, ctx?: any): T;
export declare function slice(array: any, begin?: number, end?: number): any;
export declare function flatten(arr: any): any;
export declare function sortBy<T>(obj: T[], value: string | ((v: T, i: number, l: T[]) => boolean), context?: any): T[];
