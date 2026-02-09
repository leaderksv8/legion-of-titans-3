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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Скролимо до верху при завантаженні сторінки
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "uk" || saved === "en") setLocale(saved);
  }, []);
  
  const t = guide[locale];
  const spotlight = t.quickStart.slice(0, 3);

  return (
    <>
      <SEOHead />

      <main className="grain min-h-screen bg-[#07070A]">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 border-b border-hairline overflow-hidden">
          <Container>
            <div className="relative max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-12">
                <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">{t.title}</span>
                <span className="h-1 w-1 rounded-full bg-gold/70" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-ash">Портал допомоги</span>
              </div>
              
              <div className="flex items-center justify-center">
                <img
                  src="/images/logo/logo%20white.svg?v=2"
                  alt="ГО «Легіон Титанів»"
                  className="h-56 w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 object-contain drop-shadow-[0_12px_40px_rgba(201,178,124,0.45)]"
                  loading="eager"
                />
              </div>
              
              <p className="text-lg text-cloud max-w-2xl mx-auto mb-8 -mt-16 md:-mt-20 lg:-mt-24">
                Професійно структурований довідник з чіткими маршрутами, документами та контактами
              </p>
              
              {/* Search */}
              <div className="relative max-w-2xl mx-auto">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cloud" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Пошук по темах: виплати, статус, документи..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-hairline bg-ink/70 text-snow placeholder:text-cloud/60 outline-none focus:border-gold/60 focus:bg-ink transition-all shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                />
              </div>

            </div>
          </Container>
        </section>

        {/* Quick Start Section */}
        <section id="guide-start" className="py-16 md:py-20">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-snow mb-4">{t.quickStartTitle}</h2>
                <p className="text-cloud">Найпоширеніші процедури - коротко та по суті</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {t.quickStart.map((q, index) => (
                  <div 
                    key={q.id} 
                    id={q.id} 
                    className="group relative bg-[radial-gradient(circle_at_top,rgba(201,178,124,0.08),transparent_60%)] border border-hairline rounded-3xl p-7 hover:border-gold/50 hover:bg-ink/60 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    <h3 className="text-lg font-bold text-snow mb-4 pr-12">{q.title}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gold mb-2 font-semibold">Кроки</div>
                        <ol className="space-y-2 text-sm text-cloud">
                          {q.steps.map((s, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-gold font-mono text-xs mt-0.5">{i + 1}.</span>
                              <span>{s.replace(/^\d+\)\s*/, '')}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gold mb-2 font-semibold">Документи</div>
                        <ul className="space-y-1 text-sm text-cloud">
                          {q.docs.slice(0, 3).map((d, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-gold">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                          {q.docs.length > 3 && (
                            <li className="text-xs text-cloud/60 ml-4">+{q.docs.length - 3} більше...</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {q.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Categories Navigation */}
        <section className="py-12 bg-[linear-gradient(180deg,rgba(7,7,10,0.9),rgba(7,7,10,0.6))] border-y border-hairline">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between gap-6 mb-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.32em] text-ash mb-2">Навігація</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-snow">Розділи довідника</h2>
                </div>
                <div className="hidden md:block text-sm text-cloud">Обери розділ як обкладинку журналу</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {t.categories.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    onClick={() => setActiveCategory(c.id)}
                    className={`group p-4 rounded-2xl border transition-all shadow-[0_16px_40px_rgba(0,0,0,0.3)] ${
                      activeCategory === c.id
                        ? 'border-gold bg-gold/10'
                        : 'border-hairline hover:border-gold/50 hover:bg-ink/40'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-[13px] uppercase tracking-[0.18em] text-ash">Розділ</span>
                      <span className="text-sm font-semibold text-snow group-hover:text-gold transition-colors">
                        {c.title}
                      </span>
                      <span className="text-xs text-cloud">
                        {c.items.length} {c.items.length === 1 ? 'тема' : 'теми'}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Categories Content */}
        <section className="py-16 md:py-20">
          <Container>
            <div className="max-w-6xl mx-auto space-y-20">
              {t.categories.map((category) => (
                <div key={category.id} id={category.id} className="scroll-mt-24">
                  <div className="mb-8">
                    <div className="text-xs uppercase tracking-[0.35em] text-ash mb-3">Категорія</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-snow mb-3">{category.title}</h2>
                    <div className="h-1 w-24 bg-gold rounded-full"></div>
                  </div>
                  
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <details 
                        key={item.id} 
                        className="group bg-[radial-gradient(circle_at_top,rgba(201,178,124,0.06),transparent_55%)] border border-hairline rounded-3xl overflow-hidden hover:border-gold/50 transition-all shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
                      >
                        <summary className="cursor-pointer px-6 py-6 flex items-center justify-between gap-4 list-none">
                          <div className="flex-1">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-ash mb-2">Матеріал</div>
                            <h3 className="text-lg font-bold text-snow group-hover:text-gold transition-colors mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-cloud">{item.description}</p>
                          </div>
                          <svg 
                            className="w-6 h-6 text-gold flex-shrink-0 transform group-open:rotate-180 transition-transform" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        
                        <div className="px-6 pb-6 pt-2 border-t border-hairline/50 bg-ink/20">
                          <div className="grid gap-6 md:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-6">
                              {item.brief && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">Коротко</h4>
                                  </div>
                                  <p className="text-sm text-cloud leading-relaxed">{item.brief}</p>
                                </div>
                              )}
                              
                              {item.steps.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">Покроково</h4>
                                  </div>
                                  <ol className="space-y-2">
                                    {item.steps.map((step, i) => (
                                      <li key={i} className="flex gap-3 text-sm text-cloud">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
                                          {i + 1}
                                        </span>
                                        <span className="pt-0.5">{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}
                              
                              {item.docs.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">Документи</h4>
                                  </div>
                                  <ul className="space-y-2">
                                    {item.docs.map((doc, i) => (
                                      <li key={i} className="flex gap-2 text-sm text-cloud">
                                        <span className="text-gold mt-1">•</span>
                                        <span>{doc}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            
                            {/* Right Column */}
                            <div className="space-y-6">
                              {item.contacts.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">Куди звернутись</h4>
                                  </div>
                                  <ul className="space-y-2">
                                    {item.contacts.map((contact, i) => (
                                      <li key={i} className="flex gap-2 text-sm text-cloud">
                                        <span className="text-gold mt-1">→</span>
                                        <span>{contact}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {item.sources.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">Джерела</h4>
                                  </div>
                                  <ul className="space-y-2">
                                    {item.sources.map((source, i) => (
                                      <li key={i} className="text-sm text-cloud/80 hover:text-cloud transition-colors">
                                        <span className="text-gold mr-2">🔗</span>
                                        {source}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {item.mistakes && item.mistakes.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                    </div>
                                    <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Часті помилки</h4>
                                  </div>
                                  <ul className="space-y-2">
                                    {item.mistakes.map((mistake, i) => (
                                      <li key={i} className="flex gap-2 text-sm text-cloud">
                                        <span className="text-red-400 mt-1">✕</span>
                                        <span>{mistake}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Tags */}
                          {item.tags.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-hairline/50">
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <span key={tag} className="px-3 py-1 rounded-full text-xs bg-ink border border-hairline text-cloud">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
        
        <Footer />
      </main>
    </>
  );
}
