import Container from "@/shared/ui/Container";
import Divider from "@/shared/ui/Divider";
import { Link } from "react-router-dom";
import { heroes } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  type: "thanks";
  name: string | null;
  message: string;
  published_at: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  try {
    const safe = iso.includes(" ") && !iso.includes("T") ? iso.replace(" ", "T") : iso;
    const d = new Date(safe);
    return d.toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "2-digit" });
  } catch {
    return "";
  }
}

export default function Heroes() {
  const { locale } = useLocale();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const activeId = useActiveSectionId();

  const t = heroes[locale];

  async function loadFallbackFromStatic(limit: number) {
    const r = await fetch(`/api/_data/submissions.json`, { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    const list = Array.isArray(j?.submissions) ? j.submissions : [];
    const items = list
      .filter((x: any) => x?.type === "thanks" && x?.status === "APPROVED")
      .sort((a: any, b: any) => {
        const ad = String(a?.published_at ?? a?.created_at ?? "");
        const bd = String(b?.published_at ?? b?.created_at ?? "");
        return bd.localeCompare(ad);
      })
      .slice(0, limit)
      .map((x: any) => ({
        id: Number(x.id),
        type: "thanks" as const,
        name: x?.name ?? null,
        message: String(x?.message ?? ""),
        created_at: String(x?.created_at ?? ""),
        published_at: x?.published_at ? String(x.published_at) : null,
      }));
    setItems(items);
  }

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/public?type=thanks&limit=3`, { cache: "no-store" });
      const j = await r.json();
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch {
      try {
        await loadFallbackFromStatic(3);
      } catch {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="heroes" className="py-10 sm:py-12 md:py-14">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <div
              className={
                activeId === "heroes"
                  ? "text-[11px] sm:text-[12px] uppercase tracking-luxe text-red-400 underline decoration-red-400/80 underline-offset-4"
                  : "text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash"
              }
              data-active-anchor
            >
              {t.title}
            </div>
            <h2 className="mt-3 sm:mt-4 text-[28px] sm:text-2xl md:text-3xl font-semibold tracking-[-0.01em] leading-tight">
              {t.subtitle}
            </h2>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3">
            <a
              className="hidden md:inline-flex text-[12px] uppercase tracking-luxe text-ash hover:text-paper transition-colors"
              href="/thanks"
            >
              {t.archiveLabel}
            </a>
            <Link
              to="/thanks"
              className="inline-flex items-center justify-center rounded-full px-5 sm:px-4 py-3 sm:py-2 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 hover:bg-white/5 hover:text-gold transition-colors"
            >
              {locale === "uk" ? "Надіслати подяку" : "Send thanks"}
            </Link>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 rounded-xl2 border border-hairline overflow-hidden bg-panel">
          {loading ? (
            <div className="p-6 sm:p-8 text-ash text-[14px] sm:text-base">{locale === "uk" ? "Завантаження…" : "Loading…"}</div>
          ) : items.length === 0 ? (
            <div className="p-6 sm:p-8 text-ash text-[14px] sm:text-base leading-relaxed">
              {locale === "uk" 
                ? "Поки що немає опублікованих матеріалів. Ви можете надіслати подяку — після модерації вона з'явиться тут."
                : "No published materials yet. You can send thanks — after moderation it will appear here."}
            </div>
          ) : (
            items.map((s, idx) => (
              <div key={s.id}>
                <div className="p-5 sm:p-6 md:p-8 grid gap-4 sm:gap-5 md:grid-cols-12">
                                    <div className="md:col-span-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-black/30 px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-luxe text-ash">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/70" aria-hidden="true" />
                      {formatDate(s.published_at ?? s.created_at)}
                    </div>
                  </div>
                  <div className="md:col-span-9 min-w-0">
                    <div className="text-[16px] sm:text-lg md:text-xl font-semibold tracking-tight leading-snug break-words">
                      {s.name ? s.name : "Анонімна подяка"}
                    </div>
                    <p className="mt-3 text-ash leading-relaxed text-[15px] md:text-[16px] max-w-[78ch] whitespace-pre-line">
                      {s.message}
                    </p>
                  </div>
                </div>
                {idx !== items.length - 1 && <Divider />}
              </div>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
