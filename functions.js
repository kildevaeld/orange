"use strict";
const arrays_1 = require('./arrays');
const strings_1 = require('./strings');
const objects_1 = require('./objects');
const nativeBind = Function.prototype.bind;
function proxy(from, to, fns) {
    if (!Array.isArray(fns))
        fns = [fns];
    fns.forEach(function (fn) {
        if (typeof to[fn] === 'function') {
            from[fn] = bind(to[fn], to);
        }
    });
}
exports.proxy = proxy;
function bind(method, context, ...args) {
    if (typeof method !== 'function')
        throw new Error('method not at function');
    if (nativeBind != null)
        return nativeBind.call(method, context, ...args);
    args = args || [];
    let fnoop = function () { };
    let fBound = function () {
        let ctx = this instanceof fnoop ? this : context;
        return callFunc(method, ctx, args.concat(arrays_1.slice(arguments)));
    };
    fnoop.prototype = this.prototype;
    fBound.prototype = new fnoop();
    return fBound;
}
exports.bind = bind;
function callFunc(fn, ctx, args = []) {
    switch (args.length) {
        case 0:
            return fn.call(ctx);
        case 1:
            return fn.call(ctx, args[0]);
        case 2:
            return fn.call(ctx, args[0], args[1]);
        case 3:
            return fn.call(ctx, args[0], args[1], args[2]);
        case 4:
            return fn.call(ctx, args[0], args[1], args[2], args[3]);
        case 5:
            return fn.call(ctx, args[0], args[1], args[2], args[3], args[4]);
        default:
            return fn.apply(ctx, args);
    }
}
exports.callFunc = callFunc;
function triggerMethodOn(obj, eventName, args) {
    let ev = strings_1.camelcase("on-" + eventName.replace(':', '-'));
    if (obj[ev] && typeof obj[ev] === 'function') {
        callFunc(obj[ev], obj, args);
    }
    if (typeof obj.trigger === 'function') {
        args = [eventName].concat(args);
        callFunc(obj.trigger, obj, args);
    }
}
exports.triggerMethodOn = triggerMethodOn;
function inherits(parent, protoProps, staticProps) {
    var child;
    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && objects_1.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    }
    else {
        child = function () { return parent.apply(this, arguments); };
    }
    // Add static properties to the constructor function, if supplied.
    objects_1.extend(child, parent, staticProps);
    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function () { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps)
        objects_1.extend(child.prototype, protoProps);
    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;
    return child;
}
exports.inherits = inherits;
