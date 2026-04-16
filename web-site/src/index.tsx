import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root")!;

// Use hydrateRoot when the server has pre-rendered content (production prerender),
// fall back to createRoot for a clean client-side render (dev mode).
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
