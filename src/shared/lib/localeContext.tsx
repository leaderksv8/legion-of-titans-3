import React, { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/content/site";

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uk");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "uk" || saved === "en") {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (newLocale === "uk" || newLocale === "en") {
      setLocaleState(newLocale);
      window.localStorage.setItem("locale", newLocale);
      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent("storage", {
        key: "locale",
        newValue: newLocale,
        storageArea: window.localStorage,
      }));
    }
  };

  // Listen to storage changes from other tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "locale" && e.newValue) {
        if (e.newValue === "uk" || e.newValue === "en") {
          setLocaleState(e.newValue as Locale);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
