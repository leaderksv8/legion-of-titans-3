import { useEffect, useMemo, useState } from "react";
import Container from "@/shared/ui/Container";

type Status = "PENDING" | "APPROVED" | "REJECTED";
type Type = "thanks";

type TeamItem = {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio: string;
};

type NewsGoItem = {
  id: number;
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
};

type EventItem = {
  id: number;
  title: string;
  date: string;
  folder: string;
  cover: string;
  photos: number;
  description: string;
  details: string;
};

type EventsPayload = {
  uk: { title: string; subtitle: string; note: string; items: EventItem[] };
  en?: { title: string; subtitle: string; note: string; items: EventItem[] };
};

type Item = {
  id: number;
  type: Type;
  name: string | null;
  email: string | null;
  message: string;
  status: Status;
  created_at: string;
  published_at: string | null;
};

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

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [csrf, setCsrf] = useState<string>("");

  const [status, setStatus] = useState<Status>("PENDING");
  const [type] = useState<Type>("thanks");
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  const [smtpOk, setSmtpOk] = useState<boolean | null>(null);

  const [teamItems, setTeamItems] = useState<TeamItem[]>([]);
  const [newsGoItems, setNewsGoItems] = useState<NewsGoItem[]>([]);
  const [eventsItems, setEventsItems] = useState<EventItem[]>([]);
  const [eventsMeta, setEventsMeta] = useState<Pick<EventsPayload["uk"], "title" | "subtitle" | "note">>({
    title: "",
    subtitle: "",
    note: "",
  });

  const title = useMemo(() => {
    return status === "PENDING" ? "На модерації" : status === "APPROVED" ? "Опубліковані" : "Відхилені";
  }, [status]);

  async function login() {
    setLoginError("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json().catch(() => ({}));
      setCsrf(typeof j?.csrf === "string" ? j.csrf : "");
      setAuthed(true);
      setPw("");
      await loadSmtpStatus();
      await load();
    } catch {
      setLoginError("Неправильний пароль.");
      setAuthed(false);
      setCsrf("");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", headers: csrf ? { "x-lot-csrf": csrf } : undefined });
    setAuthed(false);
    setCsrf("");
    setItems([]);
  }

  async function loadSmtpStatus() {
    try {
      const r = await fetch("/api/admin/smtp-status", { cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      setSmtpOk(!!j?.ok);
    } catch {
      setSmtpOk(false);
    }
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

  async function uploadFile(payload: { type: "team" | "events"; kind?: "cover" | "photo"; folder?: string; file: File | File[] }) {
    const fd = new FormData();
    fd.append("type", payload.type);
    if (payload.kind) fd.append("kind", payload.kind);
    if (payload.folder) fd.append("folder", payload.folder);
    const files = Array.isArray(payload.file) ? payload.file : [payload.file];
    files.forEach((f) => fd.append("files", f));
    const headers: Record<string, string> = {};
    if (csrf) headers["x-lot-csrf"] = csrf;
    const r = await fetch("/api/admin/upload.php", { method: "POST", headers, body: fd });
    const j = await r.json().catch(() => ({}));
    if (!j?.ok || !Array.isArray(j?.paths)) throw new Error("upload_failed");
    return j.paths as string[];
  }

  async function loadTeam() {
    const r = await fetch("/api/admin/team.php", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (Array.isArray(j?.items)) setTeamItems(j.items);
  }

  async function saveTeam() {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/team.php", {
        method: "POST",
        headers,
        body: JSON.stringify({ items: teamItems }),
      });
      if (r.status === 401) {
        setAuthed(false);
        setCsrf("");
        return;
      }
      const j = await r.json().catch(() => ({}));
      if (Array.isArray(j?.items)) setTeamItems(j.items);
    } finally {
      setBusy(false);
    }
  }

  async function loadNewsGo() {
    const r = await fetch("/api/admin/news_go.php", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (Array.isArray(j?.items)) setNewsGoItems(j.items);
  }

  async function saveNewsGo() {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/news_go.php", {
        method: "POST",
        headers,
        body: JSON.stringify({ items: newsGoItems }),
      });
      if (r.status === 401) {
        setAuthed(false);
        setCsrf("");
        return;
      }
      const j = await r.json().catch(() => ({}));
      if (Array.isArray(j?.items)) setNewsGoItems(j.items);
    } finally {
      setBusy(false);
    }
  }

  async function loadEvents() {
    const r = await fetch("/api/admin/events.php", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (j?.data?.uk?.items) setEventsItems(j.data.uk.items);
    if (j?.data?.uk) {
      setEventsMeta({
        title: j.data.uk.title ?? "",
        subtitle: j.data.uk.subtitle ?? "",
        note: j.data.uk.note ?? "",
      });
    }
  }

  async function saveEvents() {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/events.php", {
        method: "POST",
        headers,
        body: JSON.stringify({ items: eventsItems }),
      });
      if (r.status === 401) {
        setAuthed(false);
        setCsrf("");
        return;
      }
      const j = await r.json().catch(() => ({}));
      if (j?.data?.uk?.items) setEventsItems(j.data.uk.items);
    } finally {
      setBusy(false);
    }
  }

  function updateTeamItem(idx: number, patch: Partial<TeamItem>) {
    setTeamItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addTeamItem() {
    setTeamItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", role: "", photo: "", bio: "" },
    ]);
  }

  function removeTeamItem(idx: number) {
    setTeamItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateNewsGoItem(idx: number, patch: Partial<NewsGoItem>) {
    setNewsGoItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addNewsGoItem() {
    setNewsGoItems((prev) => [
      ...prev,
      { id: Date.now(), title: "", summary: "", source: "ГО «Легіон Титанів»", time: "сьогодні", url: "" },
    ]);
  }

  function removeNewsGoItem(idx: number) {
    setNewsGoItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateEventItem(idx: number, patch: Partial<EventItem>) {
    setEventsItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addEventItem() {
    setEventsItems((prev) => [
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
  }

  function removeEventItem(idx: number) {
    setEventsItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function setItemStatus(id: number, next: Status) {
    setBusy(true);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (csrf) headers["x-lot-csrf"] = csrf;
      const r = await fetch("/api/admin/update", {
        method: "POST",
        headers,
        body: JSON.stringify({ id, status: next }),
      });
      if (r.status === 401) {
        setAuthed(false);
        setCsrf("");
        return;
      }
      await loadSmtpStatus();
      await load();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (authed) {
      loadSmtpStatus();
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
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-[12px] uppercase tracking-luxe text-ash">Admin</div>
              <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">Модерація контенту</h1>
              <div className="mt-2 text-ash">Подяки: ОЧІКУЄ → СХВАЛЕНО / ВІДХИЛЕНО.</div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-hairline bg-black/20 px-3 py-1 text-[12px] text-ash">
                <span className="uppercase tracking-luxe">SMTP:</span>
                {smtpOk === null ? (
                  <span>перевірка…</span>
                ) : smtpOk ? (
                  <span className="text-paper/90">підключено</span>
                ) : (
                  <span className="text-paper/90">помилка конфігурації</span>
                )}
              </div>
            </div>

            {authed && (
              <button
                className="h-11 rounded-xl border border-hairline bg-black/20 px-5 text-[12px] uppercase tracking-luxe text-paper hover:bg-white/5 transition-colors"
                onClick={logout}
                type="button"
              >
                Вийти
              </button>
            )}
          </div>

          {!authed ? (
            <div className="mt-10 max-w-lg rounded-2xl border border-hairline bg-panel p-6 md:p-7">
              <div className="text-[12px] uppercase tracking-luxe text-ash">Вхід</div>
              <div className="mt-2 text-lg font-semibold">Пароль модератора</div>

              <div className="mt-5 grid gap-3">
                <input
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="h-11 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                  placeholder="••••••••"
                  type="password"
                />
                <button
                  className="h-11 rounded-xl px-5 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                  onClick={login}
                  disabled={busy || pw.length < 3}
                  type="button"
                >
                  Увійти
                </button>

                {loginError && <div className="text-sm text-ash">{loginError}</div>}

                <div className="text-[12px] text-ash">Сесія зберігається 30 хвилин (у cookie).</div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="inline-flex rounded-full border border-hairline bg-black/20 overflow-hidden w-fit">
                  {(["PENDING", "APPROVED", "REJECTED"] as Status[]).map((s) => (
                    <button
                      key={s}
                      className={`px-4 py-2 text-[12px] uppercase tracking-luxe transition-colors ${
                        status === s ? "text-paper bg-white/5" : "text-ash hover:text-paper"
                      }`}
                      onClick={() => setStatus(s)}
                      type="button"
                    >
                      {s === "PENDING" ? "На модерації" : s === "APPROVED" ? "Опубліковані" : "Відхилені"}
                    </button>
                  ))}
                </div>

                <div className="inline-flex rounded-full border border-hairline bg-black/20 overflow-hidden w-fit">
                  <span className="px-4 py-2 text-[12px] uppercase tracking-luxe text-paper bg-white/5">Подяки</span>
                </div>
              </div>

              <div className="mt-6 text-ash">
                {title}: {items.length}
              </div>

              <div className="mt-6 rounded-2xl border border-hairline bg-panel overflow-hidden">
                {items.length === 0 ? (
                  <div className="p-8 text-ash">Порожньо.</div>
                ) : (
                  items.map((it) => (
                    <div key={it.id} className="border-b border-hairline last:border-b-0 p-6 md:p-7">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
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

                        <div className="flex gap-2 md:flex-col md:items-stretch">
                          {status !== "APPROVED" && (
                            <button
                              className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                              onClick={() => setItemStatus(it.id, "APPROVED")}
                              disabled={busy}
                              type="button"
                            >
                              Схвалити
                            </button>
                          )}
                          {status !== "REJECTED" && (
                            <button
                              className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors disabled:opacity-50"
                              onClick={() => setItemStatus(it.id, "REJECTED")}
                              disabled={busy}
                              type="button"
                            >
                              Відхилити
                            </button>
                          )}
                          {status !== "PENDING" && (
                            <button
                              className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors disabled:opacity-50"
                              onClick={() => setItemStatus(it.id, "PENDING")}
                              disabled={busy}
                              type="button"
                            >
                              Повернути в очікування
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 text-[12px] text-ash">
                Порада: для публікації без спаму ми додамо Turnstile (Cloudflare) — ключі підставляються через конфіг.
              </div>

              <div className="mt-10 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                <div className="text-[12px] uppercase tracking-luxe text-ash">Керування контентом</div>
                <div className="mt-2 text-sm text-ash">Команда, новини ГО та події — редагуються тут.</div>

                <div className="mt-6 grid gap-6">
                  <div className="rounded-xl2 border border-hairline p-5">
                    <div className="text-[12px] uppercase tracking-luxe text-ash">Команда</div>
                    <div className="mt-3 grid gap-4">
                      {teamItems.map((it, idx) => (
                        <div key={it.id} className="rounded-xl border border-hairline p-4 grid gap-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              value={it.name}
                              onChange={(e) => updateTeamItem(idx, { name: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Імʼя"
                            />
                            <input
                              value={it.role}
                              onChange={(e) => updateTeamItem(idx, { role: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Роль"
                            />
                          </div>
                          <textarea
                            value={it.bio}
                            onChange={(e) => updateTeamItem(idx, { bio: e.target.value })}
                            className="min-h-[90px] rounded-xl border border-hairline bg-black/20 px-4 py-3 text-paper outline-none focus:border-gold/60"
                            placeholder="Біо"
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <input
                              value={it.photo}
                              onChange={(e) => updateTeamItem(idx, { photo: e.target.value })}
                              className="h-10 flex-1 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="/images/team/..."
                            />
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const paths = await uploadFile({ type: "team", file });
                                    updateTeamItem(idx, { photo: paths[0] ?? it.photo });
                                  } catch {}
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors"
                              onClick={() => removeTeamItem(idx)}
                            >
                              Видалити
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors"
                          onClick={addTeamItem}
                        >
                          Додати учасника
                        </button>
                        <button
                          type="button"
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors"
                          onClick={saveTeam}
                          disabled={busy}
                        >
                          Зберегти команду
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl2 border border-hairline p-5">
                    <div className="text-[12px] uppercase tracking-luxe text-ash">Новини ГО (редакційний добір)</div>
                    <div className="mt-3 grid gap-4">
                      {newsGoItems.map((it, idx) => (
                        <div key={it.id} className="rounded-xl border border-hairline p-4 grid gap-3">
                          <input
                            value={it.title}
                            onChange={(e) => updateNewsGoItem(idx, { title: e.target.value })}
                            className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                            placeholder="Заголовок"
                          />
                          <textarea
                            value={it.summary}
                            onChange={(e) => updateNewsGoItem(idx, { summary: e.target.value })}
                            className="min-h-[80px] rounded-xl border border-hairline bg-black/20 px-4 py-3 text-paper outline-none focus:border-gold/60"
                            placeholder="Короткий опис"
                          />
                          <div className="grid gap-3 md:grid-cols-3">
                            <input
                              value={it.source}
                              onChange={(e) => updateNewsGoItem(idx, { source: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Джерело"
                            />
                            <input
                              value={it.time}
                              onChange={(e) => updateNewsGoItem(idx, { time: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Дата/час"
                            />
                            <input
                              value={it.url}
                              onChange={(e) => updateNewsGoItem(idx, { url: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Посилання (опц.)"
                            />
                          </div>
                          <button
                            type="button"
                            className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors"
                            onClick={() => removeNewsGoItem(idx)}
                          >
                            Видалити
                          </button>
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors"
                          onClick={addNewsGoItem}
                        >
                          Додати новину
                        </button>
                        <button
                          type="button"
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors"
                          onClick={saveNewsGo}
                          disabled={busy}
                        >
                          Зберегти новини ГО
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl2 border border-hairline p-5">
                    <div className="text-[12px] uppercase tracking-luxe text-ash">Події</div>
                    <div className="mt-3 grid gap-4">
                      {eventsItems.map((it, idx) => (
                        <div key={it.id} className="rounded-xl border border-hairline p-4 grid gap-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              value={it.title}
                              onChange={(e) => updateEventItem(idx, { title: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Назва події"
                            />
                            <input
                              value={it.date}
                              onChange={(e) => updateEventItem(idx, { date: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Дата"
                            />
                          </div>
                          <div className="grid gap-3 md:grid-cols-3">
                            <input
                              value={it.folder}
                              onChange={(e) => updateEventItem(idx, { folder: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Папка (латиницею)"
                            />
                            <input
                              value={it.cover}
                              onChange={(e) => updateEventItem(idx, { cover: e.target.value })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Cover (auto)"
                            />
                            <input
                              value={it.photos}
                              onChange={(e) => updateEventItem(idx, { photos: Number(e.target.value) || 0 })}
                              className="h-10 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                              placeholder="Фото (кількість)"
                            />
                          </div>
                          <textarea
                            value={it.description}
                            onChange={(e) => updateEventItem(idx, { description: e.target.value })}
                            className="min-h-[70px] rounded-xl border border-hairline bg-black/20 px-4 py-3 text-paper outline-none focus:border-gold/60"
                            placeholder="Короткий опис"
                          />
                          <textarea
                            value={it.details}
                            onChange={(e) => updateEventItem(idx, { details: e.target.value })}
                            className="min-h-[90px] rounded-xl border border-hairline bg-black/20 px-4 py-3 text-paper outline-none focus:border-gold/60"
                            placeholder="Повний текст"
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex items-center gap-2">
                              <span className="text-[12px] text-ash">Обкладинка</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file || !it.folder) return;
                                  try {
                                    const paths = await uploadFile({ type: "events", kind: "cover", folder: it.folder, file });
                                    updateEventItem(idx, { cover: paths[0] ?? it.cover });
                                  } catch {}
                                }}
                              />
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <span className="text-[12px] text-ash">Фото</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                  const files = e.target.files ? Array.from(e.target.files) : [];
                                  if (files.length === 0 || !it.folder) return;
                                  try {
                                    const paths = await uploadFile({ type: "events", folder: it.folder, file: files });
                                    if (paths.length > 0) {
                                      updateEventItem(idx, { photos: (it.photos || 0) + paths.length });
                                    }
                                  } catch {}
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors"
                              onClick={() => removeEventItem(idx)}
                            >
                              Видалити
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors"
                          onClick={addEventItem}
                        >
                          Додати подію
                        </button>
                        <button
                          type="button"
                          className="h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 text-paper hover:bg-white/5 transition-colors"
                          onClick={saveEvents}
                          disabled={busy}
                        >
                          Зберегти події
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                <div className="text-[12px] uppercase tracking-luxe text-ash">Інструкції</div>
                <div className="mt-2 text-sm text-ash">
                  Тут будуть зібрані всі інструкції для адміністрування проєкту.
                </div>
              </div>

              <details className="mt-4 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                <summary className="cursor-pointer select-none text-sm font-semibold text-paper">
                  Інструкція: Команда (натисни, щоб розгорнути)
                </summary>
                <div className="mt-4 text-[12px] uppercase tracking-luxe text-ash">
                  Додавання/редагування учасників команди
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 1. Підготуй фото</div>
                  Обирай фото гарної якості. Система автоматично стисне і збереже в
                  <span className="text-paper"> webp</span>.
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 2. Завантаж фото</div>
                  В адмінці обери файл і натисни завантаження — шлях підставиться автоматично.
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 3. Заповни дані</div>
                  Імʼя, роль, коротке біо. Збережи зміни.
                </div>
              </details>

              <details className="mt-4 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                <summary className="cursor-pointer select-none text-sm font-semibold text-paper">
                  Інструкція: Новини ГО (натисни, щоб розгорнути)
                </summary>
                <div className="mt-4 text-[12px] uppercase tracking-luxe text-ash">
                  Редакційний добір (наша стрічка)
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 1. Додай заголовок і короткий опис</div>
                  Це відображається в блоці «Редакційний добір».
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 2. Вкажи джерело і дату</div>
                  Наприклад: «ГО «Легіон Титанів»», «сьогодні/цього тижня».
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 3. Посилання</div>
                  Якщо немає зовнішнього лінку — залишай порожнім, система підставить /#news.
                </div>
              </details>

              <details className="mt-4 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                <summary className="cursor-pointer select-none text-sm font-semibold text-paper">
                  Інструкція: Події (натисни, щоб розгорнути)
                </summary>
                <div className="mt-4 text-[12px] uppercase tracking-luxe text-ash">
                  Додавання подій (покроково, для новачка)
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 1. Підготуй папку з фото</div>
                  Створи папку з короткою назвою (латиницею) — наприклад: <span className="text-paper">new-event</span>.
                  <br />
                  Усередині мають бути файли: <span className="text-paper">cover.webp</span> (обкладинка) і
                  <span className="text-paper"> 1.webp, 2.webp, 3.webp…</span> (фото по порядку).
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 2. Скопіюй папку в сайт</div>
                  Поклади цю папку сюди:
                  <span className="text-paper"> public/events/&lt;folder&gt;/</span>.
                  <br />
                  Приклад шляху:
                  <span className="text-paper"> public/events/new-event/cover.webp</span>.
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 3. Додай опис події</div>
                  Відкрий файл:
                  <span className="text-paper"> public/events/events.json</span> і в блоці
                  <span className="text-paper"> uk.items</span> додай новий об’єкт (дивись шаблон нижче).
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 4. Вкажи кількість фото</div>
                  Поле <span className="text-paper">photos</span> має дорівнювати кількості файлів
                  <span className="text-paper"> 1.webp…N.webp</span>.
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 5. Перевір на сайті</div>
                  Просто онови сторінку — нічого збирати не потрібно.
                </div>
                <div className="mt-3 text-[12px] text-ash">
                  Порядок у JSON = порядок на сайті (показуємо 3 останні, решта — в архіві).
                </div>
                <div className="mt-4 rounded-xl border border-hairline bg-black/30 p-4 text-[12px] text-ash">
                  <div className="text-[11px] uppercase tracking-luxe text-ash">Шаблон події</div>
                  <pre className="mt-3 whitespace-pre-wrap text-paper/90">
{`{
  "id": 7,
  "title": "НАЗВА ПОДІЇ",
  "date": "Грудень 2025",
  "folder": "new-event",
  "cover": "/events/new-event/cover.webp",
  "photos": 6,
  "description": "Короткий опис",
  "details": "Повний текст..."
}`}
                  </pre>
                </div>
              </details>

              <details className="mt-4 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                <summary className="cursor-pointer select-none text-sm font-semibold text-paper">
                  Інструкція: Адмінка на хості (натисни, щоб розгорнути)
                </summary>
                <div className="mt-4 text-[12px] uppercase tracking-luxe text-ash">
                  Як відкривати та куди потрапляють файли
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 1. Відкрий адмінку на домені</div>
                  У браузері введи адресу: <span className="text-paper">https://ваш-домен/admin</span>.
                  Приклад: <span className="text-paper">https://www.legion-of-titans.org/admin</span>.
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 2. Увійди в адмінку</div>
                  Введи пароль, який збережений у
                  <span className="text-paper"> public/api/config.local.php</span> на хості.
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 3. Додай контент через форми</div>
                  Команда / Новини ГО / Події — редагуються прямо тут.
                  Фото завантажуються кнопкою “Файл” і автоматично стискаються в webp.
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 4. Куди зберігаються файли</div>
                  Якщо адмінка відкрита на домені — файли лягають одразу на хост
                  (<span className="text-paper">public/images/…</span> або <span className="text-paper">public/events/…</span>).
                </div>
                <div className="mt-4 text-sm text-ash leading-relaxed">
                  <div className="text-paper">Крок 5. Перевір на сайті</div>
                  Відкрий головну сторінку і онови — зміни відразу видно.
                </div>
                <div className="mt-4 rounded-xl border border-hairline bg-black/30 p-4 text-[12px] text-ash">
                  <div className="text-[11px] uppercase tracking-luxe text-ash">Приклад (сценарій)</div>
                  1) Зайшов на <span className="text-paper">https://www.legion-of-titans.org/admin</span><br />
                  2) Додав новину ГО і завантажив фото для команди<br />
                  3) Натиснув “Зберегти” → відкрив головну сторінку → новина і фото вже на сайті
                </div>
              </details>
            </>
          )}
        </Container>
      </section>
    </main>
  );
}

