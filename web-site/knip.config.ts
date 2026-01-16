import type { KnipConfig } from "knip";
import { defaultConfig } from "../knip.config";

const config: KnipConfig = {
  ...defaultConfig,
  project: ["src/**"],
  ignoreDependencies: ["@tailwindcss/vite"],
} as KnipConfig;

export default config;
