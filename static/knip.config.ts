import type { KnipConfig } from "knip";
import { defaultConfig } from "../knip.config";

const config: KnipConfig = {
  ...defaultConfig,
  project: ["src/**"],
  ignoreDependencies: ["@atlaskit/css-reset", "@types/react-router-dom", "history"],
};

export default config;
