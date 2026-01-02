import { describe, it, expect, vi, beforeEach } from "vitest";
import { BootStrapController } from "../../../../src/controllers";
import { BootstrapService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";

describe("BootStrapController", () => {
  let controller: BootStrapController;
  let mockBootstrapService: BootstrapService;

  beforeEach(() => {
    mockBootstrapService = {
      isAdmin: vi.fn(),
    } as unknown as BootstrapService;
    controller = new BootStrapController(mockBootstrapService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.BOOTSTRAP);
    });
  });

  describe("response", () => {
    it("should call isAdmin and return result with isAdmin true", async () => {
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(true);

      const result = await controller.response();

      expect(result).toEqual({ isAdmin: true });
      expect(mockBootstrapService.isAdmin).toHaveBeenCalledTimes(1);
    });

    it("should call isAdmin and return result with isAdmin false", async () => {
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);

      const result = await controller.response();

      expect(result).toEqual({ isAdmin: false });
      expect(mockBootstrapService.isAdmin).toHaveBeenCalledTimes(1);
    });
  });
});
