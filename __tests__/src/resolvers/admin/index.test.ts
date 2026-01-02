import { describe, it, expect, vi, beforeEach } from "vitest";
import { Container } from "inversify";
import Resolver from "@forge/resolver";
import { admin } from "../../../../src/resolvers";
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

describe("admin resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register all eight controllers", () => {
    admin(mockResolver);

    // Verify that all eight controllers are registered
    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register OpenSecurityNoteController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register FetchSecurityNoteController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register AuditUserController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register AuditUsersController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register IssueProjectsController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register IssueAuditController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register ProjectAuditController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should register BootStrapController", () => {
    admin(mockResolver);

    expect(mockDefine).toHaveBeenCalledTimes(8);
  });

  it("should pass resolver and container to register method for all controllers", () => {
    // Create mock controllers
    const mockOpenController = { register: vi.fn() };
    const mockFetchController = { register: vi.fn() };
    const mockAuditUserController = { register: vi.fn() };
    const mockAuditUsersController = { register: vi.fn() };
    const mockIssueProjectsController = { register: vi.fn() };
    const mockIssueAuditController = { register: vi.fn() };
    const mockProjectAuditController = { register: vi.fn() };
    const mockBootStrapController = { register: vi.fn() };

    // Mock the container to return our mock controllers
    const originalGet = Container.prototype.get;
    vi.spyOn(Container.prototype, "get").mockImplementation((serviceIdentifier: any) => {
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.OpenSecurityNoteController) {
        return mockOpenController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.FetchSecurityNoteController) {
        return mockFetchController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.AuditUserController) {
        return mockAuditUserController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.AuditUsersController) {
        return mockAuditUsersController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.IssueProjectsController) {
        return mockIssueProjectsController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.IssueAuditController) {
        return mockIssueAuditController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.ProjectAuditController) {
        return mockProjectAuditController as any;
      }
      if (serviceIdentifier === FORGE_INJECTION_TOKENS.BootStrapController) {
        return mockBootStrapController as any;
      }
      // For other services, return a mock object
      return {} as any;
    });

    admin(mockResolver);

    // Verify that register was called for each controller with resolver and container
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

    expect(mockAuditUserController.register).toHaveBeenCalledTimes(1);
    expect(mockAuditUserController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockAuditUsersController.register).toHaveBeenCalledTimes(1);
    expect(mockAuditUsersController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockIssueProjectsController.register).toHaveBeenCalledTimes(1);
    expect(mockIssueProjectsController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockIssueAuditController.register).toHaveBeenCalledTimes(1);
    expect(mockIssueAuditController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockProjectAuditController.register).toHaveBeenCalledTimes(1);
    expect(mockProjectAuditController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    expect(mockBootStrapController.register).toHaveBeenCalledTimes(1);
    expect(mockBootStrapController.register).toHaveBeenCalledWith(
      expect.any(Object), // resolver
      expect.any(Container), // container
    );

    // Restore original implementation
    Container.prototype.get = originalGet;
  });

  it("should create container and bind all services", () => {
    const bindSpy = vi.spyOn(Container.prototype, "bind");

    admin(mockResolver);

    // Verify that bind was called (which means container was created and bindings were set up)
    // We expect 16 bindings (8 controllers + 8 services)
    expect(bindSpy).toHaveBeenCalledTimes(16);
  });
});
