import { useState } from "react";

interface UseAuthReturn {
  authed: boolean;
  csrf: string;
  pw: string;
  loginError: string;
  busy: boolean;
  setPw: (pw: string) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setCsrf: (csrf: string) => void;
  setAuthed: (authed: boolean) => void;
}

export function useAuth(): UseAuthReturn {
  const [authed, setAuthed] = useState<boolean>(false);
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [csrf, setCsrf] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function login() {
    setLoginError("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/login.php", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        setLoginError(`Помилка ${r.status}: ${j?.error || "Неправильний пароль"}`);
        setAuthed(false);
        setCsrf("");
        setBusy(false);
        return;
      }

      setCsrf(typeof j?.csrf === "string" ? j.csrf : "");
      setAuthed(true);
      setPw("");
    } catch (err) {
      setLoginError(`Помилка з'єднання: ${err instanceof Error ? err.message : String(err)}`);
      setAuthed(false);
      setCsrf("");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { 
      method: "POST", 
      headers: csrf ? { "x-lot-csrf": csrf } : undefined 
    });
    setAuthed(false);
    setCsrf("");
  }

  return {
    authed,
    csrf,
    pw,
    loginError,
    busy,
    setPw,
    login,
    logout,
    setCsrf,
    setAuthed,
  };
}
