import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigationType } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import SEOHead from "@/features/seo/SEOHead";
import Header from "@/features/header/Header";
import Footer from "@/features/footer/Footer";
import Container from "@/shared/ui/Container";
import Divider from "@/shared/ui/Divider";
import { useLocale } from "@/shared/lib/localeContext";
import { heroes } from "@/content/site";

const SCROLL_KEY = "lt-scroll-y";
const RESTORE_KEY = "lt-scroll-restore";

type Item = {
  id: number;
  type: "thanks";
  name: string | null;
  message: string;
  published_at: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  try {
    const safe = iso.includes(" ") && !iso.includes("T") ? iso.replace(" ", "T") : iso;
    const d = new Date(safe);
    return d.toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "2-digit" });
  } catch {
    return "";
  }
}

export default function ThanksPage() {
  const { locale } = useLocale();
  const navigationType = useNavigationType();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string>("");

  const t = heroes[locale];

  // Scroll restoration ПЕРЕД рендеру (useLayoutEffect)
  useLayoutEffect(() => {
    if (navigationType === "POP") {
      const savedY = sessionStorage.getItem(SCROLL_KEY);
      const shouldRestore = sessionStorage.getItem(RESTORE_KEY) === "1";

      if (shouldRestore && savedY) {
        const y = Number(savedY);
        if (Number.isFinite(y) && y > 0) {
          window.scrollTo(0, y);
          sessionStorage.removeItem(SCROLL_KEY);
          sessionStorage.removeItem(RESTORE_KEY);
          return;
        }
      }
    }
  }, [navigationType]);

  // Скролимо до верху при завантаженні (якщо не POP)
  useEffect(() => {
    if (navigationType !== "POP") {
      const isMobile = window.innerWidth < 768;
      window.scrollTo({ top: 0, behavior: isMobile ? "smooth" : "auto" });
    }
  }, [navigationType]);

  // Load published thanks
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/public?type=thanks&limit=100`, { cache: "no-store" });
        const j = await r.json().catch(() => ({}));
        setItems(Array.isArray(j?.items) ? j.items : []);
      } catch {
        try {
          const r = await fetch(`/api/_data/submissions.json`, { cache: "no-store" });
          const j = await r.json().catch(() => ({}));
          const list = Array.isArray(j?.submissions) ? j.submissions : [];
          const items = list
            .filter((x: any) => x?.type === "thanks" && x?.status === "APPROVED")
            .sort((a: any, b: any) => {
              const ad = String(a?.published_at ?? a?.created_at ?? "");
              const bd = String(b?.published_at ?? b?.created_at ?? "");
              return bd.localeCompare(ad);
            })
            .slice(0, 100)
            .map((x: any) => ({
              id: Number(x.id),
              type: "thanks" as const,
              name: x?.name ?? null,
              message: String(x?.message ?? ""),
              created_at: String(x?.created_at ?? ""),
              published_at: x?.published_at ? String(x.published_at) : null,
            }));
          setItems(items);
        } catch {
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Submit thanks form
  async function submit() {
    setStatus("sending");
    setErrorText("");
    try {
      const r = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "thanks",
          name,
          email,
          message,
          consent,
          hp, // honeypot
          turnstileToken: "",
        }),
      });

      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        const code = j?.error || "UNKNOWN";
        throw new Error(code);
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setConsent(false);
      setHp("");

      toast.success("✓ " + t.modal.sent);
      
      // Reload thanks list
      const reloadR = await fetch(`/api/public?type=thanks&limit=100`, { cache: "no-store" });
      const reloadJ = await reloadR.json().catch(() => ({}));
      setItems(Array.isArray(reloadJ?.items) ? reloadJ.items : []);

      // Reset form after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (e: any) {
      setStatus("error");
      const code = String(e?.message || "");
      const errorMsg =
        code === "NO_CONSENT"
          ? t.modal.noConsent
          : code === "TOO_SHORT"
          ? t.modal.tooShort
          : code === "RATE_LIMIT"
          ? t.modal.rateLimit
          : t.modal.error;

      setErrorText(errorMsg);
      toast.error(errorMsg);
    }
  }

  return (
    <>
      <SEOHead />

      <main className="grain min-h-screen">
        <Header />
        <section className="py-12 sm:py-14 md:py-16">
          <Container>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-12 sm:mb-14">
              <div>
                <div className="text-[12px] uppercase tracking-luxe text-ash">Подяки</div>
                <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-[-0.02em]">
                  {locale === "uk" ? "Надіслати подяку" : "Send thanks"}
                </h1>
                <div className="mt-2 text-ash text-sm">
                  {locale === "uk"
                    ? "Поділіться своєю подякою до організації"
                    : "Share your gratitude with our organization"}
                </div>
              </div>

              <Link
                to="/#heroes"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[12px] tracking-luxe uppercase text-paper/90 hover:border-gold/50 hover:text-paper transition-colors"
                aria-label={locale === "uk" ? "Закрити" : "Close"}
              >
                {locale === "uk" ? "Назад" : "Back"}
              </Link>
            </div>

            {/* Form */}
            <div className="max-w-2xl rounded-xl2 border border-hairline overflow-hidden bg-panel p-6 md:p-8 mb-12 sm:mb-14">
              {status === "sent" ? (
                // Success message
                <div className="py-8 text-center">
                  <div className="text-xl md:text-2xl font-semibold mb-3">
                    {locale === "uk" ? "✓ Подяка відправлена!" : "✓ Thanks sent!"}
                  </div>
                  <p className="text-ash mb-6">
                    {locale === "uk"
                      ? "Дякуємо за вашу подяку. Вона буде модерована і скоро з'явиться в архіві."
                      : "Thank you for your gratitude. It will be moderated and appear in the archive soon."}
                  </p>
                  <button
                    className="inline-flex items-center justify-center rounded-full px-6 py-2 text-[12px] uppercase tracking-luxe border border-gold/50 bg-gold/10 hover:bg-gold/20 transition-colors"
                    onClick={() => setStatus("idle")}
                    type="button"
                  >
                    {locale === "uk" ? "Написати ще" : "Send another"}
                  </button>
                </div>
              ) : (
                // Form
                <div className="grid gap-5">
                  {/* Name */}
                  <div className="grid gap-2">
                    <label className="text-[12px] uppercase tracking-luxe text-ash">
                      {t.modal.nameLabel}
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60 transition-colors"
                      placeholder={t.modal.namePlaceholder}
                      disabled={status === "sending"}
                    />
                  </div>

                  {/* Email */}
                  <div className="grid gap-2">
                    <label className="text-[12px] uppercase tracking-luxe text-ash">
                      {t.modal.emailLabel}
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60 transition-colors"
                      placeholder="name@example.com"
                      inputMode="email"
                      disabled={status === "sending"}
                    />
                  </div>

                  {/* Honeypot (hidden) */}
                  <input
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* Message */}
                  <div className="grid gap-2">
                    <label className="text-[12px] uppercase tracking-luxe text-ash">
                      {t.modal.messageLabel}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[160px] rounded-xl border border-hairline bg-black/20 px-4 py-3 text-paper outline-none focus:border-gold/60 transition-colors resize-none"
                      placeholder={t.modal.messagePlaceholder}
                      disabled={status === "sending"}
                    />
                  </div>

                  {/* Consent */}
                  <label className="flex items-start gap-3 text-sm text-ash leading-relaxed cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-gold cursor-pointer"
                      disabled={status === "sending"}
                    />
                    <span>{t.modal.consentText}</span>
                  </label>

                  {/* Error message */}
                  {status === "error" && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                      {errorText}
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      to="/#heroes"
                      className="inline-flex items-center justify-center h-12 rounded-xl border border-hairline bg-black/20 px-5 text-[12px] uppercase tracking-luxe text-paper hover:bg-white/5 transition-colors"
                    >
                      {locale === "uk" ? "Скасувати" : "Cancel"}
                    </Link>
                    <button
                      className="inline-flex items-center justify-center h-12 rounded-xl px-6 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                      onClick={submit}
                      disabled={status === "sending" || !consent}
                      type="button"
                    >
                      {status === "sending" ? t.modal.sending : t.modal.send}
                    </button>
                  </div>

                  {/* Footer note */}
                  <div className="text-[12px] text-ash leading-relaxed">
                    {t.modal.footerNote}
                  </div>
                </div>
              )}
            </div>

            {/* Archive section */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="text-[12px] uppercase tracking-luxe text-ash mb-3">
                  {locale === "uk" ? "Архів" : "Archive"}
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.01em]">
                  {locale === "uk" ? "Опубліковані подяки" : "Published thanks"}
                </h2>
              </div>

              <div className="rounded-xl2 border border-hairline overflow-hidden bg-panel">
                {loading ? (
                  <div className="p-6 sm:p-8 text-ash text-[14px] sm:text-base">
                    {locale === "uk" ? "Завантаження…" : "Loading…"}
                  </div>
                ) : items.length === 0 ? (
                  <div className="p-6 sm:p-8 text-ash text-[14px] sm:text-base leading-relaxed">
                    {locale === "uk"
                      ? "Поки що немає опублікованих матеріалів. Ви можете надіслати подяку — після модерації вона з'явиться тут."
                      : "No published materials yet. You can send thanks — after moderation it will appear here."}
                  </div>
                ) : (
                  items.map((s, idx) => (
                    <div key={s.id}>
                      <div className="p-5 sm:p-6 md:p-8 grid gap-4 sm:gap-5 md:grid-cols-12">
                        <div className="md:col-span-3">
                          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-black/30 px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-luxe text-ash">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" aria-hidden="true" />
                            {formatDate(s.published_at ?? s.created_at)}
                          </div>
                        </div>
                        <div className="md:col-span-9 min-w-0">
                          <div className="text-[16px] sm:text-lg md:text-xl font-semibold tracking-tight leading-snug break-words">
                            {s.name ? s.name : locale === "uk" ? "Анонімна подяка" : "Anonymous thanks"}
                          </div>
                          <p className="mt-3 text-ash leading-relaxed text-[15px] md:text-[16px] max-w-[78ch] whitespace-pre-line">
                            {s.message}
                          </p>
                        </div>
                      </div>
                      {idx !== items.length - 1 && <Divider />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    </>
  );
}

