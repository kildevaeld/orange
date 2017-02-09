"use strict";

var arrays_1 = require('./arrays');
var utils_1 = require('./utils');
exports.Promise = typeof window === 'undefined' ? global.Promise : window.Promise;
// Promises
function isPromise(obj) {
    return obj && typeof obj.then === 'function';
}
exports.isPromise = isPromise;
function toPromise(obj) {
    /* jshint validthis:true */
    if (!obj) {
        return obj;
    }
    if (isPromise(obj)) {
        return obj;
    }
    if (utils_1.isFunction(obj)) {
        return thunkToPromise.call(this, obj);
    }
    if (Array.isArray(obj)) {
        return arrayToPromise.call(this, obj);
    }
    if (utils_1.isObject(obj)) {
        return objectToPromise.call(this, obj);
    }
    return exports.Promise.resolve(obj);
}
exports.toPromise = toPromise;
/**
 * Convert a thunk to a promise.
 *
 * @param {Function}
 * @return {Promise}
 * @api private
 */
function thunkToPromise(fn) {
    /* jshint validthis:true */
    var ctx = this;
    return new exports.Promise(function (resolve, reject) {
        fn.call(ctx, function (err, res) {
            if (err) return reject(err);
            if (arguments.length > 2) res = arrays_1.slice(arguments, 1);
            resolve(res);
        });
    });
}
exports.thunkToPromise = thunkToPromise;
/**
 * Convert an array of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Array} obj
 * @return {Promise}
 * @api private
 */
function arrayToPromise(obj) {
    return exports.Promise.all(obj.map(toPromise, this));
}
exports.arrayToPromise = arrayToPromise;
/**
 * Convert an object of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Object} obj
 * @return {Promise}
 * @api private
 */
function objectToPromise(obj) {
    var results = new obj.constructor();
    var keys = Object.keys(obj);
    var promises = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var promise = toPromise.call(this, obj[key]);
        if (promise && isPromise(promise)) defer(promise, key);else results[key] = obj[key];
    }
    return exports.Promise.all(promises).then(function () {
        return results;
    });
    function defer(promise, key) {
        // predefine the key in the result
        results[key] = undefined;
        promises.push(promise.then(function (res) {
            results[key] = res;
        }));
    }
}
exports.objectToPromise = objectToPromise;
function deferred() {
    var ret = {};
    ret.promise = new exports.Promise(function (resolve, reject) {
        ret.resolve = resolve;
        ret.reject = reject;
        ret.done = function (err, result) {
            if (err) return reject(err);else resolve(result);
        };
    });
    return ret;
}
exports.deferred = deferred;
;
function callback(promise, callback, ctx) {
    promise.then(function (result) {
        callback.call(ctx, null, result);
    }).catch(function (err) {
        callback.call(ctx, err);
    });
}
exports.callback = callback;
function delay(timeout) {
    var defer = deferred();
    timeout == null ? utils_1.nextTick(defer.resolve) : setTimeout(defer.resolve, timeout);
    return defer.promise;
}
exports.delay = delay;
;
function eachAsync(array, iterator, context) {
    var accumulate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    return mapAsync(array, iterator, context, accumulate).then(function () {
        return void 0;
    });
}
exports.eachAsync = eachAsync;
function mapAsync(array, iterator, context) {
    var accumulate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    return new exports.Promise(function (resolve, reject) {
        var i = 0,
            len = array.length,
            errors = [],
            results = [];
        function next(err, result) {
            if (err && !accumulate) return reject(err);
            if (err) errors.push(err);
            if (i === len) return errors.length ? reject(arrays_1.flatten(errors)) : resolve(results);
            var ret = iterator.call(context, array[i++]);
            if (isPromise(ret)) {
                ret.then(function (r) {
                    results.push(r);next(null, r);
                }, next);
            } else if (ret instanceof Error) {
                next(ret);
            } else {
                next(null);
            }
        }
        next(null);
    });
}
exports.mapAsync = mapAsync;