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
      console.log("[App] Service Worker registreret:", registration);

      registration.addEventListener("updatefound", () => {
        if (!registration.installing) return;
        const newWorker = registration.installing;
        console.log("[App] Ny Service Worker fundet!");

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("[App] Ny version er tilgængelig!");

            // Viser en besked i stedet for at tvinge en reload
            alert(
              "En ny version er tilgængelig! Genindlæs siden for at opdatere."
            );
          }
        });
      });
    })
    .catch((error) => console.error("[App] Service Worker fejlede:", error));

  // Lyt efter beskeder fra Service Worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "RELOAD_PAGE") {
      console.log("[App] Ny version tilgængelig, men kræver genindlæsning.");
      alert("En ny version er tilgængelig! Genindlæs siden for at opdatere.");
    }
  });
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
