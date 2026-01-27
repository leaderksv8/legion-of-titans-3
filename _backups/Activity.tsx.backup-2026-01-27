import Container from "@/shared/ui/Container";
import { activity, type Locale } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useEffect, useState } from "react";

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group rounded-xl2 border border-hairline bg-panel p-6 md:p-7 card-gold transition-colors">
      <div className="text-[12px] uppercase tracking-luxe text-gold">{title}</div>
      <p className="mt-3 text-sm text-ash leading-relaxed">{desc}</p>
      <div className="mt-5 h-px w-full bg-hairline group-hover:bg-paper/20 transition-colors" />
    </div>
  );
}

export default function Activity() {
  const [locale, setLocale] = useState<Locale>("uk");
  const activeId = useActiveSectionId();
  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "uk" || saved === "en") setLocale(saved);
  }, []);
  const t = activity[locale];

  return (
    <section id="activity" className="py-14">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div
              className={
                activeId === "activity"
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
          <div className="hidden md:block text-[12px] uppercase tracking-luxe text-ash">06 areas</div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((c) => (
            <Card key={c.title} title={c.title} desc={c.desc} />
          ))}
        </div>
      </Container>
    </section>
  );
}
