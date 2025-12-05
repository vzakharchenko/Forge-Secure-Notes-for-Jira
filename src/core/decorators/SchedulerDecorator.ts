import "reflect-metadata";

type Class<T = unknown> = new (...args: any[]) => T;

export const schedulerTrigger = <T extends Class>(ctor: T): T => {
  // проверяем наличие handler на прототипе
  if (typeof (ctor as any)?.prototype?.handler !== "function") {
    const name = (ctor as any).name ?? "<anonymous>";
    // eslint-disable-next-line no-console
    console.error(
      `@schedulerTrigger can only be used on classes implementing SchedulerTrigger (got: ${name})`,
    );
    throw new Error(
      `@schedulerTrigger can only be used on classes implementing SchedulerTrigger (got: ${name})`,
    );
  }

  Reflect.defineMetadata("__isScheduler", true, ctor);
  return ctor;
};

export function isSchedulerTrigger(target: object | Function): boolean {
  const ctor = typeof target === "function" ? target : (target as any).constructor;
  return Boolean(Reflect.getMetadata("__isScheduler", ctor));
}
