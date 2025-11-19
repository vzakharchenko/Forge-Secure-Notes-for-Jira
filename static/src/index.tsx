// libs
import React from "react";
import { createRoot } from "react-dom/client";

// helpers
import { initializeTheming } from "@src/shared/utils/theming";
import "@src/shared/validation/yupMethods";

// styles
import "@src/styles/index.scss";

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
