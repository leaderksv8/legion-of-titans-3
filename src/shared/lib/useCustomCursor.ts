import { useEffect } from "react";

export function useCustomCursor() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over interactive elements
      const isInteractive = 
        target.matches("button, a, [role='button'], input, textarea, select, .interactive") ||
        target.closest("button, a, [role='button'], input, textarea, select, .interactive");
      
      if (isInteractive) {
        document.documentElement.style.cursor = "pointer";
      } else {
        document.documentElement.style.cursor = "auto";
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches("button, a, [role='button'], .interactive") ||
          target.closest("button, a, [role='button'], .interactive")) {
        target.classList.add("cursor-interact");
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.classList.remove("cursor-interact");
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
}
