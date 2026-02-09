import { useEffect, useRef, useState } from "react";

export function use3DTilt(strength: number = 15) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
      // Touch-based тilt для мобільних
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        
        const touch = e.touches[0];
        const rect = element.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -(strength * 0.5);
        const rotateY = ((x - centerX) / centerX) * (strength * 0.5);
        
        setTilt({ rotateX, rotateY });
      };

      const handleTouchEnd = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
      };

      element.addEventListener('touchmove', handleTouchMove, { passive: true });
      element.addEventListener('touchend', handleTouchEnd);

      return () => {
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    } else {
      // Mouse-based для desktop
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -strength;
        const rotateY = ((x - centerX) / centerX) * strength;
        
        setTilt({ rotateX, rotateY });
      };

      const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [strength]);

  return { elementRef, tilt };
}
