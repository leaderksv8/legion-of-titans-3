/**
 * Додає base URL до шляху для підтримки GitHub Pages
 * @param path - шлях що починається з /
 * @returns повний шлях з base URL
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  // Уникаємо подвійних слешів
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return cleanBase + cleanPath;
}
