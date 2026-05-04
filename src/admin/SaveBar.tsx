import { useState } from "react";
import { ExternalLink, RotateCcw, Check, CloudUpload, Loader2 } from "lucide-react";
import { useCms } from "../cms/store";

export default function SaveBar() {
  const reset = useCms((s) => s.reset);
  const syncToDb = useCms((s) => s.syncToDb);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "reset">("idle");

  const handleSave = async () => {
    setStatus("saving");
    await syncToDb();
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  };

  const handleReset = () => {
    if (confirm("Réinitialiser tout le contenu aux valeurs par défaut ? Cette action est irréversible.")) {
      reset();
      setStatus("reset");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-line bg-white/90 backdrop-blur-lg px-6 py-3">
      <div className="flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2 text-sm">
          {status === "saved" && (
            <span className="flex items-center gap-1.5 text-green-600 font-medium">
              <Check className="h-4 w-4" />
              Sauvegardé dans la base de données
            </span>
          )}
          {status === "reset" && (
            <span className="flex items-center gap-1.5 text-green-600 font-medium">
              <Check className="h-4 w-4" />
              Réinitialisé avec succès
            </span>
          )}
          {status === "idle" && (
            <span className="text-body text-xs">
              Cliquez "Sauvegarder" pour persister vos modifications.
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open("/", "_blank")}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-ink/5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-white px-4 py-2 text-xs font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            {status === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CloudUpload className="h-3.5 w-3.5" />}
            {status === "saving" ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-red/20 bg-red/5 px-4 py-2 text-xs font-medium text-red hover:bg-red/10 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
