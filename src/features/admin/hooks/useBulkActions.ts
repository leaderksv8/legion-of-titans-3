import { useState, useCallback } from "react";
import { logger } from "@/shared/lib/logger";
import type { Status, ModerationItem } from "./useModerationItems";

interface UseBulkActionsReturn {
  selectedIds: Set<number>;
  toggleSelection: (id: number) => void;
  toggleSelectAll: (items: ModerationItem[]) => void;
  clearSelection: () => void;
  setBulkStatus: (status: Status, csrf: string, onComplete: () => Promise<void>) => Promise<void>;
  setBulkDelete: (csrf: string, onComplete: () => Promise<void>) => Promise<void>;
  busy: boolean;
}

export function useBulkActions(): UseBulkActionsReturn {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((items: ModerationItem[]) => {
    setSelectedIds((prev) => {
      if (prev.size === items.length) {
        return new Set();
      }
      return new Set(items.map((it) => it.id));
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const setBulkStatus = useCallback(
    async (status: Status, csrf: string, onComplete: () => Promise<void>) => {
      if (selectedIds.size === 0) return;
      setBusy(true);
      try {
        const headers: Record<string, string> = { "content-type": "application/json" };
        if (csrf) headers["x-lot-csrf"] = csrf;
        for (const id of selectedIds) {
          await fetch("/api/admin/update", {
            method: "POST",
            headers,
            body: JSON.stringify({ id, status }),
          });
        }
        setSelectedIds(new Set());
        await onComplete();
      } catch (err) {
        logger.error("useBulkActions.setBulkStatus", err);
      } finally {
        setBusy(false);
      }
    },
    [selectedIds]
  );

  const setBulkDelete = useCallback(
    async (csrf: string, onComplete: () => Promise<void>) => {
      if (selectedIds.size === 0) return;
      setBusy(true);
      try {
        const headers: Record<string, string> = { "content-type": "application/json" };
        if (csrf) headers["x-lot-csrf"] = csrf;
        for (const id of selectedIds) {
          await fetch("/api/admin/update", {
            method: "POST",
            headers,
            body: JSON.stringify({ id, action: "delete" }),
          });
        }
        setSelectedIds(new Set());
        await onComplete();
      } catch (err) {
        logger.error("useBulkActions.setBulkDelete", err);
      } finally {
        setBusy(false);
      }
    },
    [selectedIds]
  );

  return {
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    setBulkStatus,
    setBulkDelete,
    busy,
  };
}
