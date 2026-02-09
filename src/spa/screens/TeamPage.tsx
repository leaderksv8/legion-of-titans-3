import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@/shared/ui/Container";
import { team } from "@/content/site";
import { useLocale } from "@/shared/lib/localeContext";

type Person = {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio: string;
};

export default function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const { locale } = useLocale();
  const [person, setPerson] = useState<Person | null>(null);
  const [remotePeople, setRemotePeople] = useState<Person[] | null>(null);

  // Скролимо до верху при завантаженні сторінки (smooth на мобільних)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    window.scrollTo({ top: 0, behavior: isMobile ? "smooth" : "auto" });
  }, []);

  // Завантажуємо дані команди
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

  // Шукаємо людину за ID
  useEffect(() => {
    const t = team[locale];
    const allPeople = remotePeople ?? (t.people as Person[]);
    const found = allPeople.find((p) => p.id === Number(id));
    setPerson(found || null);
  }, [id, locale, remotePeople]);

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center px-4">
          <div className="text-ash mb-4">Члена команди не знайдено</div>
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

  const t = team[locale];

  return (
    <div className="min-h-screen bg-black py-8 md:py-16">
      <Container>
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 text-gold hover:text-gold/80 transition text-xs sm:text-sm uppercase tracking-luxe"
        >
          ← Назад
        </button>

        {/* Profile layout - адаптована для мобільних */}
        <div className="grid gap-6 sm:gap-8 md:gap-12 lg:grid-cols-3">
          {/* Photo */}
          <div className="lg:col-span-1 flex items-start justify-center">
            <div className="w-full max-w-xs">
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-auto object-cover rounded-2xl border border-hairline"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="text-[10px] sm:text-[12px] uppercase tracking-luxe text-ash mb-3 sm:mb-4">
              {t.title}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-2">
              {person.name}
            </h1>
            <div className="text-base sm:text-lg text-gold uppercase tracking-luxe mb-6 sm:mb-8">
              {person.role}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-paper/90 whitespace-pre-line">
                {person.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Back button at bottom */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-gold hover:text-gold/80 transition text-xs sm:text-sm uppercase tracking-luxe"
          >
            ← Назад
          </button>
        </div>
      </Container>
    </div>
  );
}
