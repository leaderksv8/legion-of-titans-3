import type { RefObject, MouseEvent } from "react";

export function useRippleEffect(elementRef: RefObject<HTMLElement>) {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    }, { once: true });
  };

  return { handleClick };
}
