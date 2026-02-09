import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-5 md:px-8">{children}</div>;
}

