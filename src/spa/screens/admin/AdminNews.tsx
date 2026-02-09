import { useState } from "react";
import { toast } from "sonner";
import { NewsGoItem } from "./types";

interface AdminNewsProps {
  items: NewsGoItem[];
  collapsed: boolean;
  addCollapsed: boolean;
  csrf: string;
  busy: boolean;
  onItemsChange: (items: NewsGoItem[]) => void;
  onCollapsedChange: (collapsed: boolean) => void;
  onAddCollapsedChange: (collapsed: boolean) => void;
  onBusyChange: (busy: boolean) => void;
}

export default function AdminNews({
  items,
  collapsed,
  addCollapsed,
  csrf,
  busy,
  onItemsChange,
  onCollapsedChange,
  onAddCollapsedChange,
  onBusyChange,
}: AdminNewsProps) {
  const [newItem, setNewItem] = useState<NewsGoItem>({
    id: 0,
    title: "",
    summary: "",
    source: "ГО «Легіон Титанів»",
    time: "сьогодні",
    url: "",
  });

  async function save() {
    onBusyChange(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/news_go.php", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ items }),
      });
      if (!r.ok) {
        toast.error(`Помилка ${r.status}`);
        return;
      }
      const j = await r.json().catch(() => ({}));
      if (Array.isArray(j?.items)) {
        onItemsChange(j.items);
        toast.success("✓ Збережено!");
      }
    } finally {
      onBusyChange(false);
    }
  }

  async function add() {
    if (!newItem.title.trim()) {
      toast.error("Заповни заголовок");
      return;
    }
    const updated = [...items, { ...newItem, id: Date.now() }];
    onItemsChange(updated);
    setNewItem({ id: 0, title: "", summary: "", source: "ГО «Легіон Титанів»", time: "сьогодні", url: "" });
    onAddCollapsedChange(true);
    onBusyChange(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/news_go.php", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ items: updated }),
      });
      if (!r.ok) throw new Error(`Error ${r.status}`);
      const j = await r.json().catch(() => ({}));
      if (Array.isArray(j?.items)) onItemsChange(j.items);
      toast.success("✓ Новина додана!");
    } finally {
      onBusyChange(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gold/20 bg-black/40 overflow-hidden">
      <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-hairline px-4 sm:px-6 py-3 sm:py-4">
        <div className="text-[12px] sm:text-[13px] uppercase tracking-luxe text-gold font-semibold">📰 Новини</div>
      </div>
      <div className="p-4 sm:p-6">
        <button
          onClick={() => onAddCollapsedChange(!addCollapsed)}
          className="w-full h-12 rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 hover:bg-gold/10 hover:border-gold/50 transition-all text-[13px] uppercase tracking-luxe text-gold font-semibold flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Додати новину
        </button>

        {!addCollapsed && (
          <div className="mt-4 rounded-xl border border-gold/15 bg-black/50 p-4 sm:p-5 grid gap-4">
            <input
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Заголовок"
              className="h-10 sm:h-11 rounded-xl border border-gold/20 bg-black/60 px-3 sm:px-4 text-sm sm:text-base text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors"
            />
            <textarea
              value={newItem.summary}
              onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
              placeholder="Короткий опис"
              className="min-h-[70px] rounded-xl border border-gold/20 bg-black/60 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors resize-none"
            />
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
              <input
                value={newItem.source}
                onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
                placeholder="Джерело"
                className="h-10 sm:h-11 rounded-xl border border-gold/20 bg-black/60 px-3 sm:px-4 text-sm sm:text-base text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors"
              />
              <input
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                placeholder="Час"
                className="h-10 sm:h-11 rounded-xl border border-gold/20 bg-black/60 px-3 sm:px-4 text-sm sm:text-base text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors"
              />
              <input
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="URL"
                className="h-10 sm:h-11 rounded-xl border border-gold/20 bg-black/60 px-3 sm:px-4 text-sm sm:text-base text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={add}
                disabled={busy || !newItem.title.trim()}
                className="flex-1 h-10 sm:h-11 rounded-xl px-3 sm:px-4 text-[11px] sm:text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
              >
                ✓ Додати
              </button>
              <button
                onClick={() => onAddCollapsedChange(true)}
                className="flex-1 h-10 sm:h-11 rounded-xl px-3 sm:px-4 text-[11px] sm:text-[12px] uppercase tracking-luxe border border-gold/20 bg-black/50 text-ash hover:bg-black/70 transition-colors"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-gold/20 bg-black/50 hover:bg-black/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-[12px] uppercase tracking-luxe text-ash">Опубліковані новини</div>
              <div className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[11px] font-semibold">{items.length}</div>
            </div>
            <span className="text-ash text-sm">{collapsed ? "▼" : "▲"}</span>
          </button>

          {!collapsed && (
            <div className="mt-3 grid gap-2">
              {items.length === 0 ? (
                <div className="text-center text-ash/60 py-8 text-sm">Немає новин</div>
              ) : (
                items.map((it, idx) => (
                  <details key={it.id} className="group rounded-xl border border-gold/20 bg-black/50 hover:border-gold/50 transition-colors">
                    <summary className="cursor-pointer p-4 flex items-center justify-between list-none">
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold text-paper truncate">{it.title}</div>
                        <div className="mt-1 text-[11px] text-ash truncate">{it.source} • {it.time}</div>
                      </div>
                      <svg className="w-5 h-5 text-ash group-open:rotate-180 transition-transform ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-4 pb-4 border-t border-gold/10 pt-4 grid gap-3">
                      <input value={it.title} onChange={(e) => onItemsChange(items.map((i, j) => j === idx ? { ...i, title: e.target.value } : i))} placeholder="Заголовок" className="h-10 rounded-xl border border-gold/20 bg-black/60 px-4 text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors" />
                      <textarea value={it.summary} onChange={(e) => onItemsChange(items.map((i, j) => j === idx ? { ...i, summary: e.target.value } : i))} placeholder="Опис" className="min-h-[80px] rounded-xl border border-gold/20 bg-black/60 px-4 py-3 text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors resize-none" />
                      <div className="grid gap-3 md:grid-cols-3">
                        <input value={it.source} onChange={(e) => onItemsChange(items.map((i, j) => j === idx ? { ...i, source: e.target.value } : i))} placeholder="Джерело" className="h-10 rounded-xl border border-gold/20 bg-black/60 px-4 text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors" />
                        <input value={it.time} onChange={(e) => onItemsChange(items.map((i, j) => j === idx ? { ...i, time: e.target.value } : i))} placeholder="Час" className="h-10 rounded-xl border border-gold/20 bg-black/60 px-4 text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors" />
                        <input value={it.url} onChange={(e) => onItemsChange(items.map((i, j) => j === idx ? { ...i, url: e.target.value } : i))} placeholder="URL" className="h-10 rounded-xl border border-gold/20 bg-black/60 px-4 text-paper placeholder-ash/40 outline-none focus:border-gold/60 transition-colors" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={save} disabled={busy || !it.title.trim()} className="flex-1 h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50">
                          ✓ Зберегти
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`Видалити "${it.title}"?`)) return;
                            const prev = items;
                            const updated = items.filter((_, i) => i !== idx);
                            onItemsChange(updated);
                            onBusyChange(true);
                            try {
                              const headers: Record<string, string> = { "content-type": "application/json" };
                              if (csrf) headers["x-lot-csrf"] = csrf;
                              const r = await fetch("/api/admin/news_go.php", { method: "POST", credentials: "include", headers, body: JSON.stringify({ items: updated }) });
                              if (r.ok) {
                                const j = await r.json().catch(() => ({}));
                                if (Array.isArray(j?.items)) onItemsChange(j.items);
                                toast.success("✓ Видалено!", {
                                  action: {
                                    label: "Скасувати",
                                    onClick: async () => {
                                      onBusyChange(true);
                                      const r2 = await fetch("/api/admin/news_go.php", { method: "POST", credentials: "include", headers, body: JSON.stringify({ items: prev }) });
                                      if (r2.ok) {
                                        const j2 = await r2.json().catch(() => ({}));
                                        if (Array.isArray(j2?.items)) onItemsChange(j2.items);
                                      }
                                      onBusyChange(false);
                                    },
                                  },
                                });
                              }
                            } finally {
                              onBusyChange(false);
                            }
                          }}
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-red-600/40 bg-red-950/30 text-red-400 hover:bg-red-950/50 transition-colors"
                        >
                          × Видалити
                        </button>
                      </div>
                    </div>
                  </details>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
