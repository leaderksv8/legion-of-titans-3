import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Container from "@/shared/ui/Container";

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

let scrollLockCount = 0;
let prevOverflow = "";

function lockBodyScroll() {
  scrollLockCount += 1;
  if (scrollLockCount !== 1) return;
  const body = document.body;
  prevOverflow = body.style.overflow;
  body.style.overflow = "hidden";
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount !== 0) return;
  const body = document.body;
  body.style.overflow = prevOverflow;
}

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const [eventsData, setEventsData] = useState<EventsPayload | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [locale, setLocale] = useState<"uk" | "en">("uk");
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Скролимо до верху при завантаженні сторінки (smooth на мобільних)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    window.scrollTo({ top: 0, behavior: isMobile ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as "uk" | "en" | null;
    if (saved === "uk" || saved === "en") setLocale(saved);
  }, []);

  // Блокуємо скрол коли fullscreen фото відкрите
  useEffect(() => {
    if (activeImage) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => unlockBodyScroll();
  }, [activeImage]);

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

  if (!eventsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-ash">Завантаження...</div>
      </div>
    );
  }

  const items = eventsData[locale]?.items || [];
  const event = items.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-ash mb-4">Подія не знайдена</div>
          <button
            onClick={() => navigate("/")}
            className="text-gold hover:text-gold/80 transition"
          >
            Повернутися на головну
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = buildImages(event.folder, event.photos);
  const goNext = () => {
    const nextIndex = (activeIndex + 1) % galleryImages.length;
    setActiveIndex(nextIndex);
    setActiveImage(galleryImages[nextIndex]);
  };
  const goPrev = () => {
    const nextIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIndex);
    setActiveImage(galleryImages[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-black py-8 md:py-16">
      <Container>
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 text-gold hover:text-gold/80 transition text-sm uppercase tracking-luxe"
        >
          ← Назад
        </button>

        {/* Event Header */}
        <div className="mb-12">
          <div className="text-[10px] sm:text-[12px] uppercase tracking-luxe text-ash mb-3">{eventsData[locale]?.title}</div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-2">{event.title}</h1>
          <div className="text-xs sm:text-sm text-ash uppercase tracking-luxe">{event.date}</div>
        </div>

        {/* Main image */}
        <div className="mb-8 rounded-2xl border border-hairline bg-white/5 overflow-hidden">
          <img src={event.cover} alt={event.title} className="w-full h-auto object-cover max-h-96" />
        </div>

        {/* Description */}
        <div className="mb-12 prose prose-invert max-w-none">
          <p className="text-sm md:text-[15px] leading-relaxed text-paper/90 whitespace-pre-line">
            {event.details}
          </p>
        </div>

        {/* Gallery grid */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">{locale === "uk" ? "Фотоальбом" : "Photo Album"}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((src, idx) => (
              <button
                key={src}
                onClick={() => {
                  setActiveImage(src);
                  setActiveIndex(idx);
                }}
                className="rounded-xl2 border border-hairline bg-white/5 overflow-hidden hover:border-gold/50 transition group"
              >
                <img
                  src={src}
                  alt={`${event.title} ${idx + 1}`}
                  className="h-48 w-full object-cover group-hover:scale-105 transition"
                />
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* Fullscreen photo viewer */}
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
            alt={event.title}
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
          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-sm text-ash">
            {activeIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
