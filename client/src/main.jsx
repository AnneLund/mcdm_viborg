import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext.jsx";
import { AlertProvider } from "./context/Alert.jsx";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("[App] New version available. Reloading...");
            if (confirm("En ny version er tilgængelig. Vil du opdatere?")) {
              newWorker.postMessage("skipWaiting");
            }
          }
        });
      });
    })
    .catch((error) =>
      console.error("[App] Service Worker registration failed:", error)
    );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>
);
