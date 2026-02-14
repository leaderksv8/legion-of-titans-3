import Container from "@/shared/ui/Container";
import Divider from "@/shared/ui/Divider";
import LocaleToggle from "@/shared/ui/LocaleToggle";
import Burger from "@/shared/ui/Burger";
import { MotionDiv, fadeUp } from "@/shared/ui/motion";
import { nav, branding } from "@/content/site";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScrollLink from "@/shared/ui/ScrollLink";
import { useActiveSection } from "@/shared/lib/useActiveSection";
import { useContactModal } from "@/features/contact/ContactModalContext";
import { useLocale } from "@/shared/lib/localeContext";
import GuideDock from "@/features/guide/GuideDock";
import { withBase } from "@/shared/lib/paths";

function linkClass(isActive: boolean) {
  return isActive
    ? "text-red-400 underline decoration-red-400/80 underline-offset-4"
    : "link-gold";
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const { openContact } = useContactModal();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const links = nav[locale];
  const branding_t = branding[locale];
  const { activeId } = useActiveSection(links.map((l) => l.href), { headerOffsetPx: 80 });
  const hasActive = activeId.length > 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <>
      <GuideDock />
      <header className="sticky top-0 z-50 bg-ink">
        <Container>
          <MotionDiv variants={fadeUp} initial="hidden" animate="show" className="flex h-16 items-center justify-between">
            {/* Use ScrollLink so logo works correctly on GitHub Pages with basename */}
            <ScrollLink href="/#home" className="inline-flex items-center gap-2 sm:gap-3 logo-link min-w-0 flex-1 sm:flex-none">
              <span className="flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center overflow-visible logo-wrap flex-shrink-0">
                <img
                  src={withBase("/images/logo/logo%20white.svg?v=2")}
                  alt="ГО «Легіон Титанів»"
                  className="block h-14 sm:h-16 w-14 sm:w-16 object-contain origin-top scale-[2.0] logo-glow"
                  loading="eager"
                />
              </span>

              <span className="min-w-0 text-white">
                <span className="hidden max-[420px]:block leading-tight">
                  <span className="block text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-ash/80">{branding_t.headerOrg}</span>
                  <span className="block text-[12px] sm:text-[13px] font-semibold tracking-[0.10em]">{branding_t.headerName}</span>
                </span>
                <span className="block max-[420px]:hidden text-[13px] sm:text-sm md:text-base font-semibold tracking-[0.10em] whitespace-nowrap truncate">
                  {branding_t.headerOrg} {branding_t.headerName}
                </span>
              </span>
            </ScrollLink>

            <nav className="hidden lg:flex items-center gap-6 lg:gap-7 text-[11px] sm:text-[12px] lg:text-[12px] uppercase tracking-luxe text-ash">
              {links.map((l) => (
                l.href.includes("#contact") ? (
                  <button
                    key={l.href}
                    type="button"
                    className={linkClass(false)}
                    onClick={() => openContact()}
                  >
                    {l.label}
                  </button>
              ) : (
                <ScrollLink
                  key={l.href}
                  href={l.href}
                  className={linkClass(isHome && hasActive && l.href.includes(`#${activeId}`))}
                >
                    {l.label}
                  </ScrollLink>
                )
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <LocaleToggle locale={locale} onChange={setLocale} />
              <Burger open={open} onClick={() => setOpen((v) => !v)} />
            </div>
          </MotionDiv>
        </Container>

        {/* Mobile menu */}
        <div className={"lg:hidden " + (open ? "block" : "hidden")}>
          <Divider />
          <Container>
            <div className="py-3 sm:py-4 flex flex-col gap-2 sm:gap-3 text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash">
              {links.map((l) => (
                l.href.includes("#contact") ? (
                  <button
                    key={l.href}
                    type="button"
                    className={"py-2 text-left " + linkClass(false)}
                    onClick={() => {
                      setOpen(false);
                      openContact();
                    }}
                  >
                    {l.label}
                  </button>
              ) : (
                <ScrollLink
                  key={l.href}
                  href={l.href}
                  className={"py-2 " + linkClass(isHome && hasActive && l.href.includes(`#${activeId}`))}
                  onClick={() => setOpen(false)}
                >
                    {l.label}
                  </ScrollLink>
                )
              ))}
            </div>
          </Container>
        </div>

        <div className={scrolled ? "opacity-100" : "opacity-0"}>
          <Divider />
        </div>
      </header>
    </>
  );
}

