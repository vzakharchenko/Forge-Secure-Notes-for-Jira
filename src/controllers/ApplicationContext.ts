import { AsyncLocalStorage } from "async_hooks";
import { BaseContext } from "../core";

export interface AppContext {
  accountId: string;
  context: BaseContext;
}

export const applicationContext = new AsyncLocalStorage<AppContext>();

export function withAppContext() {
  return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      const context = getAppContext();
      if (!context) {
        // eslint-disable-next-line no-console
        console.error(
          `Context is not set for method ${String(propertyKey)}. Make sure the method is called within appContext.run()`,
        );
        throw new Error(`Context is not set for method ${String(propertyKey)}`);
      }
      return originalMethod.apply(this, [...args, context]);
    };
    return descriptor;
  };
}

export function getAppContext(): AppContext | undefined {
  return applicationContext.getStore();
}
