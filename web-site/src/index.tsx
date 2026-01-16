// libs
import React from "react";
import { createRoot } from "react-dom/client";

// styles
import "./index.css";

// components
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

const renderApp = () => {
  root.render(<App />);
};

renderApp();
