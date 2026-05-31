// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT = join(process.cwd(), "scripts/add-spdx-header.mjs");
const EXPECTED_HEADER =
  "// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko\n" +
  "// SPDX-License-Identifier: BUSL-1.1\n";

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "add-spdx-header-"));
  tempDirs.push(dir);
  return dir;
}

function runScript(...files: string[]): { stdout: string; stderr: string } {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...files], {
      encoding: "utf8",
    });
    return { stdout, stderr: "" };
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string };
    return {
      stdout: execError.stdout ?? "",
      stderr: execError.stderr ?? "",
    };
  }
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
  it("adds SPDX header to a file without one", () => {
    const file = tempFile("plain.ts", "export const x = 1;\n");

    runScript(file);

    expect(readFileSync(file, "utf8")).toBe(`${EXPECTED_HEADER}\nexport const x = 1;\n`);
  });

  it("skips files that already contain SPDX-License-Identifier in the first 500 chars", () => {
    const existing =
      "// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko\n" +
      "// SPDX-License-Identifier: BUSL-1.1\n\n" +
      "export const x = 1;\n";
    const file = tempFile("already.ts", existing);

    const { stdout } = runScript(file);

    expect(readFileSync(file, "utf8")).toBe(existing);
    expect(stdout).toBe("");
  });

  it("preserves shebang and inserts header after it", () => {
    const file = tempFile("shebang.mjs", "#!/usr/bin/env node\nconsole.log('hi');\n");

    runScript(file);

    expect(readFileSync(file, "utf8")).toBe(
      `#!/usr/bin/env node\n${EXPECTED_HEADER}\nconsole.log('hi');\n`,
    );
  });

  it("handles shebang-only file without trailing newline", () => {
    const file = tempFile("shebang-only.mjs", "#!/usr/bin/env node");

    runScript(file);

    expect(readFileSync(file, "utf8")).toBe(`#!/usr/bin/env node\n${EXPECTED_HEADER}\n`);
  });

  it("does not add extra newline when body already starts with one", () => {
    const file = tempFile("leading-newline.ts", "\nexport const x = 1;\n");

    runScript(file);

    expect(readFileSync(file, "utf8")).toBe(`${EXPECTED_HEADER}\nexport const x = 1;\n`);
  });

  it("processes multiple files and reports how many were updated", () => {
    const file1 = tempFile("one.ts", "const a = 1;\n");
    const file2 = tempFile("two.ts", "const b = 2;\n");
    const existing =
      "// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko\n" +
      "// SPDX-License-Identifier: BUSL-1.1\n\n" +
      "const c = 3;\n";
    const file3 = tempFile("three.ts", existing);

    const { stdout } = runScript(file1, file2, file3);

    expect(readFileSync(file1, "utf8")).toBe(`${EXPECTED_HEADER}\nconst a = 1;\n`);
    expect(readFileSync(file2, "utf8")).toBe(`${EXPECTED_HEADER}\nconst b = 2;\n`);
    expect(readFileSync(file3, "utf8")).toBe(existing);
    expect(stdout).toBe("SPDX: added headers to 2 file(s)\n");
  });

  it("prints nothing when no files need updating", () => {
    const existing =
      "// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko\n" +
      "// SPDX-License-Identifier: BUSL-1.1\n\n" +
      "export const x = 1;\n";
    const file = tempFile("unchanged.ts", existing);

    const { stdout } = runScript(file);

    expect(stdout).toBe("");
  });

  it("prints nothing when invoked with no file arguments", () => {
    const { stdout } = runScript();

    expect(stdout).toBe("");
  });
});
