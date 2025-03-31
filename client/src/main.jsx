import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext.jsx";
import { AlertProvider } from "./context/Alert.jsx";

// if (import.meta.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/service-worker.js")
//     .then((registration) => {
//       console.log("Service Worker registreret:", registration);

//       navigator.serviceWorker.addEventListener("message", (event) => {
//         if (event.data?.type === "RELOAD_PAGE") {
//           console.log("Ny service worker aktiv - Genindlæser siden...");
//           window.location.reload();
//         }
//       });
//     });
// }

// if (import.meta.env.NODE_ENV !== "production" && "serviceWorker" in navigator) {
//   navigator.serviceWorker.getRegistrations().then((registrations) => {
//     for (const registration of registrations) {
//       registration.unregister();
//     }
//   });
// }

// 🔥 Midlertidig fjernelse af alle aktive service workers (for at stoppe cache-problemer)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => {
      console.log("[SW Cleanup] Afregistrerer service worker:", reg.scope);
      reg.unregister();
    });
  });

  // Ryd også cachen (valgfrit – kun hvis du har statiske assets i cache)
  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        console.log("[SW Cleanup] Sletter cache:", cacheName);
        caches.delete(cacheName);
      });
    });
  }
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
