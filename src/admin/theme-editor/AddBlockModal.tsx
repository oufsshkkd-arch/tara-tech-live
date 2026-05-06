import { X } from "lucide-react";
import { heroFeaturedProductsBlockSchema } from "./sectionSchemas";
import type { SectionId } from "./types";

const blockTypes = [
  heroFeaturedProductsBlockSchema.type,
  "text",
  "image",
  "video",
  "button",
  "product",
  "benefit",
  "review",
  "faq_item",
  "app_embed",
];

export default function AddBlockModal({
  open,
  sectionId,
  onClose,
  onAdd,
}: {
  open: boolean;
  sectionId: SectionId | null;
  onClose: () => void;
  onAdd: (type: string) => void;
}) {
  if (!open || !sectionId) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/30 p-4 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-black text-slate-950">إضافة Block</h3>
            <p className="text-xs text-slate-500">Section: {sectionId}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-2 p-4">
          {blockTypes.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => onAdd(type)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm font-black text-slate-800 transition hover:border-slate-950 hover:bg-slate-50"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
