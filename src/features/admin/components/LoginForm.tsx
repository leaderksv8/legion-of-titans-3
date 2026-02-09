import Container from "@/shared/ui/Container";
import { ActionButton } from "../ui/ActionButton";

interface LoginFormProps {
  pw: string;
  setPw: (pw: string) => void;
  onLogin: () => Promise<void>;
  loginError: string;
  busy: boolean;
}

export function LoginForm({ pw, setPw, onLogin, loginError, busy }: LoginFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin();
  };

  return (
    <Container>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-hairline bg-panel p-8">
            <h1 className="text-2xl font-semibold text-paper mb-2">Адмін-панель</h1>
            <p className="text-sm text-ash mb-6">Введіть пароль для доступу</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm text-ash mb-2">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-hairline bg-black/20 text-paper placeholder:text-ash focus:outline-none focus:border-gold/50 focus:bg-black/40 transition-colors"
                  placeholder="••••••••"
                  disabled={busy}
                />
              </div>

              <ActionButton
                type="submit"
                variant="primary"
                disabled={busy || !pw}
                className="w-full"
              >
                {busy ? "Вхід..." : "Увійти"}
              </ActionButton>

              {loginError && (
                <div className="text-sm text-red-300 bg-red-900/10 border border-red-700/30 rounded-lg p-3">
                  {loginError}
                </div>
              )}

              <div className="text-[12px] text-ash">
                Сесія зберігається 30 хвилин (у cookie).
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
