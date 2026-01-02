import { describe, it, expect } from "vitest";
import { formatDateTime, formatDate, defaultDateForDatePicker } from "../../../../src/core";

describe("dateUtils", () => {
  describe("formatDateTime", () => {
    it("should format date with time", () => {
      const date = new Date("2024-01-15T14:30:00Z");

      const result = formatDateTime(date);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      // Format: "MMMM dd, yyyy hh:mm a"
      expect(result).toMatch(/\w+ \d{2}, \d{4} \d{2}:\d{2} (AM|PM)/);
    });

    it("should format different dates correctly", () => {
      const date1 = new Date("2024-01-15T14:30:00Z");
      const date2 = new Date("2024-12-25T09:15:00Z");

      const result1 = formatDateTime(date1);
      const result2 = formatDateTime(date2);

      expect(result1).not.toBe(result2);
    });
  });

  describe("formatDate", () => {
    it("should format date without time", () => {
      const date = new Date("2024-01-15T14:30:00Z");

      const result = formatDate(date);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      // Format: "MMMM dd, yyyy"
      expect(result).toMatch(/\w+ \d{2}, \d{4}/);
      expect(result).not.toMatch(/:\d{2}/); // Should not contain time
    });

    it("should format different dates correctly", () => {
      const date1 = new Date("2024-01-15T14:30:00Z");
      const date2 = new Date("2024-12-25T09:15:00Z");

      const result1 = formatDate(date1);
      const result2 = formatDate(date2);

      expect(result1).not.toBe(result2);
    });
  });

  describe("defaultDateForDatePicker", () => {
    it("should format date for date picker", () => {
      const date = new Date("2024-01-15T14:30:00Z");

      const result = defaultDateForDatePicker(date);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      // Format: "MMMM dd, yyyy"
      expect(result).toMatch(/\w+ \d{2}, \d{4}/);
    });

    it("should return same format as formatDate", () => {
      const date = new Date("2024-01-15T14:30:00Z");

      const result1 = formatDate(date);
      const result2 = defaultDateForDatePicker(date);

      expect(result1).toBe(result2);
    });
  });
});
