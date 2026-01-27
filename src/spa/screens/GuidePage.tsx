import { Helmet } from "react-helmet-async";
import SEOHead from "@/features/seo/SEOHead";
import Header from "@/features/header/Header";
import Footer from "@/features/footer/Footer";
import Container from "@/shared/ui/Container";
import { guide } from "@/content/guide";
import { useEffect, useState } from "react";
import { type Locale } from "@/content/site";

export default function GuidePage() {
  const [locale, setLocale] = useState<Locale>("uk");
  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "uk" || saved === "en") setLocale(saved);
  }, []);
  const t = guide[locale];

  return (
    <>
      <SEOHead />

      <main className="grain min-h-screen">
        <Header />
        <section className="py-14">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
              <aside className="lg:sticky lg:top-24 h-fit">
                <div className="text-[12px] uppercase tracking-luxe text-ash">Навігація</div>
                <ul className="mt-4 grid gap-2 text-sm text-ash">
                  <li>
                    <a className="link-gold" href="#guide-start">
                      {t.quickStartTitle}
                    </a>
                  </li>
                  {t.categories.map((c) => (
                    <li key={c.id}>
                      <a className="link-gold" href={`#${c.id}`}>
                        {c.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>

              <div>
                <div className="guide-surface rounded-2xl border p-6 md:p-7">
                  <div className="text-[12px] uppercase tracking-luxe text-ash">{t.title}</div>
                  <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">{t.subtitle}</h1>
                  <div className="mt-5">
                    <input
                      type="search"
                      placeholder="Пошук по темах…"
                      className="guide-field h-11 w-full rounded-xl border px-4 text-paper outline-none focus:border-gold/60"
                    />
                    <div className="mt-2 text-[12px] text-ash">Пошук працюватиме після наповнення.</div>
                  </div>
                </div>

                <section id="guide-start" className="mt-10">
                  <div className="text-[12px] uppercase tracking-luxe text-ash">{t.quickStartTitle}</div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {t.quickStart.map((q) => (
                      <div key={q.id} id={q.id} className="guide-card rounded-2xl border p-6">
                        <div className="text-sm font-semibold">{q.title}</div>
                        <div className="mt-3 text-[12px] uppercase tracking-luxe text-ash">Маршрут 1→2→3</div>
                        <ol className="mt-2 grid gap-1 text-sm text-ash list-decimal list-inside">
                          {q.steps.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                        <div className="mt-4 text-[12px] uppercase tracking-luxe text-ash">Документи</div>
                        <ul className="mt-2 grid gap-1 text-sm text-ash list-disc list-inside">
                          {q.docs.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {q.tags.map((tag) => (
                            <span key={tag} className="guide-chip rounded-full border px-3 py-1 text-[11px] text-ash">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {t.categories.map((c) => (
                  <section key={c.id} id={c.id} className="mt-12">
                    <div className="text-[12px] uppercase tracking-luxe text-ash">{c.title}</div>
                    <div className="mt-4 grid gap-4">
                      {c.items.map((it) => (
                        <details key={it.id} className="guide-card rounded-2xl border p-6">
                          <summary className="cursor-pointer select-none text-sm font-semibold text-paper">
                            {it.title}
                          </summary>
                          <div className="mt-3 text-sm text-ash">{it.description}</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {it.tags.map((tag) => (
                            <span key={tag} className="guide-chip rounded-full border px-3 py-1 text-[11px] text-ash">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-5 grid gap-4 text-sm text-ash">
                            <div>
                              <div className="text-[12px] uppercase tracking-luxe text-ash">Коротко</div>
                              <div className="mt-2">{it.brief}</div>
                            </div>
                            <div>
                              <div className="text-[12px] uppercase tracking-luxe text-ash">Покроково</div>
                              <ol className="mt-2 list-decimal list-inside grid gap-1">
                                {it.steps.map((s) => (
                                  <li key={s}>{s}</li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <div className="text-[12px] uppercase tracking-luxe text-ash">Документи</div>
                              <ul className="mt-2 list-disc list-inside grid gap-1">
                                {it.docs.map((d) => (
                                  <li key={d}>{d}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-[12px] uppercase tracking-luxe text-ash">Куди звернутись</div>
                              <ul className="mt-2 list-disc list-inside grid gap-1">
                                {it.contacts.map((cname) => (
                                  <li key={cname}>{cname}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-[12px] uppercase tracking-luxe text-ash">Джерела</div>
                              <ul className="mt-2 list-disc list-inside grid gap-1">
                                {it.sources.map((src) => (
                                  <li key={src}>{src}</li>
                                ))}
                              </ul>
                            </div>
                            {it.mistakes && (
                              <div>
                                <div className="text-[12px] uppercase tracking-luxe text-ash">Часті помилки</div>
                                <ul className="mt-2 list-disc list-inside grid gap-1">
                                  {it.mistakes.map((m) => (
                                    <li key={m}>{m}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    </>
  );
}
