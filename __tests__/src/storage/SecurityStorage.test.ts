import { describe, it, expect, vi, beforeEach } from "vitest";
import { SecurityStorage } from "../../../src/storage";
import { kvs } from "@forge/kvs";

// Mock @forge/kvs
vi.mock("@forge/kvs", () => {
  const mockKvs = {
    deleteSecret: vi.fn(),
    getSecret: vi.fn(),
    setSecret: vi.fn(),
  };
  return {
    kvs: mockKvs,
  };
});

describe("SecurityStorage", () => {
  let securityStorage: SecurityStorage;
  const mockKvs = vi.mocked(kvs);

  beforeEach(() => {
    securityStorage = new SecurityStorage();
    vi.clearAllMocks();
  });

  describe("deletePayload", () => {
    it("should call kvs.deleteSecret with the correct id", async () => {
      const id = "test-id-123";
      mockKvs.deleteSecret.mockResolvedValue(undefined);

      await securityStorage.deletePayload(id);

      expect(mockKvs.deleteSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.deleteSecret).toHaveBeenCalledWith(id);
    });

    it("should handle errors from kvs.deleteSecret", async () => {
      const id = "test-id-123";
      const error = new Error("Delete failed");
      mockKvs.deleteSecret.mockRejectedValue(error);

      await expect(securityStorage.deletePayload(id)).rejects.toThrow("Delete failed");

      expect(mockKvs.deleteSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.deleteSecret).toHaveBeenCalledWith(id);
    });
  });

  describe("getPayload", () => {
    it("should return the payload from kvs.getSecret", async () => {
      const id = "test-id-123";
      const expectedPayload = "encrypted-payload-data";
      mockKvs.getSecret.mockResolvedValue(expectedPayload);

      const result = await securityStorage.getPayload(id);

      expect(result).toBe(expectedPayload);
      expect(mockKvs.getSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.getSecret).toHaveBeenCalledWith(id);
    });

    it("should return undefined when kvs.getSecret returns undefined", async () => {
      const id = "non-existent-id";
      mockKvs.getSecret.mockResolvedValue(undefined);

      const result = await securityStorage.getPayload(id);

      expect(result).toBeUndefined();
      expect(mockKvs.getSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.getSecret).toHaveBeenCalledWith(id);
    });

    it("should handle errors from kvs.getSecret", async () => {
      const id = "test-id-123";
      const error = new Error("Get failed");
      mockKvs.getSecret.mockRejectedValue(error);

      await expect(securityStorage.getPayload(id)).rejects.toThrow("Get failed");

      expect(mockKvs.getSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.getSecret).toHaveBeenCalledWith(id);
    });
  });

  describe("savePayload", () => {
    it("should call kvs.setSecret with the correct id and payload", async () => {
      const id = "test-id-123";
      const payload = "encrypted-payload-data";
      mockKvs.setSecret.mockResolvedValue(undefined);

      await securityStorage.savePayload(id, payload);

      expect(mockKvs.setSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.setSecret).toHaveBeenCalledWith(id, payload);
    });

    it("should handle errors from kvs.setSecret", async () => {
      const id = "test-id-123";
      const payload = "encrypted-payload-data";
      const error = new Error("Save failed");
      mockKvs.setSecret.mockRejectedValue(error);

      await expect(securityStorage.savePayload(id, payload)).rejects.toThrow("Save failed");

      expect(mockKvs.setSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.setSecret).toHaveBeenCalledWith(id, payload);
    });

    it("should handle empty payload", async () => {
      const id = "test-id-123";
      const payload = "";
      mockKvs.setSecret.mockResolvedValue(undefined);

      await securityStorage.savePayload(id, payload);

      expect(mockKvs.setSecret).toHaveBeenCalledTimes(1);
      expect(mockKvs.setSecret).toHaveBeenCalledWith(id, payload);
    });
  });
});
