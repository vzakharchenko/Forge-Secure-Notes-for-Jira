// дшиы
import React from "react";
import { createRoot } from "react-dom/client";

// helpers
import { initializeTheming } from "@src/shared/utils/theming";

// styles
import "@atlaskit/css-reset/dist/bundle.css";
import "@atlaskit/css-reset";

// components
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

const renderApp = () => {
  root.render(<App />);
};

initializeTheming()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(renderApp);
