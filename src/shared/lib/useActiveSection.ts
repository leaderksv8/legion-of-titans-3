import { useEffect, useMemo, useState } from "react";

function idFromHref(href: string): string | null {
  const m = href.match(/#([A-Za-z0-9\-_]+)/);
  return m?.[1] ?? null;
}

export function useActiveSection(sectionHrefs: string[], opts?: { headerOffsetPx?: number }) {
  const ids = useMemo(() => {
    const arr = sectionHrefs.map(idFromHref).filter(Boolean) as string[];
    return Array.from(new Set(arr));
  }, [sectionHrefs]);

  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (ids.length === 0) return;

    const headerOffset = opts?.headerOffsetPx ?? 80;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const anchors = elements.map((el) => {
      const anchor =
        el.querySelector<HTMLElement>("[data-active-anchor]") ??
        el.querySelector<HTMLElement>("h1, h2, h3") ??
        el;
      return { id: el.id, anchor };
    });

    let ticking = false;

    const calc = () => {
      ticking = false;
      const line = headerOffset + (window.innerHeight - headerOffset) * 0.25;
      let current = "";
      const ordered = anchors
        .map((item) => ({ id: item.id, top: item.anchor.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top);

      for (const item of ordered) {
        if (item.top <= line) current = item.id;
        else break;
      }

      if (current !== activeId) setActiveId(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(calc);
      }
    };

    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return { activeId };
}

