import {SchedulerTrigger} from "../trigger/SchedulerTrigger";

export const schedulerTrigger = <T extends { new (...args: unknown[]): unknown }>(constructor: T): T => {
    if (!("prototype" in constructor) || typeof constructor.prototype.handler !== "function") {
        console.error(`@schedulerTrigger you can use only with SchedulerTrigger`);
        throw new Error(`@schedulerTrigger you can use only with SchedulerTrigger`);
    }

    Reflect.defineMetadata("__isScheduler", true, constructor);

    return constructor;
};

export const isSchedulerTrigger = (target: SchedulerTrigger): unknown =>
    Reflect.getMetadata("__isScheduler", target.constructor);
