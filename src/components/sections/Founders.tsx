import Container from "@/shared/ui/Container";
import { Link } from "react-router-dom";
import { founders } from "@/content/site";
import { withBase } from "@/shared/lib/paths";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";
import { useMemo } from "react";
import { motion } from "framer-motion";

type Founder = {
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

/** Преміальна карта засновника - містить фото + інформацію */
function FounderCard({
  person,
  index = 0,
}: {
  person: Founder;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link
        to={`/founders/${person.id}`}
        onClick={rememberScroll}
        className="flex flex-col gap-4 cursor-pointer"
        aria-label={`Історія ${person.name}`}
      >
        {/* КАРТА - преміально виділена */}
        <div className="founder-card group">
          <div className="founder-photo">
            <img 
              src={withBase(person.photo)} 
              alt={person.name} 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
          </div>
        </div>

        {/* ІНФОРМАЦІЯ - ОКРЕМО, ЧІТКА, БЕЗ НАСЛІДЖЕННЯ */}
        <div className="px-2">
          <h3 className="text-base md:text-lg font-bold text-white">
            {person.name}
          </h3>
          <p className="text-xs md:text-sm uppercase tracking-wider text-gold/80 mt-2">
            {person.role}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Founders() {
  const { locale } = useLocale();
  const activeId = useActiveSectionId();
  const t = founders[locale];
  const people = useMemo<Founder[]>(() => t.people as Founder[], [t.people]);

  return (
    <section id="founders" className="py-12 sm:py-14 md:py-16 lg:py-20">
      <Container>
        {/* Заголовок секції - ЧІТКИЙ, БЕЗ НАСЛІДЕННЯ */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div
            className={
              activeId === "founders"
                ? "text-[11px] sm:text-[12px] uppercase tracking-luxe text-red-400 underline decoration-red-400/80 underline-offset-4"
                : "text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash"
            }
            data-active-anchor
          >
            {t.title}
          </div>
          <h2 className="mt-4 sm:mt-5 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            {t.subtitle}
          </h2>
        </div>

        {/* Сітка карток - АДАПТИВНА ДЛЯ МОБІЛЬНИХ */}
        <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {people.map((person, idx) => (
            <FounderCard key={person.id} person={person} index={idx} />
          ))}
        </div>

        {/* Інформаційна підпис - КОРОТКА, ЧИТАБЕЛЬНА */}
        <div className="mt-12 sm:mt-14 text-xs sm:text-sm text-ash/70 max-w-3xl">
          Натисніть на карту засновника щоб дізнатися його історію
        </div>
      </Container>
    </section>
  );
}
