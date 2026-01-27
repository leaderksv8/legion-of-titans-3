import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import Header from "@/features/header/Header";
import Footer from "@/features/footer/Footer";

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

function scrollToHash() {
  const id = window.location.hash.replace("#", "");
  if (!id) return;
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  // allow layout settle
  window.requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
}

export default function HomePage() {
  useEffect(() => {
    scrollToHash();
    const onHash = () => scrollToHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <Helmet>
        <title>ГО «ЛЕГІОН ТИТАНІВ»</title>
        <meta name="description" content="Ветерани війни з обмеженими можливостями Бучанського району." />
        <meta property="og:title" content="ГО «ЛЕГІОН ТИТАНІВ»" />
        <meta property="og:description" content="Ветерани війни з обмеженими можливостями Бучанського району." />
        <link rel="canonical" href="/" />
      </Helmet>

      <main className="grain min-h-screen">
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
          <HomeHero />
          <Activity />
          <InFocus />
          <Achievements />
          <Heroes />
          <TeamSection />
          <Partners />
          <News />
          <Founders />
        </ActiveSectionProvider>

        <Footer />
      </main>
    </>
  );
}

