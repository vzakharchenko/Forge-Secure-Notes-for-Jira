import { describe, it, expect } from "vitest";
import "reflect-metadata";
import { schedulerTrigger, isSchedulerTrigger } from "../../../../src/core";
import { SchedulerTrigger } from "../../../../src/core";

describe("SchedulerDecorator", () => {
  describe("schedulerTrigger", () => {
    it("should mark class as scheduler trigger when it has handler method", () => {
      class TestSchedulerTrigger extends SchedulerTrigger {
        async handler() {
          return { statusCode: 200, body: "Success" };
        }
      }

      const DecoratedScheduler = schedulerTrigger(TestSchedulerTrigger);
      const instance = new DecoratedScheduler();

      expect(isSchedulerTrigger(instance)).toBe(true);
    });

    it("should throw error when class does not have handler method", () => {
      class InvalidScheduler {
        test() {
          return "test";
        }
      }

      expect(() => schedulerTrigger(InvalidScheduler as any)).toThrow(
        "@schedulerTrigger can only be used on classes implementing SchedulerTrigger",
      );
    });

    it("should throw error with class name when handler is missing", () => {
      class NamedClass {
        test() {
          return "test";
        }
      }

      expect(() => schedulerTrigger(NamedClass as any)).toThrow("got: NamedClass");
    });

    it("should return the same constructor", () => {
      class TestSchedulerTrigger extends SchedulerTrigger {
        async handler() {
          return { statusCode: 200, body: "Success" };
        }
      }

      const DecoratedScheduler = schedulerTrigger(TestSchedulerTrigger);

      expect(DecoratedScheduler).toBe(TestSchedulerTrigger);
    });
  });

  describe("isSchedulerTrigger", () => {
    it("should return true for scheduler trigger instance", () => {
      @schedulerTrigger
      class TestSchedulerTrigger extends SchedulerTrigger {
        async handler() {
          return { statusCode: 200, body: "Success" };
        }
      }

      const instance = new TestSchedulerTrigger();

      expect(isSchedulerTrigger(instance)).toBe(true);
    });

    it("should return true for scheduler trigger class", () => {
      @schedulerTrigger
      class TestSchedulerTrigger extends SchedulerTrigger {
        async handler() {
          return { statusCode: 200, body: "Success" };
        }
      }

      expect(isSchedulerTrigger(TestSchedulerTrigger)).toBe(true);
    });

    it("should return false for non-scheduler trigger instance", () => {
      class NotScheduler {
        test() {
          return "test";
        }
      }

      const instance = new NotScheduler();

      expect(isSchedulerTrigger(instance)).toBe(false);
    });
  });
});
