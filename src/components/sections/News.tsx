import Container from "@/shared/ui/Container";
import Divider from "@/shared/ui/Divider";
import { news, type Locale } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useEffect, useMemo, useState } from "react";

export default function News() {
  const [locale, setLocale] = useState<Locale>("uk");
  const activeId = useActiveSectionId();
  const [liveItems, setLiveItems] = useState<typeof t.top>([]);
  const [goItems, setGoItems] = useState<typeof t.manual | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "uk" || saved === "en") setLocale(saved);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content/news_go.php")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.items)) return;
        setGoItems(data.items);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const t = news[locale];
  const topItems = useMemo(() => (liveItems.length > 0 ? liveItems : t.top).slice(0, 4), [liveItems, t.top]);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/news/ukrinform.php")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !data.ok || !Array.isArray(data.items)) return;
        const mapped = data.items.map((it: { title: string; url: string; time?: string; date?: string; source?: string }) => ({
          id: it.url,
          title: it.title,
          summary: it.date ? `${it.date} · ${it.time ?? ""}`.trim() : "",
          source: it.source ?? "Укрінформ",
          time: it.time ?? "",
          url: it.url,
        }));
        setLiveItems(mapped);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="news" className="py-14">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div
              className={
                activeId === "news"
                  ? "text-[12px] uppercase tracking-luxe text-red-400 underline decoration-red-400/80 underline-offset-4"
                  : "text-[12px] uppercase tracking-luxe text-ash"
              }
              data-active-anchor
            >
              {t.title}
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.01em]">
              {t.subtitle}
            </h2>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-[12px] uppercase tracking-luxe text-ash">{t.topLabel}</div>
          <div className="mt-4 rounded-xl2 border border-hairline overflow-hidden bg-panel">
            {topItems.map((it, idx) => (
              <div key={it.id}>
                <a href={it.url} target="_blank" rel="noreferrer" className="news-row">
                  <div className="news-row-title">{it.title}</div>
                  <div className="news-row-meta">
                    <span>{it.source}</span>
                    <span>{it.time}</span>
                  </div>
                </a>
                {idx !== topItems.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="text-[12px] uppercase tracking-luxe text-ash">{t.editorLabel}</div>
          <div className="mt-4 rounded-xl2 border border-hairline overflow-hidden bg-panel">
            {(goItems ?? t.manual).slice(0, 3).map((it, idx) => (
              <div key={it.id}>
                <a href={it.url} className="news-editor-row">
                  <div className="news-editor-title">{it.title}</div>
                  <div className="news-editor-meta">
                    <span>{it.source}</span>
                    <span>{it.time}</span>
                </div>
              </a>
                {idx !== t.manual.length - 1 && <Divider />}
            </div>
          ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
