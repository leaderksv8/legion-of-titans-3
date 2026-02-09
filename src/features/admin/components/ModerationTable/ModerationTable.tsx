import { useMemo } from "react";
import { StatusBadge } from "../../ui/StatusBadge";
import { ActionButton } from "../../ui/ActionButton";
import { SearchInput } from "../../ui/SearchInput";
import { Checkbox } from "../../ui/Checkbox";
import type { Status, ModerationItem } from "../../hooks/useModerationItems";

interface ModerationTableProps {
  status: Status;
  items: ModerationItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedIds: Set<number>;
  toggleSelection: (id: number) => void;
  toggleSelectAll: () => void;
  setItemStatus: (id: number, status: Status) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  restoreItem: (id: number) => Promise<void>;
  setBulkStatus: (status: Status) => Promise<void>;
  setBulkDelete: () => Promise<void>;
  busy: boolean;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ModerationTable({
  status,
  items,
  searchQuery,
  setSearchQuery,
  selectedIds,
  toggleSelection,
  toggleSelectAll,
  setItemStatus,
  deleteItem,
  restoreItem,
  setBulkStatus,
  setBulkDelete,
  busy,
}: ModerationTableProps) {
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((it) =>
      (it.name || "").toLowerCase().includes(q) ||
      (it.email || "").toLowerCase().includes(q) ||
      it.message.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <div>
      {/* Search and Counter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Пошук по імені, email, тексту..."
            disabled={busy}
          />
        </div>
        <div className="text-ash text-sm">
          {filteredItems.length} {filteredItems.length === 1 ? "результат" : "результатів"}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-hairline bg-panel overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-ash">{searchQuery.trim() ? "Не знайдено." : "Порожньо."}</div>
        ) : (
          <>
            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <div className="p-4 md:p-6 border-b border-hairline bg-black/20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-ash">Вибрано: {selectedIds.size} елемента</div>
                <div className="flex gap-2 flex-wrap">
                  {status === "DELETED" ? (
                    <ActionButton onClick={async () => await setBulkStatus("PENDING")} disabled={busy}>
                      Відновити всі
                    </ActionButton>
                  ) : (
                    <>
                      {status !== "APPROVED" && (
                        <ActionButton variant="primary" onClick={async () => await setBulkStatus("APPROVED")} disabled={busy}>
                          Схвалити всі
                        </ActionButton>
                      )}
                      {status !== "REJECTED" && (
                        <ActionButton variant="secondary" onClick={async () => await setBulkStatus("REJECTED")} disabled={busy}>
                          Відхилити всі
                        </ActionButton>
                      )}
                      {status !== "PENDING" && (
                        <ActionButton variant="secondary" onClick={async () => await setBulkStatus("PENDING")} disabled={busy}>
                          В очікування
                        </ActionButton>
                      )}
                      <ActionButton variant="danger" onClick={async () => await setBulkDelete()} disabled={busy}>
                        Видалити всі
                      </ActionButton>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Select All Header */}
            <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-hairline bg-black/10">
              <Checkbox
                checked={selectedIds.size > 0 && selectedIds.size === filteredItems.length}
                onChange={toggleSelectAll}
                label={`Вибрати всі (${filteredItems.length})`}
              />
            </div>

            {/* Items */}
            {filteredItems.map((it) => (
              <div key={it.id} className="border-b border-hairline last:border-b-0 p-6 md:p-7">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIds.has(it.id)}
                      onChange={() => toggleSelection(it.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] uppercase tracking-luxe text-ash">
                        #{it.id} • {formatDate(it.created_at)}
                        {it.published_at && ` • Опубліковано: ${formatDate(it.published_at)}`}
                      </div>
                      <div className="mt-2 text-lg font-semibold truncate">
                        {it.name || "Анонімна подяка"}
                      </div>
                      {it.email && <div className="mt-1 text-sm text-ash break-all">{it.email}</div>}
                      <div className="mt-4 text-ash leading-relaxed whitespace-pre-line">{it.message}</div>

                      <div className="mt-3">
                        <StatusBadge status={it.status} />
                      </div>
                    </div>
                  </div>

                  {/* Item Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {status === "DELETED" ? (
                      <ActionButton
                        variant="primary"
                        onClick={async () => await restoreItem(it.id)}
                        disabled={busy}
                      >
                        Відновити
                      </ActionButton>
                    ) : (
                      <>
                        {status !== "APPROVED" && (
                          <ActionButton
                            variant="primary"
                            onClick={async () => await setItemStatus(it.id, "APPROVED")}
                            disabled={busy}
                          >
                            Схвалити
                          </ActionButton>
                        )}
                        {status !== "REJECTED" && (
                          <ActionButton
                            variant="secondary"
                            onClick={async () => await setItemStatus(it.id, "REJECTED")}
                            disabled={busy}
                          >
                            Відхилити
                          </ActionButton>
                        )}
                        {status !== "PENDING" && (
                          <ActionButton
                            variant="secondary"
                            onClick={async () => await setItemStatus(it.id, "PENDING")}
                            disabled={busy}
                          >
                            Повернути в очікування
                          </ActionButton>
                        )}
                        <ActionButton
                          variant="danger"
                          onClick={async () => await deleteItem(it.id)}
                          disabled={busy}
                        >
                          Видалити
                        </ActionButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
