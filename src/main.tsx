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

// GitHub Pages SPA routing fix: restore URL after 404.html redirect
if (typeof sessionStorage !== 'undefined' && sessionStorage.redirect) {
  const redirectPath = sessionStorage.redirect;
  delete sessionStorage.redirect;
  // Replace current history entry to restore the intended URL
  window.history.replaceState({}, '', redirectPath);
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

