import { Link, useLocation } from "react-router-dom";

export default function GuideDock() {
  const location = useLocation();
  if (location.pathname.startsWith("/guide")) return null;

  return (
    <Link
      to="/guide"
      className="fixed right-2 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[50] rounded-full border border-gold/40 bg-black/70 px-3 py-5 text-[11px] uppercase tracking-[0.32em] text-paper shadow-[0_10px_30px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08),0_0_24px_rgba(201,178,124,0.25)] backdrop-blur-[2px] hover:bg-black/85 hover:shadow-[0_12px_34px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.12),0_0_30px_rgba(201,178,124,0.32)] transition-all guide-pulse guide-vibrate sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
      aria-label="Відкрити довідник"
    >
      <span className="flex flex-col items-center gap-1">
        {["Д", "О", "В", "І", "Д", "Н", "И", "К"].map((ch) => (
          <span key={ch} className="leading-none">
            {ch}
          </span>
        ))}
      </span>
    </Link>
  );
}
