/**
 * Skeleton Loading Placeholders
 * Використовуються для покращення сприйняття завантаження (UX)
 */

interface SkeletonProps {
  className?: string;
  count?: number;
}

/**
 * Базовий Skeleton - повторюється count разів
 */
export function Skeleton({ className = "w-full h-12", count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${className} bg-gradient-to-r from-gold/5 to-gold/10 rounded-xl animate-pulse`}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton для таблиці (рядки з аватаром)
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 rounded-xl border border-hairline/30">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-3" />
          </div>
          <Skeleton className="w-24 h-10 rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton для карток (grid)
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl2 border border-hairline/30 overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-4 space-y-3">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-12" />
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-10 rounded-lg" />
              <Skeleton className="flex-1 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton для тексту (параграфи)
 */
export function TextSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          className={i === lines - 1 ? "w-5/6 h-4" : "w-full h-4"}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton для героїчної секції (велика)
 */
export function HeroSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-1/3 h-6" />
      <Skeleton className="w-full h-20" />
      <div className="flex gap-4">
        <Skeleton className="flex-1 h-12 rounded-full" />
        <Skeleton className="flex-1 h-12 rounded-full" />
      </div>
    </div>
  );
}
