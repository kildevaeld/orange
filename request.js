"use strict";
var self = global || Window;
const searchParams = 'URLSearchParams' in self, blob = 'FileReader' in self && 'Blob' in self && (function () {
    try {
        new Blob();
        return true;
    }
    catch (e) {
        return false;
    }
})(), formData = 'FormData' in self, arrayBuffer = 'ArrayBuffer' in self;
function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
}
function normalizeValue(value) {
    if (typeof value !== 'string') {
        value = String(value);
    }
    return value;
}
class Headers {
    constructor(headers) {
        if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
                this.append(name, value);
            }, this);
        }
        else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                this.append(name, headers[name]);
            }, this);
        }
    }
    append(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var list = this._map.get(name);
        if (!list) {
            list = [];
            this._map.set(name, list);
        }
        list.push(value);
    }
    delete(name) {
        delete this._map.delete(normalizeName(name));
    }
    get(name) {
        var values = this._map.get(normalizeName(name));
        return values ? values[0] : null;
    }
    getAll(name) {
        return this._map.get(normalizeName(name)) || [];
    }
    has(name) {
        return this._map.has(normalizeName(name));
    }
    set(name, value) {
        this._map.set(normalizeName(name), [normalizeValue(value)]);
    }
    keys() {
        this._map.keys();
    }
    values() {
        return this._map.values();
    }
    entries() {
        return this._map.entries();
    }
    forEach(callbackfn, thisArg) {
        this._map.forEach((v, k) => {
            callbackfn.call(thisArg, v, k);
        });
    }
}
