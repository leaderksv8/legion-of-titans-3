import type { Locale } from "@/content/site";

export default function LocaleToggle({ locale, onChange }: { locale: Locale; onChange: (l: Locale) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-hairline p-1 text-[12px] uppercase tracking-luxe text-ash">
      <button
        onClick={() => {
          window.localStorage.setItem("locale", "uk");
          onChange("uk");
        }}
        className={"px-3 py-1 rounded-full transition-colors " + (locale === "uk" ? "bg-paper text-ink" : "hover:text-paper")}
        aria-label="Українська"
        type="button"
      >
        UA
      </button>
      <button
        onClick={() => {
          window.localStorage.setItem("locale", "en");
          onChange("en");
        }}
        className={"px-3 py-1 rounded-full transition-colors " + (locale === "en" ? "bg-paper text-ink" : "hover:text-paper")}
        aria-label="English"
        type="button"
      >
        EN
      </button>
    </div>
  );
}

