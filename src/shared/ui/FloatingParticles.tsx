import { useEffect, useState } from "react";

export default function FloatingParticles() {
  const [count, setCount] = useState(20);

  useEffect(() => {
    // Виявляємо mobile та слабкі пристрої
    const isMobile = 'ontouchstart' in window;
    // @ts-ignore
    const isLowEnd = (navigator.deviceMemory || 4) < 4;
    
    if (isMobile && isLowEnd) {
      setCount(10); // Менше часток на слабких мобільних
    } else if (isMobile) {
      setCount(15); // Помірно на мобільних
    }
  }, []);

  return (
    <div className="floating-particles">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 15}s`,
          }}
        />
      ))}
    </div>
  );
}
