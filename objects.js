"use strict";
const utils_1 = require('./utils');
const arrays_1 = require('./arrays');
/**
 * Takes a nested object and returns a shallow object keyed with the path names
 * e.g. { "level1.level2": "value" }
 *
 * @param  {Object}      Nested object e.g. { level1: { level2: 'value' } }
 * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
 */
function objToPaths(obj, separator = ".") {
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
        }
        else {
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
function extend(obj, ...args) {
    if (!utils_1.isObject(obj))
        return obj;
    let o, k;
    for (o of args) {
        if (!utils_1.isObject(o))
            continue;
        for (k in o) {
            if (has(o, k))
                obj[k] = o[k];
        }
    }
    return obj;
}
exports.extend = extend;
const nativeAssign = Object.assign;
function assign(target, ...args) {
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }
    if (nativeAssign)
        return nativeAssign(target, ...args);
    var to = Object(target);
    for (let i = 0, ii = args.length; i < ii; i++) {
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
const _has = Object.prototype.hasOwnProperty;
function has(obj, prop) {
    return _has.call(obj, prop);
}
exports.has = has;
function pick(obj, props) {
    let out = {}, prop;
    for (prop of props) {
        if (has(obj, prop))
            out[prop] = obj[prop];
    }
    return out;
}
exports.pick = pick;
function omit(obj, props) {
    let out = {};
    for (let key in obj) {
        if (!!~props.indexOf(key))
            continue;
        out[key] = obj[key];
    }
    return out;
}
exports.omit = omit;
function result(obj, prop, ctx, args) {
    let ret = obj[prop];
    return (typeof ret === 'function') ? ret.appl(ctx, args || []) : ret;
}
exports.result = result;
function values(obj) {
    let output = [];
    for (let k in obj)
        if (has(obj, k)) {
            output.push(obj[k]);
        }
    return output;
}
exports.values = values;
function intersectionObjects(a, b, predicate) {
    var results = [], aElement, existsInB;
    for (let i = 0, ii = a.length; i < ii; i++) {
        aElement = a[i];
        existsInB = arrays_1.any(b, function (bElement) { return predicate(bElement, aElement); });
        if (existsInB) {
            results.push(aElement);
        }
    }
    return results;
}
function intersection(results, ...args) {
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
        if (results.length === 0)
            break;
    }
    return results;
}
exports.intersection = intersection;
