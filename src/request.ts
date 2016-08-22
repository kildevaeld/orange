declare var Symbol;
declare var global: Window;

import {Map, IMap} from './map';
var self = global || Window;

const searchParams = 'URLSearchParams' in self,

    blob = 'FileReader' in self && 'Blob' in self && (function () {
        try {
            new Blob()
            return true
        } catch (e) {
            return false
        }
    })(),
    formData = 'FormData' in self,
    arrayBuffer = 'ArrayBuffer' in self;


function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
}

function normalizeValue(value) {
    if (typeof value !== 'string') {
        value = String(value)
    }
    return value
}


class Headers {
    private _map: IMap<string, string[]>;
    constructor(headers: any) {
        if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
                this.append(name, value)
            }, this)

        } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                this.append(name, headers[name])
            }, this)
        }
    }

    append(name, value) {
        name = normalizeName(name)
        value = normalizeValue(value)
        var list = this._map.get(name);
        if (!list) {
            list = []
            this._map.set(name, list);
        }
        list.push(value)
    }

    delete(name: string) {
        delete this._map.delete(normalizeName(name));

    }

    get(name: string) {
        var values = this._map.get(normalizeName(name))
        return values ? values[0] : null
    }

    getAll(name: string) {
        return this._map.get(normalizeName(name)) || [];
    }

    has(name: string) {
        return this._map.has(normalizeName(name));
    }

    set(name: string, value: string) {
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

    forEach(callbackfn: (value: string[], key: string) => void, thisArg?: any) {
        this._map.forEach((v, k) => {
            callbackfn.call(thisArg, v, k);
        });
    }
}

