// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

import type { KnipConfig } from "knip";
import { defaultConfig } from "../knip.config";

const config: KnipConfig = {
  ...defaultConfig,
  project: ["src/**"],
  ignoreDependencies: ["@atlaskit/css-reset", "@types/react-router-dom", "history", "final-form"],
} as KnipConfig;

export default config;
