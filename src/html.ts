import {isObject} from './utils';
import {slice} from './arrays';
import * as dom from './dom';

var domEvents;

export class Html {

  static query(query: string | HTMLElement | NodeList, context?: string | HTMLElement | NodeList): Html {
    if (typeof context === 'string') {
      context = document.querySelectorAll(<string>context);
    }
    let html: Html;
    let els: HTMLElement[];
    if (typeof query === 'string') {
      if (context) {
        if (context instanceof HTMLElement) {
          els = slice(context.querySelectorAll(query));
        } else {
          html = new Html(slice(context));
          return html.find(query);
        }
      } else {
        els = slice(document.querySelectorAll(query));
      }
    } else if (query && query instanceof Element) {
      els = [query];
    } else if (query && query instanceof NodeList) {
      els = slice(query);
    }

    return new Html(els);
  }

  private _elements: HTMLElement[];

  get length(): number {
    return this._elements.length;
  }

  constructor(el: HTMLElement[]) {
    if (!Array.isArray(el)) el = [<any>el]
    this._elements = el || [];
  }

  get(n: number): HTMLElement {
    n = n === undefined ? 0 : n;
    return n >= this.length ? undefined : this._elements[n];
  }

  addClass(str: string): Html {
    return this.forEach((e) => {
      dom.addClass(e, str);
    });
  }

  removeClass(str: string): Html {
    return this.forEach((e) => {
      dom.removeClass(e, str);
    });
  }

  hasClass(str: string): boolean {
    return this._elements.reduce<boolean>((p, c) => {
      return dom.hasClass(c, str);
    }, false);
  }

  attr(key: string | Object, value?: any): Html | string {
    let attr;
    if (typeof key === 'string' && value) {
      attr = { [key]: value };
    } else if (typeof key == 'string') {
      if (this.length) return this.get(0).getAttribute(<string>key);
    } else if (isObject(key)) {
      attr = key;
    }
    return this.forEach(e => {
      for (let k in attr) {
        e.setAttribute(k, attr[k]);
      }
    });
  }

  text (str: string): any {
    if (arguments.length === 0) {
      return this.length > 0 ? this.get(0).textContent : null;
    }
    return this.forEach(e => e.textContent = str);
  }

  html(html: string): any {
    if (arguments.length === 0) {
      return this.length > 0 ? this.get(0).innerHTML : null;
    }
    return this.forEach(e => e.innerHTML = html);
  }

  css(attr:string|any, value?:any) {
    if (arguments.length === 2) {
      return this.forEach(e => {
        if (attr in e.style) e.style[attr] = String(value);
      });
    } else {
      return this.forEach(e => {
        for (let k in attr) {
          if (attr in e.style) e.style[k] = String(attr[k]);
        }
      });
    }
  }

  parent(): Html {
    var out = [];
    this.forEach(e => {
      if (e.parentElement) {
        out.push(e.parentElement);
      }
    })
    return new Html(out);
  }

  find(str: string): Html {
    var out = [];
    this.forEach(e => {
      out = out.concat(slice(e.querySelectorAll(str)));
    });
    return new Html(out);
  }

  map<T>(fn: (elm: HTMLElement, index?:number) => T): T[] {
    let out: T[] = new Array(this.length)
    this.forEach((e, i) => {
      out[i] = fn(e, i);
    });
    return out;
  }

  forEach(fn: (elm: HTMLElement, index: number) => void): Html {
    this._elements.forEach(fn);
    return this;
  }
}