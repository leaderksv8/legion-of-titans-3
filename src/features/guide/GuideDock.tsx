import { useState } from "react";
import Modal from "@/shared/ui/Modal";
import Container from "@/shared/ui/Container";
import { guide, type GuideContent } from "@/content/guide";
import { type Locale } from "@/content/site";

export default function GuideDock() {
  const [open, setOpen] = useState(false);
  const [locale] = useState<Locale>(() => {
    const saved = window.localStorage.getItem("locale");
    return saved === "en" ? "en" : "uk";
  });
  const t = guide[locale] as GuideContent;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-2 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-40 rounded-full border border-gold/40 bg-black/70 px-3 py-5 text-[11px] uppercase tracking-[0.32em] text-paper shadow-[0_10px_30px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08),0_0_24px_rgba(201,178,124,0.25)] backdrop-blur-[2px] hover:bg-black/85 hover:shadow-[0_12px_34px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.12),0_0_30px_rgba(201,178,124,0.32)] transition-all guide-pulse guide-vibrate sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
        aria-label="Відкрити довідник"
      >
        <span className="flex flex-col items-center gap-1">
          {["Д", "О", "В", "І", "Д", "Н", "И", "К"].map((ch) => (
            <span key={ch} className="leading-none">
              {ch}
            </span>
          ))}
        </span>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t.title}
        overlayClassName="bg-black"
        surfaceClassName="guide-surface rounded-2xl border border-hairline shadow-2xl max-h-[calc(100dvh-2rem)] overflow-hidden w-full max-w-3xl"
      >
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain touch-pan-y hide-scrollbar">
          <div className="sticky top-0 z-20 border-b border-hairline guide-surface pt-[env(safe-area-inset-top)]">
            <div className="p-6 md:p-7 flex items-start justify-between gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-luxe text-ash">{t.title}</div>
                <div className="mt-2 text-xl md:text-2xl font-semibold">{t.subtitle}</div>
              </div>
              <button
                type="button"
                className="rounded-full px-3 py-1 text-ash hover:text-paper transition-colors"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 md:p-7 pt-4 md:pt-4 pb-8">
            <div>
              <input
                type="search"
                placeholder="Пошук по темах…"
                className="h-11 w-full rounded-xl border border-hairline guide-field px-4 text-paper outline-none focus:border-gold/60"
              />
              <div className="mt-2 text-[12px] text-ash">Пошук працюватиме після наповнення.</div>
            </div>

            <div className="mt-6">
              <div className="text-[12px] uppercase tracking-luxe text-ash">Швидкі дії</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {t.quickStart.map((q) => (
                  <a
                    key={q.id}
                    href={`/guide#${q.id}`}
                    className="guide-card rounded-xl2 border border-hairline p-4 transition-colors"
                  >
                    <div className="text-sm font-semibold">{q.title}</div>
                    <div className="mt-2 text-[12px] text-ash">Маршрут: {q.steps.join(" → ")}</div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[12px] uppercase tracking-luxe text-ash">Що зараз актуально</div>
              <ul className="mt-3 grid gap-2 text-sm text-ash">
                {t.updates.map((u) => (
                  <li key={u} className="guide-chip rounded-xl border border-hairline px-3 py-2">
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              <a
                href="/guide"
                className="inline-flex items-center justify-center rounded-full border border-gold/40 px-5 py-2 text-[12px] uppercase tracking-luxe text-paper hover:bg-gold/10 transition-colors"
              >
                Відкрити довідник повністю
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
