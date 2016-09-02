"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var self = global || Window;
var searchParams = 'URLSearchParams' in self,
    blob = 'FileReader' in self && 'Blob' in self && function () {
    try {
        new Blob();
        return true;
    } catch (e) {
        return false;
    }
}(),
    formData = 'FormData' in self,
    arrayBuffer = 'ArrayBuffer' in self;
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

var Headers = function () {
    function Headers(headers) {
        _classCallCheck(this, Headers);

        if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
                this.append(name, value);
            }, this);
        } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                this.append(name, headers[name]);
            }, this);
        }
    }

    _createClass(Headers, [{
        key: 'append',
        value: function append(name, value) {
            name = normalizeName(name);
            value = normalizeValue(value);
            var list = this._map.get(name);
            if (!list) {
                list = [];
                this._map.set(name, list);
            }
            list.push(value);
        }
    }, {
        key: 'delete',
        value: function _delete(name) {
            delete this._map.delete(normalizeName(name));
        }
    }, {
        key: 'get',
        value: function get(name) {
            var values = this._map.get(normalizeName(name));
            return values ? values[0] : null;
        }
    }, {
        key: 'getAll',
        value: function getAll(name) {
            return this._map.get(normalizeName(name)) || [];
        }
    }, {
        key: 'has',
        value: function has(name) {
            return this._map.has(normalizeName(name));
        }
    }, {
        key: 'set',
        value: function set(name, value) {
            this._map.set(normalizeName(name), [normalizeValue(value)]);
        }
    }, {
        key: 'keys',
        value: function keys() {
            this._map.keys();
        }
    }, {
        key: 'values',
        value: function values() {
            return this._map.values();
        }
    }, {
        key: 'entries',
        value: function entries() {
            return this._map.entries();
        }
    }, {
        key: 'forEach',
        value: function forEach(callbackfn, thisArg) {
            this._map.forEach(function (v, k) {
                callbackfn.call(thisArg, v, k);
            });
        }
    }]);

    return Headers;
}();