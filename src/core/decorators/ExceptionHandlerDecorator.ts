import { isResolver } from "./ResolverDecorator";
import { isSchedulerTrigger } from "./SchedulerDecorator";
import { SchedulerTrigger, SchedulerTriggerResponse } from "../triggers";
import { ErrorResponse } from "../../../shared/Types";
import { ActualResolver } from "../../controllers";

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
        const error = e?.cause ?? e;
        if (error.debug) {
          // eslint-disable-next-line no-console
          console.error("SQL Error :" + JSON.stringify(error.debug));
        } else {
          // eslint-disable-next-line no-console
          console.error(`Catch Exception ${propertyKey}: ${e.message}`, e);
        }
        return {
          isError: true,
          errorType: "GENERAL",
          message: error.message,
        };
      }
    };

    return descriptor;
  };

export const exceptionHandlerTrigger =
  (errorMessage?: string) =>
  (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (
      ...args: unknown[]
    ): Promise<SchedulerTriggerResponse<unknown>> {
      const schedulerTriggerInstance = this as SchedulerTrigger;
      if (!isSchedulerTrigger(schedulerTriggerInstance)) {
        // eslint-disable-next-line no-console
        console.log(`Error: @exceptionHandlerTrigger can use only with @schedulerTrigger.`);
        throw new Error(`Error: @exceptionHandlerTrigger can use only with @schedulerTrigger.`);
      }
      try {
        return await originalMethod.apply(schedulerTriggerInstance, args);
      } catch (e) {
        if (e.debug) {
          throw new Error("SQL Error :" + JSON.stringify(e.debug));
        } else {
          // eslint-disable-next-line no-console
          console.error(`Catch Trigger Exception ${propertyKey}: ${e.message}`, e);
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
