import { createContext, ReactNode, useContext } from "react";
import { useActiveSection } from "@/shared/lib/useActiveSection";

const ActiveSectionContext = createContext<{ activeId: string }>({ activeId: "" });

export function ActiveSectionProvider({
  ids,
  children,
}: {
  ids: string[];
  children: ReactNode;
}) {
  const hrefs = ids.map((id) => `/#${id}`);
  const { activeId } = useActiveSection(hrefs, { headerOffsetPx: 80 });
  return <ActiveSectionContext.Provider value={{ activeId }}>{children}</ActiveSectionContext.Provider>;
}

export function useActiveSectionId() {
  return useContext(ActiveSectionContext).activeId;
}

