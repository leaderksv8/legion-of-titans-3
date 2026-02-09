import { useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Status, Item, formatDate } from "./types";

interface AdminModerationProps {
  status: Status;
  items: Item[];
  searchQuery: string;
  selectedIds: Set<number>;
  csrf: string;
  busy: boolean;
  onStatusChange: (status: Status) => void;
  onSearchChange: (query: string) => void;
  onItemStatusChange: (id: number, status: Status) => Promise<void>;
  onBulkStatusChange: (status: Status) => Promise<void>;
  onItemDelete: (id: number) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onItemSelect: (id: number) => void;
  onSelectAll: () => void;
  onSmtpStatusCheck: () => Promise<void>;
  onReload: () => Promise<void>;
  smtpOk: boolean | null;
}

export default function AdminModeration({
  status,
  items,
  searchQuery,
  selectedIds,
  csrf,
  busy,
  onStatusChange,
  onSearchChange,
  onItemStatusChange,
  onBulkStatusChange,
  onItemDelete,
  onBulkDelete,
  onItemSelect,
  onSelectAll,
  smtpOk,
}: AdminModerationProps) {
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = selectedIds.size > 0 && selectedIds.size < filteredItems.length;
  }, [selectedIds, items.length, searchQuery]);

  const title = useMemo(() => {
    return status === "PENDING" ? "На модерації" : status === "APPROVED" ? "Опубліковані" : status === "REJECTED" ? "Відхилені" : "Видалені";
  }, [status]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(it =>
      (it.name || "").toLowerCase().includes(q) ||
      (it.email || "").toLowerCase().includes(q) ||
      it.message.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <>
      <div className="mt-10 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-full border border-hairline bg-black/20 overflow-x-auto overflow-y-hidden w-full sm:w-fit whitespace-nowrap hide-scrollbar">
          {(["PENDING", "APPROVED", "REJECTED", "DELETED"] as Status[]).map((s) => (
            <button
              key={s}
              className={`px-2 sm:px-4 py-2 text-[10px] sm:text-[12px] uppercase tracking-luxe transition-colors flex-shrink-0 ${
                status === s ? "text-paper bg-white/5" : "text-ash hover:text-paper"
              }`}
              onClick={() => onStatusChange(s)}
              type="button"
            >
              {s === "PENDING" ? "На модерації" : s === "APPROVED" ? "Опубліковані" : s === "REJECTED" ? "Відхилені" : "Видалені"}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-full border border-hairline bg-black/20 overflow-hidden w-fit">
          <span className="px-4 py-2 text-[12px] uppercase tracking-luxe text-paper bg-white/5">Подяки</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Пошук по імені, email, тексту..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl border border-hairline bg-black/20 text-paper placeholder:text-ash focus:outline-none focus:border-gold/50 focus:bg-black/40 transition-colors"
        />
        <div className="text-ash text-xs sm:text-sm whitespace-nowrap">
          {filteredItems.length} {filteredItems.length === 1 ? "результат" : "результатів"}
        </div>
      </div>

      <div className="mt-6 text-ash">
        {title}: {items.length}
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-panel overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-ash">{searchQuery.trim() ? "Не знайдено." : "Порожньо."}</div>
        ) : (
          <>
            {selectedIds.size > 0 && (
              <div className="p-3 sm:p-4 md:p-6 border-b border-hairline bg-black/20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-ash">Вибрано: {selectedIds.size} елемента</div>
                <div className="flex gap-2 flex-wrap">
                  {status === "DELETED" ? (
                    <button
                      className="h-9 rounded-lg px-3 text-[11px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                      onClick={() => onBulkStatusChange("APPROVED")}
                      disabled={busy}
                      type="button"
                    >
                      Восстановить всі
                    </button>
                  ) : (
                    <>
                      {status !== "APPROVED" && (
                        <button
                          className="h-9 rounded-lg px-3 text-[11px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                          onClick={() => onBulkStatusChange("APPROVED")}
                          disabled={busy}
                          type="button"
                        >
                          Схвалити всі
                        </button>
                      )}
                      {status !== "REJECTED" && (
                        <button
                          className="h-9 rounded-lg px-3 text-[11px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors disabled:opacity-50"
                          onClick={() => onBulkStatusChange("REJECTED")}
                          disabled={busy}
                          type="button"
                        >
                          Відхилити всі
                        </button>
                      )}
                      {status !== "PENDING" && (
                        <button
                          className="h-9 rounded-lg px-3 text-[11px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors disabled:opacity-50"
                          onClick={() => onBulkStatusChange("PENDING")}
                          disabled={busy}
                          type="button"
                        >
                          В очікування
                        </button>
                      )}
                      <button
                        className="h-9 rounded-lg px-3 text-[11px] uppercase tracking-luxe border border-red-700/50 bg-red-900/10 text-red-300 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        onClick={() => onBulkDelete()}
                        disabled={busy}
                        type="button"
                      >
                        Видалити всі
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-3 border-b border-hairline bg-black/10 ${filteredItems.length > 0 ? "" : "hidden"}`}>
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={selectedIds.size > 0 && selectedIds.size === filteredItems.length}
                onChange={onSelectAll}
                className="w-4 h-4 cursor-pointer accent-gold"
              />
              <span className="text-xs text-ash">Вибрати всі ({filteredItems.length})</span>
            </div>
            {filteredItems.map((it) => (
              <div key={it.id} className="border-b border-hairline last:border-b-0 p-4 sm:p-6 md:p-7">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(it.id)}
                      onChange={() => onItemSelect(it.id)}
                      className="w-4 h-4 mt-1 cursor-pointer accent-gold"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] uppercase tracking-luxe text-ash">
                        #{it.id} • {formatDate(it.created_at)}
                        {it.published_at ? ` • Опубліковано: ${formatDate(it.published_at)}` : ""}
                      </div>
                      <div className="mt-2 text-lg font-semibold truncate">
                        {it.name ? it.name : "Анонімна подяка"}
                      </div>
                      {it.email && <div className="mt-1 text-sm text-ash break-all">{it.email}</div>}
                      <div className="mt-4 text-ash leading-relaxed whitespace-pre-line">{it.message}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {status === "DELETED" ? (
                      <button
                        className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                        onClick={() => onItemStatusChange(it.id, "APPROVED")}
                        disabled={busy}
                        type="button"
                      >
                        Восстановить
                      </button>
                    ) : (
                      <>
                        {status !== "APPROVED" && (
                          <button
                            className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                            onClick={() => onItemStatusChange(it.id, "APPROVED")}
                            disabled={busy}
                            type="button"
                          >
                            Схвалити
                          </button>
                        )}
                        {status !== "REJECTED" && (
                          <button
                            className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors disabled:opacity-50"
                            onClick={() => onItemStatusChange(it.id, "REJECTED")}
                            disabled={busy}
                            type="button"
                          >
                            Відхилити
                          </button>
                        )}
                        {status !== "PENDING" && (
                          <button
                            className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors disabled:opacity-50"
                            onClick={() => onItemStatusChange(it.id, "PENDING")}
                            disabled={busy}
                            type="button"
                          >
                            Повернути в очікування
                          </button>
                        )}
                        <button
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-red-700/50 bg-red-900/10 text-red-300 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          onClick={() => onItemDelete(it.id)}
                          disabled={busy}
                          type="button"
                        >
                          Видалити
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
