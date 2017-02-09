"use strict";

var utils_1 = require('./utils');
var arrays_1 = require('./arrays');
/**
 * Takes a nested object and returns a shallow object keyed with the path names
 * e.g. { "level1.level2": "value" }
 *
 * @param  {Object}      Nested object e.g. { level1: { level2: 'value' } }
 * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
 */
function objToPaths(obj) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".";

    var ret = {};
    for (var key in obj) {
        var val = obj[key];
        if (val && (val.constructor === Object || val.constructor === Array) && !isEmpty(val)) {
            //Recursion for embedded objects
            var obj2 = objToPaths(val);
            for (var key2 in obj2) {
                var val2 = obj2[key2];
                ret[key + separator + key2] = val2;
            }
        } else {
            ret[key] = val;
        }
    }
    return ret;
}
exports.objToPaths = objToPaths;
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
exports.isEmpty = isEmpty;
function extend(obj) {
    if (!utils_1.isObject(obj)) return obj;
    var o = void 0,
        k = void 0;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            o = _step.value;

            if (!utils_1.isObject(o)) continue;
            for (k in o) {
                if (has(o, k)) obj[k] = o[k];
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return obj;
}
exports.extend = extend;
var nativeAssign = Object.assign;
function assign(target) {
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
    }

    if (nativeAssign) return nativeAssign.apply(undefined, [target].concat(args));
    var to = Object(target);
    for (var i = 0, ii = args.length; i < ii; i++) {
        var nextSource = args[i];
        if (nextSource === undefined || nextSource === null) {
            continue;
        }
        nextSource = Object(nextSource);
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
                to[nextKey] = nextSource[nextKey];
            }
        }
    }
    return to;
}
exports.assign = assign;
var _has = Object.prototype.hasOwnProperty;
function has(obj, prop) {
    return _has.call(obj, prop);
}
exports.has = has;
function pick(obj, props) {
    var out = {},
        prop = void 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            prop = _step2.value;

            if (has(obj, prop)) out[prop] = obj[prop];
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return out;
}
exports.pick = pick;
function omit(obj, props) {
    var out = {};
    for (var key in obj) {
        if (!!~props.indexOf(key)) continue;
        out[key] = obj[key];
    }
    return out;
}
exports.omit = omit;
function result(obj, prop, ctx, args) {
    var ret = obj[prop];
    return typeof ret === 'function' ? ret.appl(ctx, args || []) : ret;
}
exports.result = result;
function values(obj) {
    var output = [];
    for (var k in obj) {
        if (has(obj, k)) {
            output.push(obj[k]);
        }
    }return output;
}
exports.values = values;
function intersectionObjects(a, b, predicate) {
    var results = [],
        aElement,
        existsInB;
    for (var i = 0, ii = a.length; i < ii; i++) {
        aElement = a[i];
        existsInB = arrays_1.any(b, function (bElement) {
            return predicate(bElement, aElement);
        });
        if (existsInB) {
            results.push(aElement);
        }
    }
    return results;
}
function intersection(results) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
    }

    var lastArgument = args[args.length - 1];
    var arrayCount = args.length;
    var areEqualFunction = utils_1.equal;
    if (typeof lastArgument === "function") {
        areEqualFunction = lastArgument;
        arrayCount--;
    }
    for (var i = 0; i < arrayCount; i++) {
        var array = args[i];
        results = intersectionObjects(results, array, areEqualFunction);
        if (results.length === 0) break;
    }
    return results;
}
exports.intersection = intersection;