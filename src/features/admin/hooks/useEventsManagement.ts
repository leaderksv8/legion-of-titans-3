import { useState, useCallback } from "react";
import { logger } from "@/shared/lib/logger";

export type EventItem = {
  id: number;
  title: string;
  date: string;
  folder: string;
  cover: string;
  photos: number;
  description: string;
  details: string;
};

export type EventsMeta = {
  title: string;
  subtitle: string;
  note: string;
};

interface UseEventsManagementReturn {
  items: EventItem[];
  meta: EventsMeta;
  busy: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  updateItem: (idx: number, patch: Partial<EventItem>) => void;
  addItem: () => void;
  removeItem: (idx: number) => void;
}

export function useEventsManagement(csrf: string, onAuthFailure: () => void): UseEventsManagementReturn {
  const [items, setItems] = useState<EventItem[]>([]);
  const [meta, setMeta] = useState<EventsMeta>({ title: "", subtitle: "", note: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/events.php", { cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (j?.data?.uk?.items) setItems(j.data.uk.items);
      if (j?.data?.uk) {
        setMeta({
          title: j.data.uk.title ?? "",
          subtitle: j.data.uk.subtitle ?? "",
          note: j.data.uk.note ?? "",
        });
      }
    } catch (err) {
      logger.error("useEventsManagement.load", err);
    }
  }, []);

  const save = useCallback(async () => {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/events.php", {
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
      if (j?.data?.uk?.items) setItems(j.data.uk.items);
    } catch (err) {
      logger.error("useEventsManagement.save", err);
    } finally {
      setBusy(false);
    }
  }, [csrf, items, onAuthFailure]);

  const updateItem = useCallback((idx: number, patch: Partial<EventItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        date: "",
        folder: "",
        cover: "",
        photos: 0,
        description: "",
        details: "",
      },
    ]);
  }, []);

  const removeItem = useCallback((idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return {
    items,
    meta,
    busy,
    load,
    save,
    updateItem,
    addItem,
    removeItem,
  };
}
