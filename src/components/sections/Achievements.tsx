import Container from "@/shared/ui/Container";
import Divider from "@/shared/ui/Divider";
import { achievements } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";

export default function Achievements() {
  const { locale } = useLocale();
  const activeId = useActiveSectionId();
  const t = achievements[locale];

  return (
    <section id="achievements" className="py-10 sm:py-12 md:py-14">
      <Container>
        <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div
              className={
                activeId === "achievements"
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
            <p className="mt-4 text-[14px] sm:text-base text-ash leading-relaxed">
              Дашборд оновлюється вашими реальними цифрами. Зараз — ваші приклади.
            </p>
          </div>

          <div className="md:col-span-7 rounded-xl2 border border-hairline overflow-hidden bg-panel">
            <div className="p-5 sm:p-6 md:p-8">
              <div className="achievements-marquee">
                <div className="achievements-track" aria-label="Наші досягнення у цифрах">
                  {t.stats.map((s) => (
                    <div key={`a-${s.v}`} className="achievements-item">
                      <div className="achievements-k">{s.k}</div>
                      <div className="achievements-v">{s.v}</div>
                    </div>
                  ))}
              {t.stats.map((s) => (
                    <div key={`b-${s.v}`} className="achievements-item" aria-hidden="true">
                      <div className="achievements-k">{s.k}</div>
                      <div className="achievements-v">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Divider />
            <div className="p-5 sm:p-6 md:p-8 text-[14px] sm:text-sm text-ash">
              <span className="text-paper">Принцип:</span> максимум прозорості без шкоди безпеці.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
