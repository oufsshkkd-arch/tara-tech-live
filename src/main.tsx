import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { useCms } from "./cms/store";

const root = ReactDOM.createRoot(document.getElementById("root")!);

// Block the first render until Supabase responds so every page load — including
// incognito — shows live data, not stale localStorage or seed defaults.
// Falls back to whatever is in the store (localStorage / seed) if Supabase fails.
useCms.getState().loadFromDb().finally(() => {
  document.getElementById("init-loader")?.remove();
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
