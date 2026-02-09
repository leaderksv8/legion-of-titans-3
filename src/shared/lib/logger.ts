/**
 * Logger utility für dev/prod unterschiedliche ausgaben
 * Production: log gespeichert, error gesendet
 * Development: voll konsole ausgabe
 */

export const logger = {
  /**
   * Debug-Nachrichten (nur im Dev-Modus sichtbar)
   */
  debug: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  /**
   * Info-Nachrichten
   */
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.info(`[INFO] ${message}`, data);
    }
  },

  /**
   * Warning-Nachrichten
   */
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },

  /**
   * Error-Nachrichten (immer geloggt)
   */
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Könnte später an Sentry/LogRocket sendet werden
    // if (import.meta.env.PROD) {
    //   sendToSentry({ message, error });
    // }
  },
};
