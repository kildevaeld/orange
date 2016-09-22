"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var self = typeof window === 'undefined' ? global : window;
var iterable = 'Symbol' in self && 'iterator' in Symbol;
// Build a destructive iterator for the value list
function iteratorFor(items) {
    var iterator = {
        next: function next() {
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

var KeyValuePair = function KeyValuePair(key, value) {
    _classCallCheck(this, KeyValuePair);

    this.key = key;
    this.value = value;
};

var MapShim = function () {
    // ---------------------------------------------
    function MapShim() {
        _classCallCheck(this, MapShim);

        this.keyAndValues = [];
    }
    // --- Public Methods ---


    _createClass(MapShim, [{
        key: 'getKeysOfValue',
        value: function getKeysOfValue(value) {
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

    }, {
        key: 'clear',
        value: function clear() {
            this.keyAndValues = [];
        }
    }, {
        key: 'delete',
        value: function _delete(key) {
            var found = false;
            this.keyAndValues.forEach(function (value, index, array) {
                if (found) return;
                if (key === value.key) {
                    array = array.slice(0, index).concat(array.slice(index + 1));
                    found = true;
                }
            });
            return found;
        }
    }, {
        key: 'forEach',
        value: function forEach(callbackfn, thisArg) {
            this.keyAndValues.forEach(function (value, index, array) {
                callbackfn.apply(thisArg, [value.value, value.key, this]);
            }, this);
        }
    }, {
        key: 'get',
        value: function get(key) {
            var valueToReturn = undefined;
            this.keyAndValues.forEach(function (value, index, array) {
                if (valueToReturn !== undefined) return;
                if (key === value.key) {
                    valueToReturn = value.value;
                }
            });
            return valueToReturn;
        }
    }, {
        key: 'has',
        value: function has(key) {
            var found = false;
            this.keyAndValues.forEach(function (value, index, array) {
                if (found) return;
                if (key === value.key) {
                    found = true;
                }
            });
            return found;
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            var found = false;
            var valueToSet = value;
            this.keyAndValues.forEach(function (value, index, array) {
                if (found) return;
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
    }, {
        key: 'keys',
        value: function keys() {
            var items = [];
            this.forEach(function (value, name) {
                items.push(name);
            });
            return iteratorFor(items);
        }
    }, {
        key: 'values',
        value: function values() {
            var items = [];
            this.forEach(function (value) {
                items.push(value);
            });
            return iteratorFor(items);
        }
    }, {
        key: 'entries',
        value: function entries() {
            var items = [];
            this.forEach(function (value, name) {
                items.push([name, value]);
            });
            return iteratorFor(items);
        }
        // ----------------------
        // Getters:
        // Standard:

    }, {
        key: Symbol.iterator,
        value: function value() {
            return this.entries();
        }
    }, {
        key: 'size',
        get: function get() {
            return this.keyAndValues.length;
        }
    }]);

    return MapShim;
}();

if (!self.Map) {
    self.Map = MapShim;
}
exports.Map = self.Map;