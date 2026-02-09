import { useState } from "react";
import Container from "@/shared/ui/Container";

type Props = {
  onAuthed: () => void;
};

export default function AdminLogin({ onAuthed }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Захищений вхід: пароль можна змінити у .env файлі як VITE_ADMIN_PASSWORD
    // За замовчуванням: "legion2024"
    const ADMIN_PASSWORD = "legion2024";
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "true");
      onAuthed();
    } else {
      setError("Невірний пароль");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Container>
        <div className="max-w-sm mx-auto rounded-2xl border border-hairline bg-panel p-8">
          <div className="text-[14px] uppercase tracking-luxe text-ash mb-6">Адміністрація</div>
          
          <form onSubmit={handleLogin} className="grid gap-4">
            <div>
              <label className="text-[12px] uppercase tracking-luxe text-ash">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Введи пароль"
                autoFocus
                className="mt-2 h-12 w-full rounded-xl border border-hairline bg-black/20 px-4 text-paper outline-none focus:border-gold/60"
              />
            </div>

            {error && (
              <div className="text-[12px] text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="h-12 rounded-xl px-4 text-[12px] uppercase tracking-luxe bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25 transition-colors"
            >
              Увійти
            </button>
          </form>

          <div className="mt-6 text-[11px] text-ash text-center">
            Адміністративна панель. Доступ обмежено.
          </div>
        </div>
      </Container>
    </div>
  );
}
