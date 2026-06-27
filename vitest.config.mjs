import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: {
    decorator: {
      legacy: true,
      emitDecoratorMetadata: false,
    },
  },
  test: {
    globals: true,
    mockReset: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src", "scripts", "shared"],
      reportsDirectory: "./coverage",
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
    include: ["src/**/*.test.ts", "__tests__/**/*.test.ts"],
  },
});
