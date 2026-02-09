import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/shared/ui/Modal";
import Container from "@/shared/ui/Container";
import { contact } from "@/content/site";
import { useLocale } from "@/shared/lib/localeContext";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useLocale();
  const t = contact[locale];
  const f = t.form;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Email validation regex
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  // Validation function
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (message.trim().length < 10) {
      newErrors.message = f.validation.messageTooShort;
    }
    
    if (!consent) {
      newErrors.consent = f.validation.consentRequired;
    }

    if (email.trim() && !isValidEmail(email)) {
      newErrors.email = f.validation.emailInvalid;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = { ...errors };
    
    if (field === "email" && email.trim() && !isValidEmail(email)) {
      newErrors.email = f.validation.emailInvalid;
    } else {
      delete newErrors.email;
    }
    
    setErrors(newErrors);
  };

  const canSubmit = message.trim().length > 0 && consent && status === "idle" && Object.keys(errors).length === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !canSubmit) return;

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
      setErrors({});
      setTouched({});
      
      toast.success("✓ " + f.sent);
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 2000);
    } catch (error) {
      setStatus("error");
      toast.error(f.error);
      setTimeout(() => setStatus("idle"), 3500);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t.title} surfaceClassName="rounded-2xl border border-hairline bg-[#0B0C0E] shadow-2xl">
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain touch-pan-y hide-scrollbar">
        {/* Close button - uses CSS class */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Закрити"
        >
          ✕
        </button>
        
        <div className="p-5 sm:p-6 md:p-7">
          <div>
            <div className="text-[11px] sm:text-[12px] uppercase tracking-luxe text-ash">{t.title}</div>
            <div className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold">{t.subtitle}</div>
          </div>

          <div className="mt-4 sm:mt-5 rounded-xl2 border border-hairline bg-black/30 p-4 sm:p-5 md:p-6">
            <form className="grid gap-3 sm:gap-4" onSubmit={onSubmit}>
            {/* honeypot */}
            <input tabIndex={-1} autoComplete="off" className="sr-only" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" />

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-luxe text-ash">{f.name}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className="h-12 sm:h-11 rounded-full bg-black/35 border border-hairline px-4 text-[14px] sm:text-base text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                  placeholder={f.namePlaceholder}
                  autoComplete="name"
                />
                {errors.name && touched.name && <span className="text-[10px] sm:text-[11px] text-red-400">{errors.name}</span>}
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-luxe text-ash">{f.email}</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className="h-12 sm:h-11 rounded-full bg-black/35 border border-hairline px-4 text-[14px] sm:text-base text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                  placeholder={f.emailPlaceholder}
                  autoComplete="email"
                  inputMode="email"
                />
                {errors.email && touched.email && <span className="text-[10px] sm:text-[11px] text-red-400">{errors.email}</span>}
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-luxe text-ash">{f.subject}</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-12 sm:h-11 rounded-full bg-black/35 border border-hairline px-4 text-[14px] sm:text-base text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                placeholder={f.subjectPlaceholder}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-luxe text-ash">{f.message}</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => handleBlur("message")}
                className="min-h-40 sm:min-h-[160px] rounded-xl2 bg-black/35 border border-hairline px-4 py-3 text-[14px] sm:text-base text-paper placeholder:text-ash/70 outline-none focus:ring-2 focus:ring-[hsla(var(--gold-400)/.45)]"
                placeholder={f.messagePlaceholder}
              />
              {errors.message && touched.message && <span className="text-[10px] sm:text-[11px] text-red-400">{errors.message}</span>}
            </label>

            <label className="mt-1 flex items-start gap-3 rounded-xl2 border border-hairline bg-black/20 px-4 py-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                onBlur={() => handleBlur("consent")}
                className="mt-1 h-4 w-4 accent-[hsl(var(--gold-400))]"
              />
              <span className="text-[11px] sm:text-[12px] leading-snug text-paper/80">{f.consent}</span>
            </label>
            {errors.consent && touched.consent && <span className="text-[10px] sm:text-[11px] text-red-400">{errors.consent}</span>}

            <button type="submit" disabled={!canSubmit} className="btn-gold h-12 sm:h-11 rounded-full text-[11px] sm:text-[12px] uppercase tracking-luxe disabled:opacity-50 disabled:cursor-not-allowed">
              {status === "sending" ? f.sending : status === "sent" ? "✓ " + f.sent : f.submit}
            </button>

            {status === "sent" && (
              <div className="text-[13px] sm:text-sm text-paper/90 rounded-xl2 border border-hairline bg-black/20 px-4 py-3">{f.sent}</div>
            )}
            {status === "error" && (
              <div className="text-[13px] sm:text-sm text-paper/90 rounded-xl2 border border-hairline bg-black/20 px-4 py-3">{f.error}</div>
            )}
            </form>
          </div>

          {/* Small accessibility hint: contacts are in footer */}
          <div className="mt-4 text-[11px] sm:text-[12px] text-ash">
            Email: <a className="link-gold" href={`mailto:${t.emailTo}`}>{t.emailTo}</a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

