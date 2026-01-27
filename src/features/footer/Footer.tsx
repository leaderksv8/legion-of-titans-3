import Container from "@/shared/ui/Container";
import ScrollLink from "@/shared/ui/ScrollLink";
import { useLocale } from "@/shared/lib/localeContext";
import { branding } from "@/content/site";

const CONTACTS = {
  phone: "+38 (097) 725-21-21",
  email: "ngo@legion-of-titans.org",
};

export default function Footer() {
  const { locale } = useLocale();
  const t = branding[locale];
  
  const NAV_LINKS = [
    // Absolute hash links so footer navigation works correctly from sub-routes (e.g., /thanks).
    { href: "/#home", label: t.footerNavHome },
    { href: "/#activity", label: t.footerNavActivity },
    { href: "/#events", label: t.footerNavEvents },
    { href: "/#team", label: t.footerNavTeam },
  ];
  return (
    <footer className="mt-16 border-t border-hairline">
      <div className="bg-black/25">
        <Container>
          <div className="py-10 md:py-12">
            <div className="grid gap-8 md:gap-10 md:grid-cols-2 items-start">
              {/* Contacts */}
              <div className="rounded-2xl border border-hairline bg-panel/35 backdrop-blur-md p-6 shadow-luxe">
                <div className="text-[10px] uppercase tracking-luxe text-ash">{t.footerContactsTitle}</div>

                <div className="mt-4 space-y-2 text-sm md:text-[15px] leading-relaxed text-paper">
                  <div>
                    <span className="block">{t.footerAddressLine1}</span>
                    <span className="block">{t.footerAddressLine2}</span>
                  </div>

                  <a className="link-gold block w-fit break-words" href={`tel:${CONTACTS.phone.replace(/[^+\d]/g, "")}`}>
                    {CONTACTS.phone}
                  </a>

                  <a className="link-gold block w-fit break-all" href={`mailto:${CONTACTS.email}`}>
                    {CONTACTS.email}
                  </a>
                </div>
              </div>

              {/* Quick nav */}
              <div className="rounded-2xl border border-hairline bg-panel/35 backdrop-blur-md p-6 shadow-luxe">
                <div className="text-[10px] uppercase tracking-luxe text-ash">{t.footerNavTitle}</div>

                <ul className="mt-4 space-y-2 text-sm md:text-[15px]">
                  {NAV_LINKS.map((item) => (
                    <li key={item.href}>
                      <ScrollLink className="link-gold" href={item.href}>
                        {item.label}
                      </ScrollLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 border-t border-hairline/70 pt-6 text-center text-[11px] tracking-[0.32em] text-ash">
              {t.footerCopyright}
            </div>
          </div>
        </Container>
      </div>

      <div className="footer-ticker">
        <div className="footer-ticker-track">
          <div className="footer-ticker-text">
            {t.footerTestMode}
          </div>
        </div>
      </div>
    </footer>
  );
}

