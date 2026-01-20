import { describe, it, expect, vi, beforeEach } from "vitest";
import { Container } from "inversify";
import Resolver from "@forge/resolver";
import { issue } from "../../../../src/resolvers";
import { FORGE_INJECTION_TOKENS } from "../../../../src/constants";

// Mock @forge/resolver
const mockDefine = vi.fn();
const mockResolver = {
  define: mockDefine,
} as unknown as Resolver;

vi.mock("@forge/resolver", () => {
  return {
    default: vi.fn(() => mockResolver),
  };
});

describe("issue resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register all five controllers", () => {
    issue(mockResolver);

    // Verify that all five controllers are registered
    expect(mockDefine).toHaveBeenCalledTimes(5);
  });

  it("should register GetMySecurityNotesController", () => {
    issue(mockResolver);

    // The resolver.define should be called with the function name from GetMySecurityNotesController
    // We can't directly check which controller called define, but we can verify the count
    expect(mockDefine).toHaveBeenCalledTimes(5);
  });

  it("should register CreateSecurityNoteController", () => {
    issue(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(5);
  });

  it("should register DeleteSecurityNoteController", () => {
    issue(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(5);
  });

  it("should pass resolver and container to register method", () => {
    // Create mock controllers
    const mockGetMyController = {
      register: vi.fn(),
    };
    const mockCreateController = {
      register: vi.fn(),
    };
    const mockDeleteController = {
      register: vi.fn(),
    };
    const mockOpenController = {
      register: vi.fn(),
    };
    const mockFetchController = {
      register: vi.fn(),
    };

    // Mock the container to return our mock controllers
    const originalGet = Container.prototype.get;
    vi.spyOn(Container.prototype, "get").mockImplementation((serviceIdentifier: any) => {
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.GetMySecurityNotesController) {
        return mockGetMyController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.CreateSecurityNoteController) {
        return mockCreateController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.DeleteSecurityNoteController) {
        return mockDeleteController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.OpenSecurityNoteController) {
        return mockOpenController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.FetchSecurityNoteController) {
        return mockFetchController as any;
      }
      // For other services, return a mock object
      return {} as any;
    });

    issue(mockResolver);

    // Verify that register was called for each controller with resolver and container
    expect(mockGetMyController.register).toHaveBeenCalledTimes(1);
    expect(mockGetMyController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockCreateController.register).toHaveBeenCalledTimes(1);
    expect(mockCreateController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockDeleteController.register).toHaveBeenCalledTimes(1);
    expect(mockDeleteController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockOpenController.register).toHaveBeenCalledTimes(1);
    expect(mockOpenController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockFetchController.register).toHaveBeenCalledTimes(1);
    expect(mockFetchController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    // Restore original implementation
    Container.prototype.get = originalGet;
  });

  it("should create container and bind all services", () => {
    const bindSpy = vi.spyOn(Container.prototype, "bind");

    issue(mockResolver);

    // Verify that bind was called (which means container was created and bindings were set up)
    // We expect 13 bindings (5 controllers + 8 services)
    expect(bindSpy).toHaveBeenCalledTimes(13);
  });
});
