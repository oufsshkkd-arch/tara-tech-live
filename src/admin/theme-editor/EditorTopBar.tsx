import { ArrowUpRight, Loader2, Redo2, RefreshCw, RotateCcw, Save, Undo2 } from "lucide-react";
import DevicePreviewToggle from "./DevicePreviewToggle";
import SaveStatusBadge from "./SaveStatusBadge";
import TemplateSelector from "./TemplateSelector";
import type { DeviceMode, PreviewPage, SaveStatus } from "./types";

export default function EditorTopBar({
  device,
  previewPage,
  status,
  canUndo,
  canRedo,
  onDeviceChange,
  onPreviewPageChange,
  onUndo,
  onRedo,
  onRefreshPreview,
  onReset,
  onSave,
}: {
  device: DeviceMode;
  previewPage: PreviewPage;
  status: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onDeviceChange: (mode: DeviceMode) => void;
  onPreviewPageChange: (page: PreviewPage) => void;
  onUndo: () => void;
  onRedo: () => void;
  onRefreshPreview: () => void;
  onReset: () => void;
  onSave: () => void;
}) {
  const saving = status === "saving";
  const canSave = status === "dirty" || status === "error";

  return (
    <header
      className="h-[64px] shrink-0 border-b border-slate-200 bg-white/95 px-4 backdrop-blur"
      dir="rtl"
    >
      <div className="flex h-full items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">
              T
            </span>
            <div>
              <h1 className="text-sm font-black text-slate-950">محرر الثيم</h1>
              <p className="text-[11px] text-slate-500">Shopify-style customizer</p>
            </div>
          </div>
        </div>

        <SaveStatusBadge status={status} />

        <div className="mx-2 h-6 w-px bg-slate-200" />

        <div className="hidden items-center gap-1 rounded-xl bg-slate-100 p-1 md:inline-flex">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
            تراجع
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
            إعادة
          </button>
        </div>

        <div className="flex-1" />

        <TemplateSelector value={previewPage} onChange={onPreviewPageChange} />

        <DevicePreviewToggle value={device} onChange={onDeviceChange} />

        <button
          type="button"
          onClick={onRefreshPreview}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          title="Refresh preview"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden xl:inline">Refresh</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 lg:inline-flex"
        >
          <RotateCcw className="h-4 w-4" />
          رجّع آخر نسخة
        </button>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowUpRight className="h-4 w-4" />
          View site
        </a>

        <button
          type="button"
          onClick={onSave}
          disabled={!canSave || saving}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black shadow-sm transition ${
            canSave
              ? "bg-slate-950 text-white hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "كيحفظ..." : "حفظ"}
        </button>
      </div>
    </header>
  );
}
