import Container from "@/shared/ui/Container";
import Modal from "@/shared/ui/Modal";
import { team } from "@/content/site";
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

function PersonCard({
  person,
  onOpen,
}: {
  person: Person;
  onOpen: (p: Person) => void;
}) {
  return (
    <div className="rounded-3xl border border-hairline bg-panel p-10 md:p-8 card-gold transition-colors text-center">
      <button
        type="button"
        onClick={() => onOpen(person)}
        className="mx-auto h-44 w-44 md:h-32 md:w-32 rounded-full border border-hairline bg-white/5 overflow-hidden block"
        aria-label={`Відкрити профіль ${person.name}`}
      >
        <img src={person.photo} alt={person.name} className="h-full w-full object-cover" loading="lazy" />
      </button>
      <div className="mt-5 text-sm font-semibold">{person.name}</div>
      <div className="mt-1 text-[12px] uppercase tracking-luxe text-ash">{person.role}</div>
    </div>
  );
}

export default function Team() {
  const { locale } = useLocale();
  const activeId = useActiveSectionId();
  const [active, setActive] = useState<Person | null>(null);
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
    <section id="team" className="py-14">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div
              className={
                activeId === "team"
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
          </div>
        </div>

        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {people.slice(0, 4).map((p) => (
            <PersonCard key={p.id} person={p} onOpen={setActive} />
          ))}
        </div>

        <Modal
          open={!!active}
          onClose={() => setActive(null)}
          title={active?.name}
          containerClassName="items-center"
          surfaceClassName="rounded-2xl border border-hairline bg-[#0B0C0E] shadow-2xl"
        >
          {active && (
            <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain touch-pan-y hide-scrollbar">
              <div className="p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full border border-hairline bg-white/5 overflow-hidden">
                      <img src={active.photo} alt={active.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <div className="text-[12px] uppercase tracking-luxe text-ash">{t.title}</div>
                      <div className="mt-2 text-xl md:text-2xl font-semibold">{active.name}</div>
                      <div className="mt-1 text-sm text-ash uppercase tracking-luxe">{active.role}</div>
                    </div>
                  </div>
                  <button className="rounded-full px-3 py-1 text-ash hover:text-paper transition-colors" onClick={() => setActive(null)} type="button">
                    ✕
                  </button>
                </div>

                <div className="mt-5">
                  <p className="text-sm md:text-[15px] leading-relaxed text-paper/90 whitespace-pre-line">
                    {active.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </section>
  );
}
