// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const SCRIPT_SPECIFIER = "../../scripts/add-spdx-header.mjs";
// Tokens split so the REUSE scanner does not parse these fixtures as real SPDX
// license expressions (matches the convention used by the script under test).
const TAG_COPY = "SPDX-File" + "CopyrightText";
const TAG_LIC = "SPDX-License" + "-Identifier";
const EXPECTED_HEADER =
  `// ${TAG_COPY}: 2025 Trust Logic / Vasyl Zakharchenko\n` + `// ${TAG_LIC}: BUSL-1.1\n`;

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "add-spdx-header-"));
  tempDirs.push(dir);
  return dir;
}

/**
 * Runs the script in-process so V8 coverage attributes its execution to the
 * source file. The script has no exports and does all of its work at module
 * top level driven by `process.argv`, so we swap argv, re-evaluate the module
 * via `vi.resetModules()`, and capture what it writes to stdout.
 */
async function runScript(...files: string[]): Promise<{ stdout: string }> {
  let stdout = "";
  const spy = vi
    .spyOn(process.stdout, "write")
    .mockImplementation((chunk: string | Uint8Array): boolean => {
      stdout += typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8");
      return true;
    });
  const originalArgv = process.argv;
  process.argv = [process.execPath, "add-spdx-header.mjs", ...files];
  try {
    vi.resetModules();
    await import(SCRIPT_SPECIFIER);
  } finally {
    process.argv = originalArgv;
    spy.mockRestore();
  }
  return { stdout };
}

function tempFile(name: string, content: string): string {
  const path = join(makeTempDir(), name);
  writeFileSync(path, content, "utf8");
  return path;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
});

describe("add-spdx-header.mjs", () => {
  it("adds SPDX header to a file without one", async () => {
    const file = tempFile("plain.ts", "export const x = 1;\n");

    await runScript(file);

    expect(readFileSync(file, "utf8")).toBe(`${EXPECTED_HEADER}\nexport const x = 1;\n`);
  });

  it("skips files that already contain SPDX-License-Identifier in the first 500 chars", async () => {
    const existing = `${EXPECTED_HEADER}\nexport const x = 1;\n`;
    const file = tempFile("already.ts", existing);

    const { stdout } = await runScript(file);

    expect(readFileSync(file, "utf8")).toBe(existing);
    expect(stdout).toBe("");
  });

  it("preserves shebang and inserts header after it", async () => {
    const file = tempFile("shebang.mjs", "#!/usr/bin/env node\nconsole.log('hi');\n");

    await runScript(file);

    expect(readFileSync(file, "utf8")).toBe(
      `#!/usr/bin/env node\n${EXPECTED_HEADER}\nconsole.log('hi');\n`,
    );
  });

  it("handles shebang-only file without trailing newline", async () => {
    const file = tempFile("shebang-only.mjs", "#!/usr/bin/env node");

    await runScript(file);

    expect(readFileSync(file, "utf8")).toBe(`#!/usr/bin/env node\n${EXPECTED_HEADER}\n`);
  });

  it("does not add extra newline when body already starts with one", async () => {
    const file = tempFile("leading-newline.ts", "\nexport const x = 1;\n");

    await runScript(file);

    expect(readFileSync(file, "utf8")).toBe(`${EXPECTED_HEADER}\nexport const x = 1;\n`);
  });

  it("processes multiple files and reports how many were updated", async () => {
    const file1 = tempFile("one.ts", "const a = 1;\n");
    const file2 = tempFile("two.ts", "const b = 2;\n");
    const existing = `${EXPECTED_HEADER}\nconst c = 3;\n`;
    const file3 = tempFile("three.ts", existing);

    const { stdout } = await runScript(file1, file2, file3);

    expect(readFileSync(file1, "utf8")).toBe(`${EXPECTED_HEADER}\nconst a = 1;\n`);
    expect(readFileSync(file2, "utf8")).toBe(`${EXPECTED_HEADER}\nconst b = 2;\n`);
    expect(readFileSync(file3, "utf8")).toBe(existing);
    expect(stdout).toBe("SPDX: added headers to 2 file(s)\n");
  });

  it("prints nothing when no files need updating", async () => {
    const existing = `${EXPECTED_HEADER}\nexport const x = 1;\n`;
    const file = tempFile("unchanged.ts", existing);

    const { stdout } = await runScript(file);

    expect(stdout).toBe("");
  });

  it("prints nothing when invoked with no file arguments", async () => {
    const { stdout } = await runScript();

    expect(stdout).toBe("");
  });
});
