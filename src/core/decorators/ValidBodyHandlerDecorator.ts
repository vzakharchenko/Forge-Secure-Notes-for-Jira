import {isResolver} from "./ResolverDecorator";
import {Request} from "@forge/resolver";
import {validate} from "class-validator";
import {ActualResolver} from "../resolver/ActualResolver";
import {ErrorResponse} from "../Types";

export const validBodyHandler = <T extends object>(validateClass: new () => T) => {
    return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]): Promise<ErrorResponse> {
            if (!isResolver(this as ActualResolver<ErrorResponse>)) {
                throw new Error(`Error: @validBodyHandler can use only with @resolver.`);
            }
            const validationErrors = await getValidationErrors(args[0] as Request, validateClass);
            if (validationErrors?.length) {
                return { isError: true, message: "validation Error", validationErrors };
            }
            return await originalMethod.apply(this, args);
        };

        return descriptor;
    };
};

const getValidationErrors = async <T extends object>(req: Request, validateClass: new () => T): Promise<string[]> => {
    if (!req?.payload) {
        return ["empty request"];
    }
    const entity = Object.assign(new validateClass(), req.payload);
    const validationErrors = await validate(entity);
    if (validationErrors && validationErrors.length > 0) {
        return validationErrors.map(v => v.toString());
    }
    return [];
};
