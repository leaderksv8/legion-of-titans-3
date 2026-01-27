import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import Header from "@/features/header/Header";
import Footer from "@/features/footer/Footer";
import Container from "@/shared/ui/Container";
import Divider from "@/shared/ui/Divider";

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

export default function ThanksPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/public?type=thanks&limit=100`, { cache: "no-store" });
        const j = await r.json().catch(() => ({}));
        setItems(Array.isArray(j?.items) ? j.items : []);
      } catch {
        try {
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
            .slice(0, 100)
            .map((x: any) => ({
              id: Number(x.id),
              type: "thanks" as const,
              name: x?.name ?? null,
              message: String(x?.message ?? ""),
              created_at: String(x?.created_at ?? ""),
              published_at: x?.published_at ? String(x.published_at) : null,
            }));
          setItems(items);
        } catch {
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Подяки від ветеранів — ГО «ЛЕГІОН ТИТАНІВ»</title>
        <meta name="description" content="Архів опублікованих подяк від ветеранів після модерації." />
        <meta property="og:title" content="Подяки від ветеранів — ГО «ЛЕГІОН ТИТАНІВ»" />
        <meta property="og:description" content="Архів опублікованих подяк від ветеранів після модерації." />
        <link rel="canonical" href="/thanks" />
      </Helmet>

      <main className="grain min-h-screen">
        <Header />
        <section className="py-14">
          <Container>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-luxe text-ash">Архів</div>
                <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">Подяки від ветеранів</h1>
                <div className="mt-2 text-ash">Опубліковані після модерації.</div>
              </div>

              <Link
                to="/#heroes"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[12px] tracking-luxe uppercase text-paper/90 hover:border-gold/50 hover:text-paper"
                aria-label="Закрити архів і повернутися на головну"
              >
                Закрити архів
              </Link>
            </div>

            <div className="mt-8 rounded-xl2 border border-hairline overflow-hidden bg-panel">
              {loading ? (
                <div className="p-8 text-ash">Завантаження…</div>
              ) : items.length === 0 ? (
                <div className="p-8 text-ash">Поки що немає опублікованих подяк.</div>
              ) : (
                items.map((s, idx) => (
                  <div key={s.id}>
                    <div className="p-6 md:p-8 grid gap-5 md:grid-cols-12">
                      <div className="md:col-span-3">
                        <div className="text-[11px] uppercase tracking-luxe text-ash">
                          {formatDate(s.published_at ?? s.created_at)}
                        </div>
                      </div>
                      <div className="md:col-span-9">
                        <div className="text-lg md:text-xl font-semibold">{s.name ? s.name : "Анонімна подяка"}</div>
                        <p className="mt-3 text-ash leading-relaxed whitespace-pre-line max-w-[78ch]">{s.message}</p>
                      </div>
                    </div>
                    {idx !== items.length - 1 && <Divider />}
                  </div>
                ))
              )}
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    </>
  );
}

