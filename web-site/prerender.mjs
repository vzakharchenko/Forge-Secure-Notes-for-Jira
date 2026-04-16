/**
 * Static prerender script — runs after `vite build` to inject server-rendered HTML
 * into the built index.html, making all page content visible to search crawlers
 * on first request without JavaScript execution.
 *
 * Usage: node prerender.mjs
 * Integrated via the `build` npm script: "vite build && node prerender.mjs"
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  const vite = await createServer({
    root: __dirname,
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
    const appHtml = render();

    const buildDir = process.env.BUILD_PATH
      ? path.resolve(__dirname, process.env.BUILD_PATH)
      : path.resolve(__dirname, "site");

    const templatePath = path.join(buildDir, "index.html");
    const template = fs.readFileSync(templatePath, "utf-8");

    // Normalize first so the script is idempotent if run more than once
    const normalized = template.replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
    const html = normalized.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    fs.writeFileSync(templatePath, html);
    console.log("✅ Prerendered: /");
  } finally {
    await vite.close();
  }
}

prerender().catch((err) => {
  console.error("❌ Prerender failed:", err);
  process.exit(1);
});
