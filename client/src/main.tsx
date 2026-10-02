import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import { SiteContentProvider } from "./context/SiteContentContext";
import { AuthProvider } from "./context/AuthContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SiteContentProvider>
          <AuthProvider>
            <AudioPlayerProvider>
              <App />
            </AudioPlayerProvider>
          </AuthProvider>
        </SiteContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
