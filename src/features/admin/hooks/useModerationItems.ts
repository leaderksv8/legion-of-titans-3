import { useState, useCallback } from "react";
import { logger } from "@/shared/lib/logger";

export type Status = "PENDING" | "APPROVED" | "REJECTED" | "DELETED";
export type Type = "thanks";

export type ModerationItem = {
  id: number;
  type: Type;
  name: string | null;
  email: string | null;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  published_at: string | null;
  deleted_at?: string | null;
};

interface UseModerationItemsReturn {
  items: ModerationItem[];
  busy: boolean;
  load: () => Promise<void>;
  setItemStatus: (id: number, status: Status) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  restoreItem: (id: number) => Promise<void>;
}

export function useModerationItems(
  csrf: string,
  status: Status,
  type: Type,
  onAuthFailure: () => void,
  onSmtpCheck: () => Promise<void>
): UseModerationItemsReturn {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/items?status=${status}&type=${type}`, { cache: "no-store" });
      if (r.status === 401) {
        onAuthFailure();
        setItems([]);
        return;
      }
      const j = await r.json().catch(() => ({}));
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch (err) {
      logger.error("useModerationItems.load", err);
      setItems([]);
    } finally {
      setBusy(false);
    }
  }, [status, type, onAuthFailure]);

  const setItemStatus = useCallback(
    async (id: number, nextStatus: Status) => {
      setBusy(true);
      try {
        const headers: Record<string, string> = { "content-type": "application/json" };
        if (csrf) headers["x-lot-csrf"] = csrf;
        const r = await fetch("/api/admin/update", {
          method: "POST",
          headers,
          body: JSON.stringify({ id, status: nextStatus }),
        });
        if (r.status === 401) {
          onAuthFailure();
          return;
        }
        await onSmtpCheck();
        await load();
      } catch (err) {
        logger.error("useModerationItems.setItemStatus", err);
      } finally {
        setBusy(false);
      }
    },
    [csrf, load, onAuthFailure, onSmtpCheck]
  );

  const deleteItem = useCallback(
    async (id: number) => {
      setBusy(true);
      try {
        const headers: Record<string, string> = { "content-type": "application/json" };
        if (csrf) headers["x-lot-csrf"] = csrf;
        await fetch("/api/admin/update", {
          method: "POST",
          headers,
          body: JSON.stringify({ id, action: "delete" }),
        });
        await onSmtpCheck();
        await load();
      } catch (err) {
        logger.error("useModerationItems.deleteItem", err);
      } finally {
        setBusy(false);
      }
    },
    [csrf, load, onSmtpCheck]
  );

  const restoreItem = useCallback(
    async (id: number) => {
      setBusy(true);
      try {
        const headers: Record<string, string> = { "content-type": "application/json" };
        if (csrf) headers["x-lot-csrf"] = csrf;
        await fetch("/api/admin/update", {
          method: "POST",
          headers,
          body: JSON.stringify({ id, action: "restore" }),
        });
        await onSmtpCheck();
        await load();
      } catch (err) {
        logger.error("useModerationItems.restoreItem", err);
      } finally {
        setBusy(false);
      }
    },
    [csrf, load, onSmtpCheck]
  );

  return {
    items,
    busy,
    load,
    setItemStatus,
    deleteItem,
    restoreItem,
  };
}
