import { ReactNode, useEffect, useRef } from "react";

let scrollLockCount = 0;
let prevOverflow = "";
let prevPaddingRight = "";

function lockBodyScroll() {
  scrollLockCount += 1;
  if (scrollLockCount !== 1) return;

  const body = document.body;
  prevOverflow = body.style.overflow;
  prevPaddingRight = body.style.paddingRight;

  // Compensate scrollbar to avoid layout shift
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
  body.style.overflow = "hidden";
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount !== 0) return;

  const body = document.body;
  body.style.overflow = prevOverflow;
  body.style.paddingRight = prevPaddingRight;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  overlayClassName = "bg-black",
  surfaceClassName = "rounded-2xl border border-hairline bg-[#0B0C0E] shadow-2xl overflow-hidden",
  containerClassName = "",
}: {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  overlayClassName?: string;
  surfaceClassName?: string;
  containerClassName?: string;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  function getFocusableEls(root: HTMLElement): HTMLElement[] {
    const nodes = root.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",")
    );
    return Array.from(nodes).filter((el) => {
      // visible + not inert
      const style = window.getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") return false;
      if (el.hasAttribute("aria-hidden")) return false;
      return true;
    });
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = getFocusableEls(root);
        if (focusables.length === 0) {
          e.preventDefault();
          root.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        // If focus escaped the dialog, bring it back in
        if (active && !root.contains(active)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
          return;
        }

        if (e.shiftKey) {
          if (active === first || active === root) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Focus the first focusable element, otherwise focus the dialog itself
    const root = dialogRef.current;
    if (root) {
      const focusables = getFocusableEls(root);
      (focusables[0] ?? root).focus();
    }

    return () => {
      // Restore focus to where the user was
      previouslyFocusedRef.current?.focus?.();
      previouslyFocusedRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 ${containerClassName}`}
    >
      <div
        className={`absolute inset-0 ${overlayClassName}`}
        onMouseDown={onClose}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-hidden ${surfaceClassName}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {children}
      </div>
    </div>
  );
}

