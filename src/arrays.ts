

import {equal} from './utils';

/*class KeyValuePair<K, V> {
    key: K;
    value: V;
    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}
export class Map<K, V> { // class MapDDD<K,V> implements Map
    // -------------- Fields -----------------------
    private keyAndValues: Array<KeyValuePair<K, V>>;
    // ---------------------------------------------
    constructor() {
        this.keyAndValues = [];
    }
    // --- Public Methods ---
    getKeysOfValue(value: V) {
        var keysToReturn: Array<K> = [];
        var valueToFind = value;
        this.keyAndValues.forEach(function (value: KeyValuePair<K, V>, index: number, array: KeyValuePair<K, V>[]): void {
            if (value.value === valueToFind) {
                keysToReturn.push(value.key);
            }
        });
        return keysToReturn;
    }

    // Standard:
    clear(): void {
        this.keyAndValues = [];
    }
    delete(key: K): boolean {
        var found = false;
        this.keyAndValues.forEach(function (value: KeyValuePair<K, V>, index: number, array: KeyValuePair<K, V>[]): void {
            if (found) return;
            if (key === value.key) {
                array = array.slice(0, index).concat(array.slice(index + 1));
                found = true;
            }
        });
        return found;
    }
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        this.keyAndValues.forEach(function (value: KeyValuePair<K, V>, index: number, array: KeyValuePair<K, V>[]): void {
            callbackfn.apply(thisArg, [value.value, value.key, this]);
        }, this);
    }
    get(key: K): V {
        var valueToReturn: V = undefined;
        this.keyAndValues.forEach(function (value: KeyValuePair<K, V>, index: number, array: KeyValuePair<K, V>[]): void {
            if (valueToReturn !== undefined) return;
            if (key === value.key) {
                valueToReturn = value.value;
            }
        });
        return valueToReturn;
    }
    has(key: K): boolean {
        var found = false;
        this.keyAndValues.forEach(function (value: KeyValuePair<K, V>, index: number, array: KeyValuePair<K, V>[]): void {
            if (found) return;
            if (key === value.key) {
                found = true;
            }
        });
        return found;
    }
    set(key: K, value: V): Map<K, V> {
        var found = false;
        var valueToSet = value;
        this.keyAndValues.forEach(function (value: KeyValuePair<K, V>, index: number, array: KeyValuePair<K, V>[]): void {
            if (found) return;
            if (key === value.key) {
                found = true;
                value.value = valueToSet;
            }
        });
        if (!found) {
            this.keyAndValues.push(new KeyValuePair<K, V>(key, valueToSet));
        }
        return this;
    }
    // ----------------------

    // Getters:
    // Standard:
    get size() {
        return this.keyAndValues.length;
    }
}*/

// Return a new array with duplicates removed
export function unique<T>(array: T[]): T[] {
    let seen = new Map<T,boolean>();
    return array.filter(function (e, i) {
        if (seen.has(e)) return false;
        /*for (i += 1; i < array.length; i += 1) {
          if (equal(e, array[i])) {
            return false;
          }
        }*/
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

export function sortBy<T>(obj: T[], value: string | Function, context?: any): T[] {
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