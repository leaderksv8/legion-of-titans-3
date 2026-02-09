import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { logger } = require('@/shared/lib/logger');
    logger.error("AdminPanel Error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-paper p-6">
          <div className="max-w-2xl mx-auto rounded-2xl border border-hairline bg-panel p-8">
            <div className="text-[12px] uppercase tracking-luxe text-ash">Помилка</div>
            <div className="mt-4 text-paper font-semibold">Адмін-панель не завантажилась</div>
            <div className="mt-2 text-sm text-ash">
              {this.state.error?.message || "Невідома помилка"}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors"
            >
              Перезавантажити
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
