import Container from "@/shared/ui/Container";
import Badge from "@/shared/ui/Badge";
import { MotionDiv, MotionH1, MotionP, stagger, fadeUp } from "@/shared/ui/motion";
import { hero, type Locale } from "@/content/site";
import { useContactModal } from "@/features/contact/ContactModalContext";
import { useEffect, useState } from "react";

export default function HomeHero() {
  // read locale from localStorage if set by toggle later (simple)
  const [locale, setLocale] = useState<Locale>("uk");
  const { openContact } = useContactModal();

  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "uk" || saved === "en") setLocale(saved);
    const onStorage = () => {
      const s = window.localStorage.getItem("locale") as Locale | null;
      if (s === "uk" || s === "en") setLocale(s);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const t = hero[locale];

  return (
    <section id="home" className="relative overflow-hidden hero-premium" aria-label="Hero">
      <Container>
        <div className="pt-14 md:pt-20 lg:pt-24 pb-10 md:pb-14">
          <MotionDiv variants={stagger} initial="hidden" animate="show" className="relative z-10 max-w-[1040px]">
            <MotionDiv variants={fadeUp}>
              <Badge>{t.org}</Badge>
            </MotionDiv>

            <MotionP variants={fadeUp} className="mt-6 text-[12px] uppercase tracking-luxe text-ash hero-subtitle">
              {t.suborg}
            </MotionP>

            <MotionH1
              variants={fadeUp}
              className="mt-5 font-display text-[38px] leading-[1.02] md:text-[76px] lg:text-[96px] tracking-[-0.03em] hero-title"
            >
              {t.statementTop}
              <span className="block mt-2 md:mt-3">{t.statementBottom}</span>
            </MotionH1>

            <MotionP variants={fadeUp} className="mt-6 max-w-[78ch] text-base md:text-lg text-ash leading-relaxed">
              {t.mission}
            </MotionP>

            <MotionDiv variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                type="button"
                onClick={() => openContact()}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-hairline px-6 py-3 text-[12px] uppercase tracking-luxe text-paper transition-colors hero-cta"
              >
                {t.ctaPrimary}
              </button>
              <a
                href="#activity"
                className="inline-flex w-full sm:w-auto items-center justify-center px-2 py-3 text-[12px] uppercase tracking-luxe link-gold"
              >
                {t.ctaSecondary}
              </a>
            </MotionDiv>

            <MotionDiv variants={fadeUp} className="mt-10">
              <p className="text-[12px] uppercase tracking-luxe text-ash">{t.proof}</p>
            </MotionDiv>
          </MotionDiv>
        </div>
      </Container>
    </section>
  );
}
