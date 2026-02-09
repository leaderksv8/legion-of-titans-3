import { useState, useCallback } from "react";
import { logger } from "@/shared/lib/logger";

export type TeamItem = {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio: string;
};

interface UseTeamManagementReturn {
  items: TeamItem[];
  busy: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  updateItem: (idx: number, patch: Partial<TeamItem>) => void;
  addItem: () => void;
  removeItem: (idx: number) => void;
}

export function useTeamManagement(csrf: string, onAuthFailure: () => void): UseTeamManagementReturn {
  const [items, setItems] = useState<TeamItem[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/team.php", { cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (Array.isArray(j?.items)) setItems(j.items);
    } catch (err) {
      logger.error("useTeamManagement.load", err);
    }
  }, []);

  const save = useCallback(async () => {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/team.php", {
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
      logger.error("useTeamManagement.save", err);
    } finally {
      setBusy(false);
    }
  }, [csrf, items, onAuthFailure]);

  const updateItem = useCallback((idx: number, patch: Partial<TeamItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, { id: Date.now(), name: "", role: "", photo: "", bio: "" }]);
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
