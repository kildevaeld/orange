"use strict";
const utils_1 = require('./utils');
const arrays_1 = require('./arrays');
const dom = require('./dom');
var domEvents;
var singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
function parseHTML(html) {
    let parsed = singleTag.exec(html);
    if (parsed) {
        return document.createElement(parsed[0]);
    }
    var div = document.createElement('div');
    div.innerHTML = html;
    var element = div.firstChild;
    return element;
}
class Html {
    constructor(el) {
        if (!Array.isArray(el))
            el = [el];
        this._elements = el || [];
    }
    static query(query, context) {
        if (typeof context === 'string') {
            context = document.querySelectorAll(context);
        }
        let html;
        let els;
        if (typeof query === 'string') {
            if (query.length > 0 && query[0] === '<' && query[query.length - 1] === ">"
                && query.length >= 3) {
                return new Html([parseHTML(query)]);
            }
            if (context) {
                if (context instanceof HTMLElement) {
                    els = arrays_1.slice(context.querySelectorAll(query));
                }
                else {
                    html = new Html(arrays_1.slice(context));
                    return html.find(query);
                }
            }
            else {
                els = arrays_1.slice(document.querySelectorAll(query));
            }
        }
        else if (query && query instanceof Element) {
            els = [query];
        }
        else if (query && query instanceof NodeList) {
            els = arrays_1.slice(query);
        }
        return new Html(els);
    }
    get length() {
        return this._elements.length;
    }
    get(n) {
        n = n === undefined ? 0 : n;
        return n >= this.length ? undefined : this._elements[n];
    }
    addClass(str) {
        return this.forEach((e) => {
            dom.addClass(e, str);
        });
    }
    removeClass(str) {
        return this.forEach((e) => {
            dom.removeClass(e, str);
        });
    }
    hasClass(str) {
        return this._elements.reduce((p, c) => {
            return dom.hasClass(c, str);
        }, false);
    }
    attr(key, value) {
        let attr;
        if (typeof key === 'string' && value) {
            attr = { [key]: value };
        }
        else if (typeof key == 'string') {
            if (this.length)
                return this.get(0).getAttribute(key);
        }
        else if (utils_1.isObject(key)) {
            attr = key;
        }
        return this.forEach(e => {
            for (let k in attr) {
                e.setAttribute(k, attr[k]);
            }
        });
    }
    text(str) {
        if (arguments.length === 0) {
            return this.length > 0 ? this.get(0).textContent : null;
        }
        return this.forEach(e => e.textContent = str);
    }
    html(html) {
        if (arguments.length === 0) {
            return this.length > 0 ? this.get(0).innerHTML : null;
        }
        return this.forEach(e => e.innerHTML = html);
    }
    css(attr, value) {
        if (arguments.length === 2) {
            return this.forEach(e => {
                if (attr in e.style)
                    e.style[attr] = String(value);
            });
        }
        else {
            return this.forEach(e => {
                for (let k in attr) {
                    if (k in e.style)
                        e.style[k] = String(attr[k]);
                }
            });
        }
    }
    parent() {
        var out = [];
        this.forEach(e => {
            if (e.parentElement) {
                out.push(e.parentElement);
            }
        });
        return new Html(out);
    }
    remove() {
        return this.forEach(e => {
            if (e.parentElement)
                e.parentElement.removeChild(e);
        });
    }
    clone() {
        return new Html(this.map(m => m.cloneNode()));
    }
    find(str) {
        var out = [];
        this.forEach(e => {
            out = out.concat(arrays_1.slice(e.querySelectorAll(str)));
        });
        return new Html(out);
    }
    map(fn) {
        let out = new Array(this.length);
        this.forEach((e, i) => {
            out[i] = fn(e, i);
        });
        return out;
    }
    forEach(fn) {
        this._elements.forEach(fn);
        return this;
    }
}
exports.Html = Html;
