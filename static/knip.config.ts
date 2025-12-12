import type { KnipConfig } from "knip";
import { defaultConfig } from "../knip.config";

const config: KnipConfig = {
  ...defaultConfig,
  project: ["src/**"],
  ignoreDependencies: [
    "@atlaskit/css-reset",
    "@types/react-router-dom",
    "history",
    "final-form",
    "@forge/resolver",
  ],
} as KnipConfig;

export default config;
