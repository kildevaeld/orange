declare var global
declare var Symbol;

var self = global || Window;

export interface IKeyValuePair<K,V> {
    key: K;
    value: V;
}

export interface IMap<K, V> {
    clear();
    delete(key:K): boolean;
    get(key:K): V;
    set(key: K, value: V): IMap<K,V>;
    has(key:K): boolean;
    size: number;
    forEach(fn:(value: V, key: K, map: IMap<K, V>) => void, thisArg?: any);
    keys(): Iterator<K>;
    values(): Iterator<V>;
    entries(): Iterator<IKeyValuePair<K,V>>;
}

const iterable = 'Symbol' in self && 'iterator' in Symbol;

// Build a destructive iterator for the value list
function iteratorFor(items) {
    var iterator = {
        next: function () {
            var value = items.shift()
            return { done: value === undefined, value: value }
        }
    }

    if (iterable) {
        iterator[Symbol.iterator] = function () {
            return iterator
        }
    }

    return iterator
}

class KeyValuePair<K, V> implements IKeyValuePair<K,V> {
    key: K;
    value: V;
    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

class MapShim<K, V> { // class MapDDD<K,V> implements Map
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
    forEach(callbackfn: (value: V, key: K, map: IMap<K, V>) => void, thisArg?: any): void {
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
    set(key: K, value: V): IMap<K, V> {
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

    keys(): Iterator<K> {
        var items = []
        this.forEach(function(value, name) { items.push(name) })
        return iteratorFor(items)
    }

    values(): Iterator<V> {
        var items = []
        this.forEach(function(value) { items.push(value) })
        return iteratorFor(items)
    }

    entries(): Iterator<KeyValuePair<K,V>> {
        var items = []
        this.forEach(function(value, name) { items.push([name, value]) })
        return iteratorFor(items)
    }
    // ----------------------

    // Getters:
    // Standard:
    get size(): number {
        return this.keyAndValues.length;
    }

    [Symbol.iterator](){
        return this.entries();
    }
}


export interface MapConstructor {
	new <T,V>(): IMap<T,V>
}

if (!global.Map) {
    global.Map = MapShim;
}

export const Map: new () => MapConstructor = global.Map;