import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigationType } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import SEOHead from "@/features/seo/SEOHead";
import Header from "@/features/header/Header";
import Footer from "@/features/footer/Footer";
import { useCustomCursor } from "@/shared/lib/useCustomCursor";
import { useRippleOnClick } from "@/shared/lib/useRippleOnClick";
import { useMobileOptimization } from "@/shared/lib/useMobileOptimization";
import ScrollProgressBar from "@/shared/ui/ScrollProgressBar";

import HomeHero from "@/components/sections/HomeHero";
import Activity from "@/components/sections/Activity";
import Achievements from "@/components/sections/Achievements";
import Heroes from "@/components/sections/Heroes";
import TeamSection from "@/features/team/TeamSection";
import News from "@/components/sections/News";
import InFocus from "@/components/sections/InFocus";
import Partners from "@/components/sections/Partners";
import Founders from "@/components/sections/Founders";
import { ActiveSectionProvider } from "@/shared/lib/activeSectionContext";

const SCROLL_KEY = "lt-scroll-y";
const RESTORE_KEY = "lt-scroll-restore";
const SCROLL_OFFSET = 80; // Компенсація для header

function scrollToHash(behavior: ScrollBehavior) {
  const id = window.location.hash.replace("#", "");
  if (!id) return;
  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  // allow layout settle
  window.requestAnimationFrame(() => {
    const offset = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, offset), behavior, block: "start" });
  });
}

export default function HomePage() {
  const navigationType = useNavigationType();
  const hasRestoredRef = useRef(false);
  useCustomCursor();
  useRippleOnClick();
  useMobileOptimization();
  
  // Використовуємо useLayoutEffect для INSTANT відновлення ДО відмалювання
  useLayoutEffect(() => {
    // Сценарій 1: Повернення назад (POP) - відновлюємо позицію
    if (navigationType === "POP") {
      const savedY = sessionStorage.getItem(SCROLL_KEY);
      const shouldRestore = sessionStorage.getItem(RESTORE_KEY) === "1";
      
      if (shouldRestore && savedY) {
        const y = Number(savedY);
        if (Number.isFinite(y) && y > 0) {
          // Відновлюємо позицію СИНХРОННО (ДО відмалювання)
          window.scrollTo(0, y);
          hasRestoredRef.current = true;
          
          // Для мобільних - додаткова перевірка після рендеру
          const isMobile = 'ontouchstart' in window;
          if (isMobile) {
            requestAnimationFrame(() => {
              if (window.scrollY !== y) {
                window.scrollTo(0, y);
              }
            });
          }
          
          // Очищуємо дані
          sessionStorage.removeItem(SCROLL_KEY);
          sessionStorage.removeItem(RESTORE_KEY);
          return;
        }
      }
    }
  }, [navigationType]);
  
  // Сценарій 2: Нова навігація або хеш-скрол
  useEffect(() => {
    // Якщо вже було відновлення - пропускаємо
    if (hasRestoredRef.current) {
      return;
    }
    
    // Скролимо до хешу якщо є
    const behavior: ScrollBehavior = navigationType === "POP" ? "auto" : "smooth";
    scrollToHash(behavior);
    
    // Слухач для змін хешу
    const onHash = () => {
      if (hasRestoredRef.current) {
        hasRestoredRef.current = false;
        return;
      }
      scrollToHash("auto");
    };
    
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [navigationType]);

  return (
    <>
      <SEOHead />
      <ScrollProgressBar />

      <main className="grain min-h-screen bg-premium">
        <Header />

        <ActiveSectionProvider
          ids={[
            "home",
            "activity",
            "events",
            "achievements",
            "heroes",
            "team",
            "partners",
            "news",
            "founders",
          ]}
        >
          <div className="premium-sections">
            <HomeHero />
            <Activity />
            <InFocus />
            <Achievements />
            <Heroes />
            <TeamSection />
            <Partners />
            <News />
            <Founders />
          </div>
        </ActiveSectionProvider>

        <Footer />
      </main>
    </>
  );
}

