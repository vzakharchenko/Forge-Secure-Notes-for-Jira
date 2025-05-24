import {isResolver} from "./ResolverDecorator";
import {ActualResolver} from "../resolver/ActualResolver";
import {isSchedulerTrigger} from "./SchedulerDecorator";
import {SchedulerTrigger, SchedulerTriggerResponse} from "../trigger/SchedulerTrigger";
import {ErrorResponse} from "../Types";

export const exceptionHandler =
    () =>
    (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]): Promise<ErrorResponse> {
            if (!isResolver(this as ActualResolver<ErrorResponse>)) {
                throw new Error(`Error: @exceptionHandler can use only with @resolver.`);
            }
            try {
                return await originalMethod.apply(this, args);
            } catch (e) {
                console.error(`Catch Exception ${propertyKey}: ${e.message}`, e);
                if (e.debug) {
                    console.error("SQL Error :" + JSON.stringify(e.debug));
                }
                return {
                    isError: true,
                    message: e.message,
                };
            }
        };

        return descriptor;
    };

export const exceptionHandlerTrigger =
    (errorMessage?: string) =>
    (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]): Promise<SchedulerTriggerResponse<unknown>> {
            const schedulerTrigger: SchedulerTrigger = target as SchedulerTrigger;
            if (!isSchedulerTrigger(schedulerTrigger)) {
                console.log(`Error: @exceptionHandlerTrigger can use only with @schedulerTrigger.`);
                throw new Error(`Error: @exceptionHandlerTrigger can use only with @schedulerTrigger.`);
            }
            try {
                return await originalMethod.apply(schedulerTrigger, args);
            } catch (e) {
                console.error(`Catch Trigger Exception ${propertyKey}: ${e.message}`, e);
                if (e.debug) {
                    throw new Error("SQL Error :" + JSON.stringify(e.debug));
                }
                return {
                    statusCode: 500,
                    statusText: "Bad Request",
                    headers: { "Content-Type": ["application/json"] },
                    body: errorMessage ?? e.message,
                };
            }
        };

        return descriptor;
    };
