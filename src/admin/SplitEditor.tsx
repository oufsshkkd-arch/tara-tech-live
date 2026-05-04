import { ReactNode, useState, useCallback, useEffect } from "react";
import { Monitor, Smartphone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type ViewMode = "desktop" | "mobile";
type ToastState = { type: "success" | "error"; message: string } | null;

type Props = {
  title: string;
  hasChanges: boolean;
  onSave: () => Promise<void> | void;
  renderPreview: (mode: ViewMode) => ReactNode;
  children: ReactNode;
};

export default function SplitEditor({ title, hasChanges, onSave, renderPreview, children }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave();
      setToast({ type: "success", message: "Settings Saved Successfully!" });
    } catch {
      setToast({ type: "error", message: "Save failed — check your connection." });
    } finally {
      setSaving(false);
    }
  }, [onSave]);

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Sticky Top Bar */}
      <div className="shrink-0 h-14 bg-white border-b border-line flex items-center justify-between px-5 z-10">
        <h1 className="display text-base text-ink leading-none">{title}</h1>

        {/* Mobile / Desktop toggle */}
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
          <button
            onClick={() => setViewMode("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "desktop" ? "bg-white shadow-sm text-ink" : "text-body hover:text-ink"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            Desktop
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "mobile" ? "bg-white shadow-sm text-ink" : "text-body hover:text-ink"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            hasChanges && !saving
              ? "bg-ink text-white hover:bg-black"
              : "bg-line/60 text-body cursor-not-allowed"
          }`}
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save Changes
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`absolute top-16 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg border transition-all ${
            toast.type === "success"
              ? "bg-white border-green-200 text-green-700"
              : "bg-white border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Two-pane body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[400px] shrink-0 bg-white border-r border-line overflow-y-auto">
          <div className="p-6 space-y-6">{children}</div>
        </aside>

        {/* Workspace */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {viewMode === "mobile" ? (
            <div className="flex justify-center py-8 px-4">
              <div className="w-[390px] overflow-hidden rounded-[2.5rem] border-[6px] border-gray-300 shadow-2xl bg-white">
                {renderPreview("mobile")}
              </div>
            </div>
          ) : (
            <div className="w-full">{renderPreview("desktop")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
