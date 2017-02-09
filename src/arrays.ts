import {equal} from './utils';

// Return a new array with duplicates removed
export function unique<T>(array: T[]): T[] {
    let seen = new Map<T,boolean>();
    return array.filter(function (e, i) {
        if (seen.has(e)) return false;
        seen.set(e, true);
        return true;
    })
}


export function any(array: any[], predicate: Function): boolean {
    for (let i = 0, ii = array.length; i < ii; i++) {
        if (predicate(array[i])) return true;
    }
    return false;
}

export function indexOf(array, item): number {
    for (var i = 0, len = array.length; i < len; i++) if (array[i] === item) return i;
    return -1;
}

export function find<T>(array: T[], callback: (item: T, index?: number) => boolean, ctx?: any): T {
    let v;
    for (let i = 0, ii = array.length; i < ii; i++) {
        if (callback.call(ctx, array[i])) return array[i];
    }
    return null;
}

export function slice(array: any, begin?: number, end?: number): any {
    return Array.prototype.slice.call(array, begin, end);
}

export function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

export function sortBy<T>(obj: T[], value: string | ((v:T,i:number,l:T[]) => boolean), context?: any): T[] {
    var iterator = typeof value === 'function' ? value : function (obj: any) { return obj[<string>value]; };
    return obj
        .map(function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iterator.call(context, value, index, list)
            };
        })
        .sort(function (left, right) {
            let a = left.criteria,
                b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        })
        .map(function (item) {
            return item.value;
        });
}