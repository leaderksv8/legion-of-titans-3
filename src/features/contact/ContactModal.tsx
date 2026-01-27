import { useMemo, useState } from "react";
import Modal from "@/shared/ui/Modal";
import Container from "@/shared/ui/Container";
import { contact, type Locale } from "@/content/site";

function useLocale(): Locale {
  const raw = window.localStorage.getItem("locale");
  return raw === "en" ? "en" : "uk";
}

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const locale = useMemo(() => (typeof window === "undefined" ? "uk" : useLocale()), [open]);
  const t = contact[locale];

  const labels = useMemo(
    () =>
      locale === "uk"
        ? {
            name: "Імʼя",
            email: "Email",
            subject: "Тема",
            message: "Повідомлення",
            consent:
              "Надсилаючи це повідомлення, ви надаєте згоду на обробку персональних даних, зазначених у повідомленні, виключно з метою зворотного звʼязку.",
            submit: "Надіслати",
            sending: "Відправляємо…",
            sent: "Повідомлення надіслано. Дякуємо!",
            error: "Не вдалося надіслати. Спробуйте ще раз трохи пізніше.",
            title: "Звʼязок з нами",
          }
        : {
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message",
            consent:
              "By sending this message, you consent to the processing of personal data provided in the message solely for the purpose of responding.",
            submit: "Send",
            sending: "Sending…",
            sent: "Message sent. Thank you!",
            error: "Failed to send. Please try again later.",
            title: "Contacts",
          },
    [locale]
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const canSubmit = message.trim().length > 0 && consent && status === "idle";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          hp,
          locale,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || "send_failed");

      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setConsent(false);
      setHp("");
      setTimeout(() => setStatus("idle"), 3500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3500);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={labels.title} surfaceClassName="rounded-2xl border border-hairline bg-[#0B0C0E] shadow-2xl">
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain touch-pan-y hide-scrollbar">
        <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] uppercase tracking-luxe text-ash">{labels.title}</div>
            <div className="mt-2 text-xl md:text-2xl font-semibold">{t.subtitle}</div>
          </div>
          <button className="rounded-full px-3 py-1 text-ash hover:text-paper transition-colors" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="mt-5 rounded-xl2 border border-hairline bg-black/30 p-5 md:p-6">
          <form className="grid gap-4" onSubmit={onSubmit}>
            {/* honeypot */}
            <input tabIndex={-1} autoComplete="off" className="sr-only" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-luxe text-ash">{labels.name}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-full bg-black/35 border border-hairline px-4 text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                  placeholder={labels.name}
                  autoComplete="name"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-luxe text-ash">{labels.email}</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-full bg-black/35 border border-hairline px-4 text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                  placeholder="name@example.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-luxe text-ash">{labels.subject}</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-11 rounded-full bg-black/35 border border-hairline px-4 text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                placeholder={labels.subject}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-luxe text-ash">{labels.message}</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[160px] rounded-xl2 bg-black/35 border border-hairline px-4 py-3 text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                placeholder={labels.message}
              />
            </label>

            <label className="mt-1 flex items-start gap-3 rounded-xl2 border border-hairline bg-black/20 px-4 py-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[hsl(var(--gold-400))]"
              />
              <span className="text-[12px] leading-snug text-paper/80">{labels.consent}</span>
            </label>

            <button type="submit" disabled={!canSubmit} className="btn-gold h-11 rounded-full text-[12px] uppercase tracking-luxe disabled:opacity-50 disabled:cursor-not-allowed">
              {status === "sending" ? labels.sending : status === "sent" ? "Надіслано ✓" : labels.submit}
            </button>

            {status === "sent" && (
              <div className="text-sm text-paper/90 rounded-xl2 border border-hairline bg-black/20 px-4 py-3">{labels.sent}</div>
            )}
            {status === "error" && (
              <div className="text-sm text-paper/90 rounded-xl2 border border-hairline bg-black/20 px-4 py-3">{labels.error}</div>
            )}
          </form>
        </div>

        {/* Small accessibility hint: contacts are in footer */}
        <div className="mt-4 text-[12px] text-ash">
          Email: <a className="link-gold" href={`mailto:${t.emailTo}`}>{t.emailTo}</a>
        </div>
        </div>
      </div>
    </Modal>
  );
}

