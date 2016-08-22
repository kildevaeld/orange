export interface IKeyValuePair<K, V> {
    key: K;
    value: V;
}
export interface IMap<K, V> {
    clear(): any;
    delete(key: K): boolean;
    get(key: K): V;
    set(key: K, value: V): IMap<K, V>;
    has(key: K): boolean;
    size: number;
    forEach(fn: (value: V, key: K, map: IMap<K, V>) => void, thisArg?: any): any;
    keys(): Iterator<K>;
    values(): Iterator<V>;
    entries(): Iterator<IKeyValuePair<K, V>>;
}
export interface MapConstructor {
    new <T, V>(): IMap<T, V>;
}
export declare const Map: new () => MapConstructor;
