import { ActualResolver } from "../../controllers";
import { ErrorResponse } from "../../../shared/Types";

export const resolver = <T extends new (...args: any[]) => any>(constructor: T): T => {
  if (!("prototype" in constructor) || typeof constructor.prototype.response !== "function") {
    throw new Error(`@resolver you can use only with ActualResolver`);
  }

  Reflect.defineMetadata("__isResolver", true, constructor);

  return constructor;
};

export const isResolver = <T extends ErrorResponse>(target: ActualResolver<T>): unknown =>
  Reflect.getMetadata("__isResolver", target.constructor);
