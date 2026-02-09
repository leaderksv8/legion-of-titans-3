import Container from "@/shared/ui/Container";
import Badge from "@/shared/ui/Badge";
import { MotionDiv, MotionH1, MotionP, stagger, fadeUp } from "@/shared/ui/motion";
import { hero } from "@/content/site";
import { useContactModal } from "@/features/contact/ContactModalContext";
import { useLocale } from "@/shared/lib/localeContext";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { useCursorSpotlight } from "@/shared/lib/useCursorSpotlight";
import { useMagneticButton } from "@/shared/lib/useMagneticButton";
import FloatingParticles from "@/shared/ui/FloatingParticles";

export default function HomeHero() {
  const { locale } = useLocale();
  const { openContact } = useContactModal();
  const t = hero[locale];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const spotlightRef = useCursorSpotlight();
  const { buttonRef, position } = useMagneticButton(0.4);

  return (
    <section id="home" className="relative overflow-hidden hero-premium hero-cinematic" aria-label="Hero" ref={ref}>
      {/* Cursor Spotlight */}
      <div 
        ref={spotlightRef}
        className="cursor-spotlight"
        style={{
          '--x': '50%',
          '--y': '50%',
        } as React.CSSProperties}
      />
      
      {/* Animated Gradient Mesh */}
      <div className="gradient-mesh" />

      {/* Cinematic Overlays */}
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-orb hero-orb-left" aria-hidden="true" />
      <div className="hero-orb hero-orb-right" aria-hidden="true" />
      <div className="hero-beams" aria-hidden="true" />
      <div className="hero-rings" aria-hidden="true" />
      
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Parallax Background - Enhanced */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none parallax-bg opacity-60 md:opacity-75">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-gold/3 to-transparent"></div>
      </motion.div>
      <Container>
        <div className="pt-12 sm:pt-14 md:pt-20 lg:pt-24 pb-3 sm:pb-4 md:pb-6 lg:pb-4 relative z-10">
          <div className="hero-text-glow" aria-hidden="true" />
          <MotionDiv variants={stagger} initial="hidden" animate="show" className="relative z-10 max-w-[1040px]">
            <MotionDiv variants={fadeUp} className="inline-flex items-center gap-3">
              <Badge>{t.org}</Badge>
              <span className="hidden sm:inline-block h-px w-16 bg-gold/30" aria-hidden="true" />
            </MotionDiv>

            <MotionP variants={fadeUp} className="mt-4 sm:mt-6 text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash hero-subtitle">
              {t.suborg}
            </MotionP>

            <MotionH1
              variants={fadeUp}
              className="mt-4 sm:mt-5 font-display text-[42px] sm:text-[56px] md:text-[76px] lg:text-[96px] 2xl:text-[128px] leading-[1.05] sm:leading-[1.02] tracking-[-0.02em] sm:tracking-[-0.03em] 2xl:tracking-[-0.04em] hero-title hero-title-shimmer letter-reveal"
            >
              {t.statementTop}
              <span className="block mt-2 sm:mt-2 md:mt-3">{t.statementBottom}</span>
            </MotionH1>

            <MotionP variants={fadeUp} className="mt-5 sm:mt-6 max-w-[78ch] text-[15px] sm:text-base md:text-lg lg:text-xl text-ash leading-relaxed">
              {t.mission}
            </MotionP>

            <MotionDiv variants={fadeUp} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              <motion.button
                ref={buttonRef}
                type="button"
                onClick={() => openContact()}
                animate={{
                  x: position.x,
                  y: position.y,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-hairline px-6 sm:px-7 py-4 sm:py-3 text-[12px] sm:text-[11px] uppercase tracking-luxe text-paper transition-all hover:bg-gold/5 active:scale-95 hero-cta hero-cta-premium btn-gold magnetic-button ripple-container"
              >
                {t.ctaPrimary}
              </motion.button>
              <a
                href="#activity"
                className="inline-flex w-full sm:w-auto items-center justify-center px-3 sm:px-2 py-4 sm:py-3 text-[12px] sm:text-[11px] uppercase tracking-luxe link-gold transition-opacity hover:opacity-70"
              >
                {t.ctaSecondary}
              </a>
            </MotionDiv>

            <MotionDiv variants={fadeUp} className="mt-8 sm:mt-10">
              <p className="text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash">{t.proof}</p>
            </MotionDiv>
          </MotionDiv>
        </div>
      </Container>
    </section>
  );
}
