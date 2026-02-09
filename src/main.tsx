import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

import "@/styles/globals.css";

import { AppRouter } from "@/spa/router";
import { ContactModalProvider } from "@/features/contact/ContactModalContext";
import { LocaleProvider } from "@/shared/lib/localeContext";

// Відключаємо браузерне автоматичне відновлення скролу
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <LocaleProvider>
        <ContactModalProvider>
          <Toaster 
            theme="dark"
            position="bottom-right"
            richColors
            closeButton
          />
          <AppRouter />
        </ContactModalProvider>
      </LocaleProvider>
    </HelmetProvider>
  </React.StrictMode>
);

