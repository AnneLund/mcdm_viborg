import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext.jsx";
import { AlertProvider } from "./context/Alert.jsx";

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
