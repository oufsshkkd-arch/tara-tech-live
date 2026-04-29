import { useState } from "react";
import { ExternalLink, RotateCcw, Check } from "lucide-react";
import { useCms } from "../cms/store";

export default function SaveBar() {
  const reset = useCms((s) => s.reset);
  const [showSaved, setShowSaved] = useState(false);

  const handlePreview = () => {
    window.open("/", "_blank");
  };

  const handleReset = () => {
    if (confirm("Réinitialiser tout le contenu aux valeurs par défaut ? Cette action est irréversible.")) {
      reset();
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2500);
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-line bg-white/90 backdrop-blur-lg px-6 py-3">
      <div className="flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2 text-sm">
          {showSaved ? (
            <span className="flex items-center gap-1.5 text-green-600 font-medium animate-fade-up">
              <Check className="h-4 w-4" />
              Réinitialisé avec succès
            </span>
          ) : (
            <span className="text-body text-xs">
              Les modifications sont sauvegardées automatiquement.
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-ink/5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
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
