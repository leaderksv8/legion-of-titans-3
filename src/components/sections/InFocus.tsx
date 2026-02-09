import Container from "@/shared/ui/Container";
import { Link } from "react-router-dom";
import { events, infocus } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";
import { useEffect, useMemo, useState } from "react";

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

const SCROLL_KEY = "lt-scroll-y";
const RESTORE_KEY = "lt-scroll-restore";

function rememberScroll() {
  const y = window.scrollY;
  sessionStorage.setItem(SCROLL_KEY, String(y));
  sessionStorage.setItem(RESTORE_KEY, "1");
}

function buildImages(folder: string, total: number) {
  return Array.from({ length: total }, (_, i) => `/events/${folder}/${i + 1}.webp`);
}

function Card({ e }: { e: EventItem }) {
  return (
    <Link
      to={`/events/${e.id}`}
      onClick={rememberScroll}
      className="group rounded-xl2 border border-hairline bg-panel p-6 md:p-7 card-gold transition-colors text-left hover:border-gold/50"
    >
      <div className="h-36 rounded-xl2 border border-hairline bg-white/5 overflow-hidden">
        <img src={e.cover} alt={e.title} className="h-full w-full object-cover group-hover:scale-105 transition" loading="lazy" />
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
    </Link>
  );
}

export default function InFocus() {
  const { locale } = useLocale();
  const [showArchive, setShowArchive] = useState(false);
  const [eventsData, setEventsData] = useState<EventsPayload | null>(null);
  const activeId = useActiveSectionId();
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
  const inFocusT = infocus[locale];
  const t = (eventsData?.[locale] ?? events[locale]) as EventsPayload["uk"];
  const items = useMemo(() => t.items as EventItem[], [t.items]);
  const recentItems = items.slice(0, 3);
  const archiveItems = items.slice(3);
  return (
    <section id="events" className="py-14">
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
              {inFocusT.title}
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.01em]">
              {inFocusT.subtitle}
            </h2>
            <p className="mt-4 text-ash leading-relaxed max-w-[72ch]">
              {inFocusT.note}
            </p>
          </div>
          {archiveItems.length > 0 && (
            <button
              type="button"
              onClick={() => setShowArchive((prev) => !prev)}
              className="hidden md:inline-flex text-[12px] uppercase tracking-luxe text-ash hover:text-paper transition-colors"
            >
              {showArchive ? inFocusT.hideArchiveLabel : inFocusT.archiveLabel} →
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {recentItems.map((e) => (
            <Card key={e.id} e={e} />
          ))}
        </div>

        {showArchive && archiveItems.length > 0 && (
          <div className="mt-8">
            <div className="text-[12px] uppercase tracking-luxe text-ash">Архів</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {archiveItems.map((e) => (
                <Card key={e.id} e={e} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

