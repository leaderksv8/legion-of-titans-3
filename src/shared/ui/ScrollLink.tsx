import type { MouseEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function centerScrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const elTop = rect.top + window.scrollY;
  const elHeight = rect.height;
  const viewportHeight = window.innerHeight;

  // header height (approx): compute from header element if present
  const header = document.querySelector("header");
  const headerH = header ? (header as HTMLElement).offsetHeight : 0;

  // Center the section in viewport while keeping header in mind
  const targetY = elTop - headerH - (viewportHeight - headerH) / 2 + elHeight / 2;

  window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });

  // Premium highlight
  el.classList.remove("section-flash");
  // force reflow
  void (el as HTMLElement).offsetWidth;
  el.classList.add("section-flash");
  window.setTimeout(() => el.classList.remove("section-flash"), 1800);
}

export default function ScrollLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handle = (e: MouseEvent) => {
    onClick?.();

    // only handle same-origin hash links like /#team or #team
    const match = href.match(/#([A-Za-z0-9\-_]+)/);
    const id = match?.[1];

    if (!id) return; // normal link

    // Home should go to top
    if (id === "home") {
      if (pathname !== "/") {
        e.preventDefault();
        navigate("/#home");
        return;
      }
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (pathname === "/") {
      // In-page centered scroll
      e.preventDefault();
      // allow layout settle
      window.requestAnimationFrame(() => centerScrollToId(id));
      return;
    }

    // On other routes, navigate to home with hash
    e.preventDefault();
    navigate(`/#${id}`);
  };

  return (
    <a href={href} className={className} onClick={handle}>
      {children}
    </a>
  );
}

