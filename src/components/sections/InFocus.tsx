import Container from "@/shared/ui/Container";
import Modal from "@/shared/ui/Modal";
import { events, type Locale } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useEffect, useMemo, useRef, useState } from "react";

type EventItem = {
  id: number;
  title: string;
  date: string;
  folder: string;
  cover: string;
  photos: number;
  description: string;
  details: string;
};

type EventsPayload = {
  uk: { title: string; subtitle: string; note: string; items: EventItem[] };
  en: { title: string; subtitle: string; note: string; items: EventItem[] };
};

function buildImages(folder: string, total: number) {
  return Array.from({ length: total }, (_, i) => `/events/${folder}/${i + 1}.webp`);
}

function Card({ e, onOpen }: { e: EventItem; onOpen: (event: EventItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(e)}
      className="group rounded-xl2 border border-hairline bg-panel p-6 md:p-7 card-gold transition-colors text-left"
    >
      <div className="h-36 rounded-xl2 border border-hairline bg-white/5 overflow-hidden">
        <img src={e.cover} alt={e.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">{e.title}</div>
          <div className="mt-2 text-[12px] uppercase tracking-luxe text-ash">{e.date}</div>
          <p className="mt-3 text-sm text-ash leading-relaxed">{e.description}</p>
        </div>
        <div className="text-[12px] uppercase tracking-luxe text-ash shrink-0">
          Фотоальбом: {e.photos}
        </div>
      </div>
    </button>
  );
}

export default function InFocus() {
  const [locale, setLocale] = useState<Locale>("uk");
  const [active, setActive] = useState<EventItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showArchive, setShowArchive] = useState(false);
  const [eventsData, setEventsData] = useState<EventsPayload | null>(null);
  const activeId = useActiveSectionId();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "uk" || saved === "en") setLocale(saved);
  }, []);
  useEffect(() => {
    let isMounted = true;
    fetch("/events/events.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        setEventsData(data as EventsPayload);
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, []);
  const t = (eventsData?.[locale] ?? events[locale]) as EventsPayload["uk"];
  const items = useMemo(() => t.items as EventItem[], [t.items]);
  const recentItems = items.slice(0, 3);
  const archiveItems = items.slice(3);
  const galleryImages = active ? buildImages(active.folder, active.photos) : [];
  const hasGallery = galleryImages.length > 0;
  const goPrev = () => {
    if (!hasGallery) return;
    const nextIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIndex);
    setActiveImage(galleryImages[nextIndex]);
  };
  const goNext = () => {
    if (!hasGallery) return;
    const nextIndex = (activeIndex + 1) % galleryImages.length;
    setActiveIndex(nextIndex);
    setActiveImage(galleryImages[nextIndex]);
  };
  return (
    <section id="events" className="py-14">
      <div id="focus" aria-hidden="true" className="sr-only" />
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div
              className={
                activeId === "events"
                  ? "text-[12px] uppercase tracking-luxe text-red-400 underline decoration-red-400/80 underline-offset-4"
                  : "text-[12px] uppercase tracking-luxe text-ash"
              }
              data-active-anchor
            >
              {t.title}
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.01em]">
              {t.subtitle}
            </h2>
            <p className="mt-4 text-ash leading-relaxed max-w-[72ch]">
              {t.note}
            </p>
          </div>
          {archiveItems.length > 0 && (
            <button
              type="button"
              onClick={() => setShowArchive((prev) => !prev)}
              className="hidden md:inline-flex text-[12px] uppercase tracking-luxe text-ash hover:text-paper transition-colors"
            >
              {showArchive ? "Приховати архів" : "Архів подій"} →
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {recentItems.map((e) => (
            <Card key={e.id} e={e} onOpen={setActive} />
          ))}
        </div>

        {showArchive && archiveItems.length > 0 && (
          <div className="mt-8">
            <div className="text-[12px] uppercase tracking-luxe text-ash">Архів</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {archiveItems.map((e) => (
                <Card key={e.id} e={e} onOpen={setActive} />
              ))}
            </div>
          </div>
        )}

        <Modal
          open={!!active}
          onClose={() => {
            setActive(null);
            setActiveImage(null);
            setActiveIndex(0);
          }}
          title={active?.title}
          surfaceClassName="rounded-2xl border border-hairline bg-[#0B0C0E] shadow-2xl"
        >
          {active && (
            <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain touch-pan-y hide-scrollbar">
              <div className="p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[12px] uppercase tracking-luxe text-ash">{t.title}</div>
                    <div className="mt-2 text-xl md:text-2xl font-semibold">{active.title}</div>
                    <div className="mt-1 text-sm text-ash uppercase tracking-luxe">{active.date}</div>
                  </div>
                  <button
                    className="rounded-full px-3 py-1 text-ash hover:text-paper transition-colors"
                    onClick={() => setActive(null)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-5">
                  <div className="rounded-xl2 border border-hairline bg-white/5 overflow-hidden">
                    <img src={active.cover} alt={active.title} className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                  <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-paper/90 whitespace-pre-line">
                    {active.details}
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryImages.map((src, idx) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => {
                          setActiveImage(src);
                          setActiveIndex(idx);
                        }}
                        className="rounded-xl2 border border-hairline bg-white/5 overflow-hidden text-left"
                      >
                        <img src={src} alt={active.title} className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {activeImage && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black p-4"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              if (!touch) return;
              touchStartX.current = touch.clientX;
              touchStartY.current = touch.clientY;
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              if (!touch || touchStartX.current === null || touchStartY.current === null) return;
              const dx = touch.clientX - touchStartX.current;
              const dy = touch.clientY - touchStartY.current;
              touchStartX.current = null;
              touchStartY.current = null;
              if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
              if (dx < 0) goNext();
              else goPrev();
            }}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-hairline px-3 py-1 text-sm text-ash hover:text-paper transition-colors"
              onClick={() => setActiveImage(null)}
            >
              Закрити
            </button>
            <button
              type="button"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-hairline px-3 py-2 text-sm text-ash hover:text-paper transition-colors"
              onClick={goPrev}
              aria-label="Попереднє фото"
            >
              ←
            </button>
            <img
              src={activeImage}
              alt={active?.title}
              className="max-h-[90vh] w-auto max-w-[92vw] object-contain"
            />
            <button
              type="button"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-hairline px-3 py-2 text-sm text-ash hover:text-paper transition-colors"
              onClick={goNext}
              aria-label="Наступне фото"
            >
              →
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
