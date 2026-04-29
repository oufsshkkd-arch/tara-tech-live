import { useState } from "react";
import { useCms } from "../../cms/store";
import { Field, PageHeader, Section } from "../ui";
import { Check } from "lucide-react";

export default function AdminAccount() {
  const { admin, setAdmin } = useCms();
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (password && password !== confirm) {
      setErr("Les mots de passe ne correspondent pas.");
      return;
    }
    setAdmin({
      email,
      ...(password ? { password } : {}),
    });
    setPassword("");
    setConfirm("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compte admin"
        description="Modifiez l'email et le mot de passe d'accès à la console."
      />
      <Section title="Identifiants">
        <form onSubmit={onSave} className="grid sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <div />
          <Field label="Nouveau mot de passe" hint="Laissez vide pour ne pas changer.">
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirmation">
            <input
              type="password"
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
          {err && <div className="sm:col-span-2 text-sm text-red">{err}</div>}
          <div className="sm:col-span-2 flex items-center gap-3">
            <button className="btn-dark" type="submit">
              Enregistrer
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                <Check className="h-4 w-4" />
                Enregistré
              </span>
            )}
          </div>
        </form>
      </Section>
    </div>
  );
}
