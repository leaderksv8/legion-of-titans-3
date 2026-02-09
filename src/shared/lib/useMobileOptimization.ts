import { useEffect } from "react";

/**
 * Hook для оптимізації анімацій на мобільних пристроях
 * Відключає складні ефекти на слабких пристроях та враховує prefers-reduced-motion
 */
export function useMobileOptimization() {
  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Виявлення слабких пристроїв
    const isLowEndDevice = (() => {
      // @ts-ignore - navigator.deviceMemory може не бути в типах
      const memory = navigator.deviceMemory || 4; // GB RAM
      // @ts-ignore - navigator.hardwareConcurrency
      const cores = navigator.hardwareConcurrency || 4;
      
      return memory < 4 || cores < 4;
    })();

    // Встановлюємо CSS змінні для умовного рендерингу
    const root = document.documentElement;
    
    if (prefersReducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    }
    
    if (isMobile) {
      root.setAttribute('data-mobile', 'true');
      
      // На слабких мобільних пристроях зменшуємо blur та тривалість анімацій
      if (isLowEndDevice) {
        root.setAttribute('data-low-end', 'true');
        root.style.setProperty('--backdrop-blur', '4px');
        root.style.setProperty('--particle-count', '10');
      } else {
        root.style.setProperty('--backdrop-blur', '8px');
        root.style.setProperty('--particle-count', '20');
      }
    }

    // Додаємо passive listeners для кращої performance scroll
    const options: AddEventListenerOptions = { passive: true };
    
    return () => {
      root.removeAttribute('data-mobile');
      root.removeAttribute('data-low-end');
    };
  }, []);
}
