import { isResolver } from "./ResolverDecorator";
import { Request } from "@forge/resolver";
import { validate } from "class-validator";
import { ActualResolver } from "../../controllers";
import { ErrorResponse } from "../../../shared/Types";

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

export const getValidationErrors = async <T extends object>(
  req: Request,
  validateClass: new () => T,
): Promise<Record<string, string[]>> => {
  if (!req?.payload) {
    throw Error("empty request");
  }
  const response: Record<string, string[]> = {};
  const entity = Object.assign(new validateClass(), req.payload);
  const validationErrors = await validate(entity, { stopAtFirstError: true });
  if (validationErrors && validationErrors.length > 0) {
    validationErrors.forEach((error) => {
      const values = response[error.property];
      if (!values) {
        response[error.property] = [Object.values(error.constraints!)[0]];
      } else {
        values.push(error.toString(false, true, undefined, true));
      }
    });
  }
  return response;
};
