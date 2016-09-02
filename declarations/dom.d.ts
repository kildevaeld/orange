import { IPromise } from './promises';
export declare function matches(elm: any, selector: any): boolean;
export declare function addEventListener(elm: Element, eventName: string, listener: any, useCap?: boolean): void;
export declare function removeEventListener(elm: Element, eventName: string, listener: any): void;
export declare function delegate(elm: HTMLElement | string, selector: string, eventName: string, callback: any, ctx?: any): Function;
export declare function undelegate(elm: HTMLElement | string, selector: string, eventName: string, callback: any): void;
export declare function addClass(elm: HTMLElement, className: string): void;
export declare function removeClass(elm: HTMLElement, className: string): void;
export declare function hasClass(elm: HTMLElement, className: string): boolean;
export declare function selectionStart(elm: HTMLInputElement): number;
export declare function transitionEnd(elm: Element, fn: (event: TransitionEvent) => void, ctx?: any, duration?: number): void;
export declare function animationEnd(elm: Element, fn: (event: AnimationEvent) => void, ctx?: any, duration?: number): void;
export declare const domReady: (fn: any) => void;
export declare function createElement<T extends HTMLElement>(tag: string, attr: any): T;
export declare function imageLoaded(img: HTMLImageElement): IPromise<boolean>;
