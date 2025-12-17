import { Container } from "inversify";

export type Token = string | symbol;
export type Ctor<T> = new (...args: any[]) => T;

export type Binding<T = any> = {
  name: Token;
  bind: Ctor<T>;
};

/**
 * Function wrapper (works with `export const handler = ...`):
 * supports any number of handler args: (container, ...args)
 */
export function withContainer(...bindings: Binding[]) {
  return function <TArgs extends any[], TResult>(
    handler: (container: Container, ...args: TArgs) => TResult,
  ): (...args: TArgs) => TResult {
    return (...args: TArgs) => {
      const c = new Container();
      for (const b of bindings) c.bind(b.name as any).to(b.bind as any);
      return handler(c, ...args);
    };
  };
}

const DI_META = "__di_bindings__";

/**
 * Property decorator: stores bindings on the class constructor for a given field.
 */
export function diContainer(...bindings: Binding[]) {
  return function (target: any, propertyKey: string | symbol) {
    const ctor = target.constructor;
    if (!ctor[DI_META]) ctor[DI_META] = new Map<string | symbol, Binding[]>();
    (ctor[DI_META] as Map<string | symbol, Binding[]>).set(propertyKey, bindings);
  };
}

/**
 * Method decorator: creates container per invocation using bindings from @diContainer(field).
 * Puts created container into `this[field]` for the duration of the call.
 */
export function useDiContainer(field: string | symbol = "_container") {
  return function <TFunc extends (...args: any[]) => any>(
    target: any,
    _methodKey: string | symbol,
    descriptor: TypedPropertyDescriptor<TFunc>,
  ) {
    const original = descriptor.value!;
    descriptor.value = function (this: any, ...args: Parameters<TFunc>) {
      const ctor = target.constructor;
      const map: Map<string | symbol, Binding[]> | undefined = ctor[DI_META];
      const bindings = map?.get(field) ?? [];

      const c = new Container();
      for (const b of bindings) c.bind(b.name as any).to(b.bind as any);

      const prev = this[field];
      this[field] = c;

      const res = original.apply(this, args);

      // keep container until promise settles
      if (res && typeof (res as any).then === "function") {
        return (res as Promise<any>).finally(() => {
          this[field] = prev;
        }) as any;
      }

      this[field] = prev;
      return res;
    } as TFunc;

    return descriptor;
  };
}
