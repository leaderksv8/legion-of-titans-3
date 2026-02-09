import type { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1 text-[11px] uppercase tracking-luxe text-ash badge-premium">
      <span className="h-1.5 w-1.5 rounded-full bg-gold badge-pulse" aria-hidden="true" />
      {children}
    </span>
  );
}

