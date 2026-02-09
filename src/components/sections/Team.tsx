import Container from "@/shared/ui/Container";
import { Link } from "react-router-dom";
import { team } from "@/content/site";
import { withBase } from "@/shared/lib/paths";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";
import { useEffect, useMemo, useState } from "react";

type Person = {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio: string;
};

const SCROLL_KEY = "lt-scroll-y";
const RESTORE_KEY = "lt-scroll-restore";

function rememberScroll() {
  const y = window.scrollY;
  sessionStorage.setItem(SCROLL_KEY, String(y));
  sessionStorage.setItem(RESTORE_KEY, "1");
}

function PersonCard({ person }: { person: Person }) {
  return (
    <Link
      to={`/team/${person.id}`}
      onClick={rememberScroll}
      className="rounded-3xl border border-hairline bg-panel p-5 sm:p-6 md:p-8 card-gold transition-colors text-center hover:border-gold/50 hover:shadow-lg"
    >
      <div className="mx-auto h-56 w-56 sm:h-48 sm:w-48 md:h-32 md:w-32 rounded-full border border-hairline bg-white/5 overflow-hidden block">
        <img src={withBase(person.photo)} alt={person.name} className="h-full w-full object-cover hover:scale-110 transition" loading="lazy" />
      </div>
      <div className="mt-5 sm:mt-4 text-[16px] sm:text-[15px] md:text-sm font-semibold">{person.name}</div>
      <div className="mt-2 sm:mt-1 text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash">{person.role}</div>
    </Link>
  );
}

export default function Team() {
  const { locale } = useLocale();
  const activeId = useActiveSectionId();
  const [remotePeople, setRemotePeople] = useState<Person[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/content/team.php")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.items)) return;
        setRemotePeople(data.items as Person[]);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  const t = team[locale];
  const people = useMemo<Person[]>(() => (remotePeople ?? (t.people as Person[])), [remotePeople, t.people]);

  return (
    <section id="team" className="py-10 sm:py-12 md:py-14">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
          <div>
            <div
              className={
                activeId === "team"
                  ? "text-[11px] sm:text-[12px] uppercase tracking-luxe text-red-400 underline decoration-red-400/80 underline-offset-4"
                  : "text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash"
              }
              data-active-anchor
            >
              {t.title}
            </div>
            <h2 className="mt-3 sm:mt-4 text-[28px] sm:text-2xl md:text-3xl font-semibold tracking-[-0.01em] leading-tight">
              {t.subtitle}
            </h2>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
