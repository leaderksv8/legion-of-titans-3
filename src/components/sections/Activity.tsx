import Container from "@/shared/ui/Container";
import { activity } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";
import { motion } from "framer-motion";
import { use3DTilt } from "@/shared/lib/use3DTilt";

function Card({ title, desc, index }: { title: string; desc: string; index: number }) {
  const { elementRef, tilt } = use3DTilt(12);
  
  return (
    <motion.div 
      ref={elementRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className="group rounded-xl2 border border-hairline bg-panel p-5 sm:p-6 md:p-7 lg:p-8 card-gold card-3d transition-all duration-300 hover:shadow-2xl"
    >
      <div className="text-[11px] sm:text-[12px] uppercase tracking-luxe text-gold group-hover:text-gold/90 transition-colors">{title}</div>
      <p className="mt-3 text-[14px] sm:text-sm md:text-base text-ash leading-relaxed group-hover:text-paper/95 transition-colors">{desc}</p>
      <div className="mt-4 sm:mt-5 h-px w-full bg-hairline group-hover:bg-gold/40 group-hover:shadow-gold/20 group-hover:shadow-lg transition-all" />
    </motion.div>
  );
}

export default function Activity() {
  const { locale } = useLocale();
  const activeId = useActiveSectionId();
  const t = activity[locale];

  return (
    <section id="activity" className="py-10 sm:py-12 md:py-14">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6"
        >
          <div>
            <div
              className={
                activeId === "activity"
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
          <div className="hidden md:block text-[12px] uppercase tracking-luxe text-ash">06 areas</div>
        </motion.div>

        <div className="mt-7 sm:mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((c, idx) => (
            <Card key={c.title} title={c.title} desc={c.desc} index={idx} />
          ))}
        </div>
      </Container>
    </section>
  );
}
