import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../cms/auth";
import { useCms } from "../cms/store";

export default function AdminLogin() {
  const nav = useNavigate();
  const login = useAuth((s) => s.login);
  const isAuthed = useAuth((s) => s.isAuthed);
  const admin = useCms((s) => s.admin);
  const [email, setEmail] = useState("admin@taratech.ma");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  if (isAuthed) {
    nav("/tara-admin", { replace: true });
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password, admin.email, admin.password);
    if (ok) nav("/tara-admin", { replace: true });
    else setErr("Identifiants invalides.");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-bg p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <span className="relative h-9 w-9 grid place-items-center rounded-full bg-ink text-bg">
            <span className="display italic text-lg leading-none">T</span>
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red" />
          </span>
          <span className="display text-xl text-ink">Tara Tech</span>
          <span className="ml-auto pill">
            <Lock className="h-3 w-3" />
            Admin
          </span>
        </div>
        <div className="card p-7 sm:p-9">
          <h1 className="display text-3xl text-ink mb-1">Espace admin</h1>
          <p className="text-sm text-body mb-6">
            Connectez-vous pour gérer le site.
          </p>
          <form onSubmit={onSubmit} className="grid gap-3">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {err && (
              <div className="flex items-center gap-2 text-sm text-red">
                <AlertCircle className="h-4 w-4" />
                {err}
              </div>
            )}
            <button className="btn-dark mt-2" type="submit">
              Se connecter
            </button>
            <p className="text-[11px] text-body mt-2">
              Identifiants par défaut: <code>admin@taratech.ma</code> / <code>TaraTech2026!</code>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
