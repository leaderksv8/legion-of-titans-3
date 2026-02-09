import { useEffect, useRef } from "react";

export function useCursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Skip на мобільних - немає курсора
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      
      const x = e.clientX;
      const y = e.clientY;
      
      spotlightRef.current.style.setProperty('--x', `${x}px`);
      spotlightRef.current.style.setProperty('--y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return spotlightRef;
}
