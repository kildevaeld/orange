
import {slice} from './arrays';
import {camelcase} from './strings';
import {has, extend} from './objects';

const nativeBind = Function.prototype.bind;

export function proxy(from, to, fns) {
    if (!Array.isArray(fns)) fns = [fns];
    fns.forEach(function (fn) {
        if (typeof to[fn] === 'function') {
            from[fn] = bind(to[fn], to);
        }
    });
}

export function bind<T extends Function>(method: T, context: any, ...args: any[]): T {
    if (typeof method !== 'function') throw new Error('method not at function')

    if (nativeBind != null) return nativeBind.call(method, context, ...args)

    args = args || []

    let fnoop = function () { }

    let fBound = function () {
        let ctx = this instanceof fnoop ? this : context
        return callFunc(method, ctx, args.concat(slice(arguments)))
    }

    fnoop.prototype = this.prototype
    fBound.prototype = new fnoop()

    return <any>fBound
}

export function callFunc(fn: Function, ctx: any, args: any[] = []): any {
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
            return fn.call(ctx, args[0], args[1], args[2], args[3], args[4])
        default:
            return fn.apply(ctx, args);
    }
}


export function triggerMethodOn(obj: any, eventName: string, args?: any[]) {

    let ev = camelcase("on-" + eventName.replace(':', '-'))


    if (obj[ev] && typeof obj[ev] === 'function') {

        callFunc(obj[ev], obj, args)
    }

    if (typeof obj.trigger === 'function') {
        args = [eventName].concat(args)
        callFunc(obj.trigger, obj, args)
    }
}

export function inherits<T extends FunctionConstructor, U>(parent: T, protoProps: Object, staticProps?: Object): T {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () { return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function () { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
}