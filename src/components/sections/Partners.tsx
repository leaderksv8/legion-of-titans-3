import Container from "@/shared/ui/Container";
import { partners } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";
import { useMemo } from "react";

type Partner = {
  name: string;
  logo: string;
  url: string;
};

function sectionTitleClass(active: boolean) {
  return active
    ? "text-[12px] uppercase tracking-luxe text-red-400 underline decoration-red-400/80 underline-offset-4"
    : "text-[12px] uppercase tracking-luxe text-ash";
}

export default function Partners() {
  const { locale } = useLocale();
  const activeId = useActiveSectionId();
  const t = partners[locale];
  const items = useMemo(() => t.items as Partner[], [t.items]);
  const isActive = activeId === "partners";

  return (
    <section id="partners" className="py-14">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className={sectionTitleClass(isActive)} data-active-anchor>
              {t.title}
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.01em]">
              {t.subtitle}
            </h2>
          </div>
          <div className="hidden md:block text-[12px] uppercase tracking-luxe text-ash">
            Selected
          </div>
        </div>

        <div className="mt-8 partner-marquee">
          <div className="partner-track" aria-label="Логотипи партнерів">
            {items.map((p) => (
              p.url && p.url !== "#" ? (
                <a
                  key={`a-${p.name}`}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="partner-pill"
                  aria-label={p.name}
                >
                  <img src={p.logo} alt={p.name} loading="lazy" />
                </a>
              ) : (
                <div key={`a-${p.name}`} className="partner-pill" aria-label={p.name}>
                  <img src={p.logo} alt={p.name} loading="lazy" />
                </div>
              )
            ))}
            {items.map((p) => (
              p.url && p.url !== "#" ? (
                <a
                  key={`b-${p.name}`}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="partner-pill"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <img src={p.logo} alt="" loading="lazy" />
                </a>
              ) : (
                <div key={`b-${p.name}`} className="partner-pill" aria-hidden="true">
                  <img src={p.logo} alt="" loading="lazy" />
            </div>
              )
          ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
