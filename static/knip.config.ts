import type {KnipConfig} from "knip";
import {defaultConfig} from "../knip.config";

const config: KnipConfig = {
    ...defaultConfig,
    project: ["src/**"],
    ignoreDependencies: [
        "@types/react-router-dom",
        "history"
    ],
};

export default config;
