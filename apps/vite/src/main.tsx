import React from "react";
import ReactDOM from "react-dom/client";

import { setupI18n } from "@acme/translations";

import "@fontsource-variable/noto-sans";
import "~/assets/styles.css";

import { App } from "~/App";
import { setupAuth } from "~/lib/auth";

setupAuth();
setupI18n().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
