import { describe, it, expect } from "vitest";
import { SecurityNoteData, PERMISSION_ERROR_OBJECT } from "../../../shared/responses";

describe("SecurityNoteData", () => {
  it("should have required properties", () => {
    const data: SecurityNoteData = {
      id: "note-123",
      iv: "iv-123",
      salt: "salt-123",
      encryptedData: "encrypted-data",
      viewTimeOut: 300,
      expiry: "1d",
    };
    expect(data.id).toBe("note-123");
    expect(data.iv).toBe("iv-123");
    expect(data.salt).toBe("salt-123");
    expect(data.encryptedData).toBe("encrypted-data");
    expect(data.viewTimeOut).toBe(300);
    expect(data.expiry).toBe("1d");
  });

  it("should extend ErrorResponse", () => {
    const data: SecurityNoteData = {
      isError: true,
      errorType: "GENERAL",
      message: "Error message",
      id: "note-123",
      iv: "iv-123",
      salt: "salt-123",
      encryptedData: "encrypted-data",
      viewTimeOut: 300,
      expiry: "1d",
    };
    expect(data.isError).toBe(true);
    expect(data.errorType).toBe("GENERAL");
    expect(data.message).toBe("Error message");
  });
});

describe("PERMISSION_ERROR_OBJECT", () => {
  it("should be a SecurityNoteData object", () => {
    expect(PERMISSION_ERROR_OBJECT).toBeDefined();
    expect(typeof PERMISSION_ERROR_OBJECT).toBe("object");
  });

  it("should have isError set to true", () => {
    expect(PERMISSION_ERROR_OBJECT.isError).toBe(true);
  });

  it("should have errorType set to NO_PERMISSION", () => {
    expect(PERMISSION_ERROR_OBJECT.errorType).toBe("NO_PERMISSION");
  });

  it("should have all required SecurityNoteData properties", () => {
    expect(PERMISSION_ERROR_OBJECT.id).toBeDefined();
    expect(PERMISSION_ERROR_OBJECT.iv).toBeDefined();
    expect(PERMISSION_ERROR_OBJECT.salt).toBeDefined();
    expect(PERMISSION_ERROR_OBJECT.encryptedData).toBeDefined();
    expect(PERMISSION_ERROR_OBJECT.viewTimeOut).toBe(300);
    expect(PERMISSION_ERROR_OBJECT.expiry).toBeDefined();
  });

  it("should have empty string values for id, iv, salt, encryptedData, expiry", () => {
    expect(PERMISSION_ERROR_OBJECT.id).toBe("");
    expect(PERMISSION_ERROR_OBJECT.iv).toBe("");
    expect(PERMISSION_ERROR_OBJECT.salt).toBe("");
    expect(PERMISSION_ERROR_OBJECT.encryptedData).toBe("");
    expect(PERMISSION_ERROR_OBJECT.expiry).toBe("");
  });
});
