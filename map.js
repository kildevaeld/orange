"use strict";
var self = global || Window;
const iterable = 'Symbol' in self && 'iterator' in Symbol;
// Build a destructive iterator for the value list
function iteratorFor(items) {
    var iterator = {
        next: function () {
            var value = items.shift();
            return { done: value === undefined, value: value };
        }
    };
    if (iterable) {
        iterator[Symbol.iterator] = function () {
            return iterator;
        };
    }
    return iterator;
}
class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class MapShim {
    // ---------------------------------------------
    constructor() {
        this.keyAndValues = [];
    }
    // --- Public Methods ---
    getKeysOfValue(value) {
        var keysToReturn = [];
        var valueToFind = value;
        this.keyAndValues.forEach(function (value, index, array) {
            if (value.value === valueToFind) {
                keysToReturn.push(value.key);
            }
        });
        return keysToReturn;
    }
    // Standard:
    clear() {
        this.keyAndValues = [];
    }
    delete(key) {
        var found = false;
        this.keyAndValues.forEach(function (value, index, array) {
            if (found)
                return;
            if (key === value.key) {
                array = array.slice(0, index).concat(array.slice(index + 1));
                found = true;
            }
        });
        return found;
    }
    forEach(callbackfn, thisArg) {
        this.keyAndValues.forEach(function (value, index, array) {
            callbackfn.apply(thisArg, [value.value, value.key, this]);
        }, this);
    }
    get(key) {
        var valueToReturn = undefined;
        this.keyAndValues.forEach(function (value, index, array) {
            if (valueToReturn !== undefined)
                return;
            if (key === value.key) {
                valueToReturn = value.value;
            }
        });
        return valueToReturn;
    }
    has(key) {
        var found = false;
        this.keyAndValues.forEach(function (value, index, array) {
            if (found)
                return;
            if (key === value.key) {
                found = true;
            }
        });
        return found;
    }
    set(key, value) {
        var found = false;
        var valueToSet = value;
        this.keyAndValues.forEach(function (value, index, array) {
            if (found)
                return;
            if (key === value.key) {
                found = true;
                value.value = valueToSet;
            }
        });
        if (!found) {
            this.keyAndValues.push(new KeyValuePair(key, valueToSet));
        }
        return this;
    }
    keys() {
        var items = [];
        this.forEach(function (value, name) { items.push(name); });
        return iteratorFor(items);
    }
    values() {
        var items = [];
        this.forEach(function (value) { items.push(value); });
        return iteratorFor(items);
    }
    entries() {
        var items = [];
        this.forEach(function (value, name) { items.push([name, value]); });
        return iteratorFor(items);
    }
    // ----------------------
    // Getters:
    // Standard:
    get size() {
        return this.keyAndValues.length;
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
if (!global.Map) {
    global.Map = MapShim;
}
exports.Map = global.Map;
