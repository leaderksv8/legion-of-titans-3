import { useState, useCallback } from "react";
import { logger } from "@/shared/lib/logger";

export type NewsGoItem = {
  id: number;
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
};

interface UseNewsManagementReturn {
  items: NewsGoItem[];
  busy: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  updateItem: (idx: number, patch: Partial<NewsGoItem>) => void;
  addItem: () => void;
  removeItem: (idx: number) => void;
}

export function useNewsManagement(csrf: string, onAuthFailure: () => void): UseNewsManagementReturn {
  const [items, setItems] = useState<NewsGoItem[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/news_go.php", { cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (Array.isArray(j?.items)) setItems(j.items);
    } catch (err) {
      logger.error("useNewsManagement.load", err);
    }
  }, []);

  const save = useCallback(async () => {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/news_go.php", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ items }),
      });
      if (r.status === 401) {
        onAuthFailure();
        return;
      }
      if (!r.ok) {
        alert(`Помилка ${r.status}: ${r.statusText}`);
        return;
      }
      const j = await r.json().catch(() => ({}));
      if (Array.isArray(j?.items)) setItems(j.items);
    } catch (err) {
      logger.error("useNewsManagement.save", err);
    } finally {
      setBusy(false);
    }
  }, [csrf, items, onAuthFailure]);

  const updateItem = useCallback((idx: number, patch: Partial<NewsGoItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), title: "", summary: "", source: "ГО «Легіон Титанів»", time: "сьогодні", url: "" },
    ]);
  }, []);

  const removeItem = useCallback((idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return {
    items,
    busy,
    load,
    save,
    updateItem,
    addItem,
    removeItem,
  };
}
