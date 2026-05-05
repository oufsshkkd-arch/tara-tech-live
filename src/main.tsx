import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const CACHE_KILL_SWITCH_KEY = "taratech-sw-kill-switch-v1";

function readKillSwitchFlag() {
  try {
    return window.sessionStorage.getItem(CACHE_KILL_SWITCH_KEY);
  } catch {
    return null;
  }
}

function writeKillSwitchFlag() {
  try {
    window.sessionStorage.setItem(CACHE_KILL_SWITCH_KEY, "1");
  } catch {
    // Ignore storage errors; the unregister/delete work already ran.
  }
}

async function killOldServiceWorkers() {
  if (!("serviceWorker" in navigator)) return true;

  try {
    const hadController = Boolean(navigator.serviceWorker.controller);
    const registrations = await navigator.serviceWorker.getRegistrations();

    await Promise.all(registrations.map((registration) => registration.unregister()));

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    if ((hadController || registrations.length > 0) && !readKillSwitchFlag()) {
      writeKillSwitchFlag();
      window.location.reload();
      return false;
    }
  } catch (error) {
    console.warn("Service worker kill-switch failed:", error);
  }

  return true;
}

async function bootstrap() {
  const shouldRender = await killOldServiceWorkers();
  if (!shouldRender) return;

  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

void bootstrap();
