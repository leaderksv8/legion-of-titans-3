import Container from "@/shared/ui/Container";
import Divider from "@/shared/ui/Divider";
import Modal from "@/shared/ui/Modal";
import { heroes } from "@/content/site";
import { useActiveSectionId } from "@/shared/lib/activeSectionContext";
import { useLocale } from "@/shared/lib/localeContext";
import { useEffect, useMemo, useState } from "react";

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

export default function Heroes() {
  const { locale } = useLocale();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const activeId = useActiveSectionId();

  // submit modal
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string>("");

  const t = heroes[locale];

  async function loadFallbackFromStatic(limit: number) {
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
      .slice(0, limit)
      .map((x: any) => ({
        id: Number(x.id),
        type: "thanks" as const,
        name: x?.name ?? null,
        message: String(x?.message ?? ""),
        created_at: String(x?.created_at ?? ""),
        published_at: x?.published_at ? String(x.published_at) : null,
      }));
    setItems(items);
  }

  async function load() {
    setLoading(true);
    setErrorText("");
    try {
      const r = await fetch(`/api/public?type=thanks&limit=3`, { cache: "no-store" });
      const j = await r.json();
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch {
      try {
        await loadFallbackFromStatic(3);
      } catch {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          turnstileToken: "", // optional; will be wired when we add Turnstile widget
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
      // do not auto-close: show confirmation
      await load();
    } catch (e: any) {
      setStatus("error");
      const code = String(e?.message || "");
      setErrorText(
        code === "NO_CONSENT"
          ? t.modal.noConsent
          : code === "TOO_SHORT"
          ? t.modal.tooShort
          : code === "RATE_LIMIT"
          ? t.modal.rateLimit
          : t.modal.error
      );
    }
  }

  return (
    <section id="heroes" className="py-14">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <div
              className={
                activeId === "heroes"
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

          <div className="flex items-center gap-3">
            <a
              className="hidden md:inline-flex text-[12px] uppercase tracking-luxe text-ash hover:text-paper transition-colors"
              href="/thanks"
            >
              {t.archiveLabel}
            </a>
            <button
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-[12px] uppercase tracking-luxe border border-hairline bg-black/20 hover:bg-white/5 hover:text-gold transition-colors"
              onClick={() => {
                setOpen(true);
                setStatus("idle");
                setErrorText("");
              }}
              type="button"
            >
              {locale === "uk" ? "Надіслати подяку" : "Send thanks"}
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-xl2 border border-hairline overflow-hidden bg-panel">
          {loading ? (
            <div className="p-8 text-ash">{locale === "uk" ? "Завантаження…" : "Loading…"}</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-ash">
              {locale === "uk" 
                ? "Поки що немає опублікованих матеріалів. Ви можете надіслати подяку — після модерації вона з'явиться тут."
                : "No published materials yet. You can send thanks — after moderation it will appear here."}
            </div>
          ) : (
            items.map((s, idx) => (
              <div key={s.id}>
                <div className="p-6 md:p-8 grid gap-5 md:grid-cols-12">
                                    <div className="md:col-span-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-black/30 px-3 py-1 text-[11px] uppercase tracking-luxe text-ash">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/70" aria-hidden="true" />
                      {formatDate(s.published_at ?? s.created_at)}
                    </div>
                  </div>
                  <div className="md:col-span-9 min-w-0">
                    <div className="text-lg md:text-xl font-semibold tracking-tight leading-snug break-words">
                      {s.name ? s.name : "Анонімна подяка"}
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

        {/* Modal */}
        <Modal
          open={open}
          title={locale === "uk" ? "Надіслати подяку" : "Send thanks"}
          onClose={() => setOpen(false)}
        >
          <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain touch-pan-y hide-scrollbar">
            <div className="p-6 md:p-7 relative">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[12px] uppercase tracking-luxe text-ash">{locale === "uk" ? "Надсилання" : "Submission"}</div>
                    <div className="mt-2 text-xl font-semibold">
                      {locale === "uk" ? "Надіслати подяку" : "Send thanks"}
                    </div>
                  </div>
                  <button
                    className="rounded-full px-3 py-1 text-ash hover:text-paper transition-colors"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-[12px] uppercase tracking-luxe text-ash">
                      {t.modal.nameLabel}
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                      placeholder={t.modal.namePlaceholder}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-[12px] uppercase tracking-luxe text-ash">
                      {t.modal.emailLabel}
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
                      placeholder="name@example.com"
                      inputMode="email"
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

                  <div className="grid gap-2">
                    <label className="text-[12px] uppercase tracking-luxe text-ash">
                      {t.modal.messageLabel}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[140px] rounded-xl border border-hairline bg-black/20 px-4 py-3 text-paper outline-none focus:border-gold/60 resize-y"
                      placeholder={t.modal.messagePlaceholder}
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-ash leading-relaxed">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[rgba(201,178,124,0.9)]"
                    />
                    <span>
                      {t.modal.consentText}
                    </span>
                  </label>

                  {status === "sent" ? (
                    <div className="rounded-xl border border-hairline bg-black/20 p-4 text-paper">
                      {t.modal.sent}
                    </div>
                  ) : (
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        className="h-11 rounded-xl border border-hairline bg-black/20 px-5 text-[12px] uppercase tracking-luxe text-paper hover:bg-white/5 transition-colors"
                        onClick={() => setOpen(false)}
                        type="button"
                      >
                        {t.modal.cancel}
                      </button>
                      <button
                        className="h-11 rounded-xl px-5 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
                        onClick={submit}
                        disabled={status === "sending"}
                        type="button"
                      >
                        {status === "sending" ? t.modal.sending : t.modal.send}
                      </button>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="text-sm text-ash">{errorText}</div>
                  )}

                  <div className="text-[12px] text-ash">
                    {t.modal.footerNote}
                  </div>
                </div>
            </div>
          </div>
        </Modal>
      </Container>
    </section>
  );
}
