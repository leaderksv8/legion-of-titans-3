import { useEffect } from "react";

export function useRippleOnClick() {
  useEffect(() => {
    // Обробка кліків та touches
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;
      
      if (e instanceof TouchEvent) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const target = e.target as HTMLElement;
      const button = target.closest('.ripple-container, button, [role="button"]') as HTMLElement;
      
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple-effect");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);

      ripple.addEventListener("animationend", () => {
        ripple.remove();
      }, { once: true });
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction, { passive: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);
}
