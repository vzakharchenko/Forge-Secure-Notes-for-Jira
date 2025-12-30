import { isResolver } from "./ResolverDecorator";
import { Request } from "@forge/resolver";
import { ActualResolver } from "../../controllers";
import { ErrorResponse } from "../../../shared/Types";
import { getValidationErrors } from "../../../shared/CommonValidator";

export const validBodyHandler = <T extends object>(validateClass: new () => T) => {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]): Promise<ErrorResponse> {
      if (!isResolver(this as ActualResolver<ErrorResponse>)) {
        throw new Error(`Error: @validBodyHandler can use only with @resolver.`);
      }
      const validationErrors = await getValidationErrors(args[0] as Request, validateClass);
      if (Object.keys(validationErrors).length > 0) {
        return {
          isError: true,
          errorType: "VALIDATION",
          message: "validation Error",
          validationErrors,
        };
      }
      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
};
