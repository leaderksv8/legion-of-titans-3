import { useState } from "react";

interface LoginFormProps {
  onLogin: (password: string) => Promise<void>;
  disabled: boolean;
  error: string;
}

export default function AdminLogin({ onLogin, disabled, error }: LoginFormProps) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setBusy(true);
    try {
      await onLogin(pw);
      setPw("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-hairline bg-panel p-4 sm:p-6 md:p-7">
      <div className="text-[12px] uppercase tracking-luxe text-ash">Вхід</div>
      <div className="mt-2 text-lg font-semibold">Пароль модератора</div>

      <div className="mt-5 grid gap-3">
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="h-11 rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
          placeholder="••••••••"
          type="password"
          onKeyDown={(e) => e.key === "Enter" && !disabled && !busy && handleLogin()}
        />
        <button
          className="h-11 rounded-xl px-5 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors disabled:opacity-50"
          onClick={handleLogin}
          disabled={disabled || busy || pw.length < 3}
          type="button"
        >
          Увійти
        </button>

        {error && <div className="text-sm text-ash">{error}</div>}

        <div className="text-[12px] text-ash">Сесія зберігається 30 хвилин (у cookie).</div>
      </div>
    </div>
  );
}
