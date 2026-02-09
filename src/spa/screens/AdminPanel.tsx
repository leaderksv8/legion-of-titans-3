import { useEffect, useState } from "react";
import { toast } from "sonner";
import Container from "@/shared/ui/Container";
import AdminLogin from "./admin/AdminLogin";
import AdminModeration from "./admin/AdminModeration";
import AdminTeam from "./admin/AdminTeam";
import AdminNews from "./admin/AdminNews";
import AdminEvents from "./admin/AdminEvents";
import { Status, Type, TeamItem, NewsGoItem, EventItem, Item } from "./admin/types";

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [csrf, setCsrf] = useState<string>("");

  const [status, setStatus] = useState<Status>("PENDING");
  const [type] = useState<Type>("thanks");
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);

  const [teamItems, setTeamItems] = useState<TeamItem[]>([]);
  const [newsGoItems, setNewsGoItems] = useState<NewsGoItem[]>([]);
  const [eventsItems, setEventsItems] = useState<EventItem[]>([]);

  const [teamCollapsed, setTeamCollapsed] = useState(false);
  const [teamAddCollapsed, setTeamAddCollapsed] = useState(true);
  const [newsCollapsed, setNewsCollapsed] = useState(false);
  const [newsAddCollapsed, setNewsAddCollapsed] = useState(true);
  const [eventsCollapsed, setEventsCollapsed] = useState(false);
  const [eventsAddCollapsed, setEventsAddCollapsed] = useState(true);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", headers: csrf ? { "x-lot-csrf": csrf } : undefined });
    setAuthed(false);
    setCsrf("");
    setItems([]);
  }

  async function load() {
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/items?status=${status}&type=${type}`, { cache: "no-store" });
      if (r.status === 401) {
        setAuthed(false);
        setCsrf("");
        setItems([]);
        return;
      }
      const j = await r.json().catch(() => ({}));
      if (typeof j?.csrf === "string") setCsrf(j.csrf);
      setItems(Array.isArray(j?.items) ? j.items : []);
    } finally {
      setBusy(false);
    }
  }

  async function loadTeam() {
    const r = await fetch("/api/admin/team.php", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (Array.isArray(j?.items)) setTeamItems(j.items);
  }

  async function loadNewsGo() {
    const r = await fetch("/api/admin/news_go.php", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (Array.isArray(j?.items)) setNewsGoItems(j.items);
  }

  async function loadEvents() {
    const r = await fetch("/api/admin/events.php", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (j?.data?.uk?.items) setEventsItems(j.data.uk.items);
  }

  async function setItemStatus(id: number, next: Status) {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      await fetch("/api/admin/update", {
        method: "POST",
        headers,
        body: JSON.stringify({ id, status: next }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  function toggleItemSelection(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((it) => it.id)));
    }
  }

  async function setBulkStatus(next: Status) {
    if (selectedIds.size === 0) return;
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      for (const id of selectedIds) {
        await fetch("/api/admin/update", {
          method: "POST",
          headers,
          body: JSON.stringify({ id, status: next }),
        });
      }
      setSelectedIds(new Set());
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function restoreItems(ids: number[]) {
    if (ids.length === 0) return;
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      for (const id of ids) {
        await fetch("/api/admin/update", {
          method: "POST",
          headers,
          body: JSON.stringify({ id, action: "restore" }),
        });
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(id: number) {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      await fetch("/api/admin/update", {
        method: "POST",
        headers,
        body: JSON.stringify({ id, action: "delete" }),
      });
      toast.success("Видалено", {
        action: { label: "Скасувати", onClick: () => restoreItems([id]) },
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function setBulkDelete() {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      for (const id of ids) {
        await fetch("/api/admin/update", {
          method: "POST",
          headers,
          body: JSON.stringify({ id, action: "delete" }),
        });
      }
      toast.success(`Видалено: ${ids.length}`, {
        action: { label: "Скасувати", onClick: () => restoreItems(ids) },
      });
      setSelectedIds(new Set());
      await load();
    } finally {
      setBusy(false);
    }
  }

  const filteredItems = items.filter((it) => {
    const q = searchQuery.toLowerCase();
    return !q || it.name?.toLowerCase().includes(q) || it.email?.toLowerCase().includes(q) || it.message.toLowerCase().includes(q);
  });

  useEffect(() => {
    if (authed) {
      load();
      loadTeam();
      loadNewsGo();
      loadEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type, authed]);

  return (
    <main className="grain min-h-screen">
      <section className="py-14">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <div>
              <div className="text-[12px] uppercase tracking-luxe text-ash">Admin</div>
              <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em]">Панель адміністратора</h1>
            </div>

            {authed && (
              <button
                className="h-10 sm:h-11 w-full sm:w-auto rounded-xl border border-hairline bg-black/20 px-4 sm:px-5 text-[12px] uppercase tracking-luxe text-paper hover:bg-white/5 transition-colors"
                onClick={logout}
                type="button"
              >
                Вийти
              </button>
            )}
          </div>

          {!authed ? (
            <div className="mt-10 rounded-2xl border border-hairline bg-panel p-4 sm:p-6 md:p-7">
              <AdminLogin onLogin={async (pw) => {
                try {
                  const r = await fetch("/api/admin/login.php", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ password: pw }),
                  });
                  if (!r.ok) throw new Error(`${r.status}`);
                  const j = await r.json().catch(() => ({}));
                  if (typeof j?.csrf === "string") {
                    setCsrf(j.csrf);
                    setAuthed(true);
                    await load();
                    await loadTeam();
                    await loadNewsGo();
                    await loadEvents();
                  }
                } catch (e) {
                  throw new Error("Неправильний пароль");
                }
              }} />
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6">
                {/* Moderation Section */}
                <AdminModeration
                  items={filteredItems}
                  searchQuery={searchQuery}
                  selectedIds={selectedIds}
                  status={status}
                  csrf={csrf}
                  busy={busy}
                  onSearchChange={setSearchQuery}
                  onStatusChange={setStatus}
                  onItemSelect={toggleItemSelection}
                  onSelectAll={toggleSelectAll}
                  onItemStatusChange={setItemStatus}
                  onBulkStatusChange={setBulkStatus}
                  onBulkDelete={setBulkDelete}
                  onItemDelete={deleteItem}
                  smtpOk={null}
                  onSmtpStatusCheck={async () => {}}
                  onReload={load}
                />

                {/* Team Section */}
                <AdminTeam
                  items={teamItems}
                  collapsed={teamCollapsed}
                  addCollapsed={teamAddCollapsed}
                  csrf={csrf}
                  busy={busy}
                  onItemsChange={setTeamItems}
                  onCollapsedChange={setTeamCollapsed}
                  onAddCollapsedChange={setTeamAddCollapsed}
                  onBusyChange={setBusy}
                />

                {/* News Section */}
                <AdminNews
                  items={newsGoItems}
                  collapsed={newsCollapsed}
                  addCollapsed={newsAddCollapsed}
                  csrf={csrf}
                  busy={busy}
                  onItemsChange={setNewsGoItems}
                  onCollapsedChange={setNewsCollapsed}
                  onAddCollapsedChange={setNewsAddCollapsed}
                  onBusyChange={setBusy}
                />

                {/* Events Section */}
                <AdminEvents
                  items={eventsItems}
                  collapsed={eventsCollapsed}
                  addCollapsed={eventsAddCollapsed}
                  csrf={csrf}
                  busy={busy}
                  onItemsChange={setEventsItems}
                  onCollapsedChange={setEventsCollapsed}
                  onAddCollapsedChange={setEventsAddCollapsed}
                  onBusyChange={setBusy}
                />
              </div>
            </>
          )}
        </Container>
      </section>
    </main>
  );
}
