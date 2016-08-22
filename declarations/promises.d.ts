export interface IPromise<T> extends Thenable<T> {
}
export declare const Promise: PromiseConstructor;
export interface Thenable<R> {
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): IPromise<U>;
}
export interface PromiseConstructor {
    new <R>(callback: (resolve: (value?: R | Thenable<R>) => void, reject: (error?: any) => void) => void): IPromise<R>;
    resolve<R>(value?: R | Thenable<R>): IPromise<R>;
    reject(error: any): IPromise<any>;
    all<R>(promises: (R | Thenable<R>)[]): IPromise<R[]>;
    race<R>(promises: (R | Thenable<R>)[]): IPromise<R>;
}
export declare function isPromise(obj: any): boolean;
export declare function toPromise(obj: any): IPromise<any>;
/**
 * Convert a thunk to a promise.
 *
 * @param {Function}
 * @return {Promise}
 * @api private
 */
export declare function thunkToPromise(fn: any): IPromise<{}>;
/**
 * Convert an array of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Array} obj
 * @return {Promise}
 * @api private
 */
export declare function arrayToPromise(obj: any): IPromise<{}[]>;
/**
 * Convert an object of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Object} obj
 * @return {Promise}
 * @api private
 */
export declare function objectToPromise(obj: any): IPromise<any>;
export interface Deferred<T> {
    promise: IPromise<T>;
    resolve: (result: T) => void;
    reject: (error: Error) => void;
    done: (error: Error, result: T) => void;
}
export declare function deferred<T>(): Deferred<T>;
export declare function callback<T>(promise: IPromise<T>, callback: (error: Error, result: T) => void, ctx?: any): void;
export declare function delay<T>(timeout?: number): IPromise<T>;
export declare function eachAsync<T>(array: T[], iterator: (value: T) => IPromise<void>, context?: any, accumulate?: boolean): IPromise<void>;
export declare function mapAsync<T, U>(array: T[], iterator: (value: T) => IPromise<U>, context?: any, accumulate?: boolean): IPromise<U[]>;
