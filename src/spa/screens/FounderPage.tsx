import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@/shared/ui/Container";
import { founders } from "@/content/site";
import { useLocale } from "@/shared/lib/localeContext";
import { withBase } from "@/shared/lib/paths";
import { motion } from "framer-motion";

type Founder = {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio: string;
};

export default function FounderPage() {
  const { id } = useParams<{ id: string }>();
  const { locale } = useLocale();
  const [founder, setFounder] = useState<Founder | null>(null);
  const [allFounders, setAllFounders] = useState<Founder[]>([]);

  // Скролимо до верху при завантаженні сторінки (smooth на мобільних)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    window.scrollTo({ top: 0, behavior: isMobile ? "smooth" : "auto" });
  }, []);

  // Завантажуємо дані засновника
  useEffect(() => {
    const t = founders[locale];
    const people = t.people as Founder[];
    setAllFounders(people);
    const found = people.find((p) => p.id === Number(id));
    setFounder(found || null);
  }, [id, locale]);

  if (!founder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center px-4">
          <p className="text-ash mb-6">Засновника не знайдено</p>
          <button
            onClick={() => window.history.back()}
            className="text-gold hover:text-gold/80 transition text-sm uppercase tracking-luxe"
          >
            ← Назад
          </button>
        </div>
      </div>
    );
  }

  const t = founders[locale];
  const currentIndex = allFounders.findIndex((p) => p.id === founder.id);

  return (
    <div className="min-h-screen bg-black">
      {/* === ПОРТАЛЬНА СТОРІНКА - АЛЕЯ СЛАВИ === */}
      
      {/* ГЕРОЙ - Прослідок з фото засновника */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,178,124,0.08),transparent_55%)]"
          aria-hidden="true"
        />

        {/* КОНТЕНТ - портальна енергія */}
        <Container>
          <div className="relative py-10 sm:py-14 md:py-16 lg:py-20 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-gold/20 bg-ink/60 p-3 sm:p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-hairline">
                  <img
                    src={withBase(founder.photo)}
                    alt={founder.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-ash text-center">
                  Портрет засновника
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              {/* Кнопка назад - адаптована для мобільних */}
              <button
                onClick={() => window.history.back()}
                className="mb-4 sm:mb-8 text-gold hover:text-gold/80 transition text-xs sm:text-sm uppercase tracking-luxe flex items-center gap-2"
              >
                ← Назад
              </button>

              {/* título - АЛЕЯ СЛАВИ */}
              <div className="mb-3 sm:mb-6">
                <div className="text-[10px] sm:text-[12px] uppercase tracking-[0.2em] text-gold/60 mb-2">
                  ◆ АЛЕЯ СЛАВИ ◆
                </div>
                <div className="h-1 w-12 bg-gradient-to-r from-gold to-transparent" />
              </div>

              {/* ім'я - адаптовано для мобільних */}
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-2 sm:mb-4 break-words">
                {founder.name}
              </h1>

              {/* посадовість - ужиті та адаптовані */}
              <div className="text-sm sm:text-xl md:text-2xl text-gold uppercase tracking-wider mb-3 sm:mb-4">
                {founder.role}
              </div>

              {/* Номер засновника */}
              <div className="text-xs sm:text-sm text-gold/50 uppercase tracking-[0.15em] mb-4 sm:mb-8 pb-4 sm:pb-8 border-b border-gold/30">
                Засновник #{currentIndex + 1} з {allFounders.length}
              </div>

              {/* Біографія - адаптована для мобільних */}
              <div className="max-w-2xl">
                <p className="text-xs sm:text-base md:text-lg leading-relaxed text-paper/90 whitespace-pre-wrap break-words text-justify sm:text-left">
                  {founder.bio}
                </p>
              </div>

              {/* Промо текст */}
              <div className="mt-6 sm:mt-12 pt-4 sm:pt-8 border-t border-gold/20">
                <p className="text-xs sm:text-sm text-gold/60 uppercase tracking-wide">
                  Дізнайтеся більше про "Легіон Титанів"
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </motion.div>

      {/* === ПОВЕРНЕННЯ На головну === */}
      <div className="py-8 sm:py-12 text-center border-t border-gold/20 px-4">
        <button
          onClick={() => window.history.back()}
          className="text-gold hover:text-gold/80 transition text-xs sm:text-sm uppercase tracking-luxe"
        >
          ← Назад
        </button>
      </div>
    </div>
  );
}
