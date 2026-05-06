import { X } from "lucide-react";
import { SECTION_META, SECTION_TYPES } from "./themeConfig";
import type { SectionType } from "./types";

export default function AddSectionModal({
  open,
  existing,
  onClose,
  onAdd,
}: {
  open: boolean;
  existing: SectionType[];
  onClose: () => void;
  onAdd: (type: SectionType) => void;
}) {
  if (!open) return null;
  const existingSet = new Set(existing);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/30 p-4 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-black text-slate-950">إضافة سكشن</h3>
            <p className="text-xs text-slate-500">اختار section من Shopify-like library</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid max-h-[65vh] gap-2 overflow-y-auto p-4 sm:grid-cols-2">
          {SECTION_TYPES.map((type) => {
            const meta = SECTION_META[type];
            return (
              <button
                type="button"
                key={type}
                onClick={() => onAdd(type)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 text-right transition hover:border-slate-950 hover:bg-slate-50"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-[10px] font-black text-white">
                  {meta.badge}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-slate-950">{meta.label}</span>
                  <span className="block text-[11px] text-slate-500">
                    {existingSet.has(type) ? "موجود — غادي يتفعل/يتحدد" : meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
