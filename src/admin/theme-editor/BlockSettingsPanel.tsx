import type { ThemeEditorBlock } from "../../cms/types";

export default function BlockSettingsPanel({
  block,
  onChange,
}: {
  block: ThemeEditorBlock | null;
  onChange: (block: ThemeEditorBlock) => void;
}) {
  if (!block) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs font-bold text-slate-400">
        اختار block من الشجرة باش تعدلو
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-xs font-black text-slate-700">Block settings</div>
      <label className="block space-y-1.5">
        <span className="text-[11px] font-black text-slate-500">Type</span>
        <input
          value={block.type}
          onChange={(event) => onChange({ ...block, type: event.target.value })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </label>
    </div>
  );
}
