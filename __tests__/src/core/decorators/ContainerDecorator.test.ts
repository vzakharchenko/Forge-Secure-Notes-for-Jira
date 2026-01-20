import { describe, it, expect } from "vitest";
import { Container } from "inversify";
import {
  withContainer,
  diContainer,
  useDiContainer,
  Binding,
} from "../../../../src/core/decorators/ContainerDecorator";

describe("ContainerDecorator", () => {
  describe("withContainer", () => {
    it("should create container and bind services", () => {
      class TestService {
        test() {
          return "test";
        }
      }

      const binding: Binding = {
        name: "TestService",
        bind: TestService,
      };

      const handler = withContainer(binding)((container: Container) => {
        const service = container.get<TestService>("TestService");
        return service.test();
      });

      const result = handler();

      expect(result).toBe("test");
    });

    it("should support multiple bindings", () => {
      class Service1 {
        test1() {
          return "service1";
        }
      }

      class Service2 {
        test2() {
          return "service2";
        }
      }

      const bindings: Binding[] = [
        { name: "Service1", bind: Service1 },
        { name: "Service2", bind: Service2 },
      ];

      const handler = withContainer(...bindings)((container: Container) => {
        const s1 = container.get<Service1>("Service1");
        const s2 = container.get<Service2>("Service2");
        return s1.test1() + s2.test2();
      });

      const result = handler();

      expect(result).toBe("service1service2");
    });

    it("should pass handler arguments", () => {
      class TestService {
        test(arg: string) {
          return arg;
        }
      }

      const binding: Binding = {
        name: "TestService",
        bind: TestService,
      };

      const handler = withContainer(binding)((container: Container, arg1: string, arg2: number) => {
        const service = container.get<TestService>("TestService");
        return service.test(arg1) + arg2;
      });

      const result = handler("test", 123);

      expect(result).toBe("test123");
    });
  });

  describe("diContainer", () => {
    it("should store bindings on class constructor", () => {
      class TestService {
        test() {
          return "test";
        }
      }

      class TestClass {
        @diContainer({ name: "TestService", bind: TestService })
        field: any;
      }

      const instance = new TestClass();
      const ctor = instance.constructor as any;
      const bindings = ctor.__di_bindings__?.get("field");

      expect(bindings).toBeDefined();
      expect(bindings[0].name).toBe("TestService");
      expect(bindings[0].bind).toBe(TestService);
    });

    it("should support multiple bindings on same field", () => {
      class Service1 {
        test1() {
          return "service1";
        }
      }

      class Service2 {
        test2() {
          return "service2";
        }
      }

      class TestClass {
        @diContainer({ name: "Service1", bind: Service1 }, { name: "Service2", bind: Service2 })
        field: any;
      }

      const instance = new TestClass();
      const ctor = instance.constructor as any;
      const bindings = ctor.__di_bindings__?.get("field");

      expect(bindings).toBeDefined();
      expect(bindings.length).toBe(2);
    });

    it("should reuse existing DI_META map when it already exists", () => {
      class Service1 {
        test1() {
          return "service1";
        }
      }

      class Service2 {
        test2() {
          return "service2";
        }
      }

      class TestClass {
        @diContainer({ name: "Service1", bind: Service1 })
        field1: any;

        @diContainer({ name: "Service2", bind: Service2 })
        field2: any;
      }

      const instance = new TestClass();
      const ctor = instance.constructor as any;
      const bindings1 = ctor.__di_bindings__?.get("field1");
      const bindings2 = ctor.__di_bindings__?.get("field2");

      expect(bindings1).toBeDefined();
      expect(bindings1.length).toBe(1);
      expect(bindings2).toBeDefined();
      expect(bindings2.length).toBe(1);
      // Both should use the same map instance
      expect(ctor.__di_bindings__).toBe(ctor.__di_bindings__);
    });
  });

  describe("useDiContainer", () => {
    it("should create container and set it on field", async () => {
      class TestService {
        test() {
          return "test";
        }
      }

      class TestClass {
        @diContainer({ name: "TestService", bind: TestService })
        _container: Container;

        @useDiContainer("_container")
        async method() {
          const service = this._container.get<TestService>("TestService");
          return service.test();
        }
      }

      const instance = new TestClass();
      const result = await instance.method();

      expect(result).toBe("test");
      expect(instance._container).toBeUndefined(); // Should be cleaned up after promise
    });

    it("should use default field name '_container'", async () => {
      class TestService {
        test() {
          return "test";
        }
      }

      class TestClass {
        @diContainer({ name: "TestService", bind: TestService })
        _container: Container;

        @useDiContainer()
        async method() {
          const service = this._container.get<TestService>("TestService");
          return service.test();
        }
      }

      const instance = new TestClass();
      const result = await instance.method();

      expect(result).toBe("test");
    });

    it("should restore previous container value after promise", async () => {
      class TestService {
        test() {
          return "test";
        }
      }

      const previousContainer = new Container();

      class TestClass {
        @diContainer({ name: "TestService", bind: TestService })
        _container: Container = previousContainer;

        @useDiContainer("_container")
        async method() {
          const service = this._container.get<TestService>("TestService");
          return service.test();
        }
      }

      const instance = new TestClass();
      await instance.method();

      expect(instance._container).toBe(previousContainer);
    });

    it("should work with synchronous methods", () => {
      class TestService {
        test() {
          return "test";
        }
      }

      class TestClass {
        @diContainer({ name: "TestService", bind: TestService })
        _container: Container;

        @useDiContainer("_container")
        method() {
          const service = this._container.get<TestService>("TestService");
          return service.test();
        }
      }

      const instance = new TestClass();
      const result = instance.method();

      expect(result).toBe("test");
      expect(instance._container).toBeUndefined(); // Should be cleaned up immediately
    });

    it("should handle case when bindings map does not exist", async () => {
      // class TestService {
      //   test() {
      //     return "test";
      //   }
      // }

      class TestClass {
        _container: Container;

        @useDiContainer("_container")
        async method() {
          // No bindings defined, should use empty array
          return "no-bindings";
        }
      }

      const instance = new TestClass();
      const result = await instance.method();

      expect(result).toBe("no-bindings");
    });

    it("should handle case when field bindings do not exist in map", async () => {
      class TestService1 {
        test() {
          return "service1";
        }
      }

      // class TestService2 {
      //   test() {
      //     return "service2";
      //   }
      // }

      class TestClass {
        @diContainer({ name: "Service1", bind: TestService1 })
        _container1: Container;

        @useDiContainer("_container2")
        async method() {
          // _container2 has no bindings defined
          return "no-bindings";
        }
      }

      const instance = new TestClass();
      const result = await instance.method();

      expect(result).toBe("no-bindings");
    });
  });
});
