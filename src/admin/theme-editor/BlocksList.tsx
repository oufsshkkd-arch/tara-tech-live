import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import type { ThemeEditorBlock } from "../../cms/types";

export default function BlocksList({
  blocks,
  onAdd,
  onSelect,
  onToggle,
  onDuplicate,
  onDelete,
  onMove,
}: {
  blocks: ThemeEditorBlock[];
  onAdd: () => void;
  onSelect: (blockId: string) => void;
  onToggle: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  onMove: (blockId: string, direction: -1 | 1) => void;
}) {
  return (
    <div className="space-y-1">
      {blocks.map((block) => (
        <div key={block.id} className="flex items-center gap-1 rounded-xl bg-slate-50 px-2 py-1.5">
          <GripVertical className="h-3.5 w-3.5 text-slate-300" />
          <button
            type="button"
            onClick={() => onSelect(block.id)}
            className="min-w-0 flex-1 truncate text-right text-[11px] font-bold text-slate-600"
          >
            {block.type}
          </button>
          <button type="button" onClick={() => onToggle(block.id)} className="text-slate-400 hover:text-slate-700">
            {block.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={() => onDuplicate(block.id)} className="text-slate-400 hover:text-slate-700">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onMove(block.id, -1)} className="text-[10px] font-black text-slate-400 hover:text-slate-700">
            ↑
          </button>
          <button type="button" onClick={() => onMove(block.id, 1)} className="text-[10px] font-black text-slate-400 hover:text-slate-700">
            ↓
          </button>
          <button type="button" onClick={() => onDelete(block.id)} className="text-red-400 hover:text-red-600">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-[11px] font-black text-slate-500 hover:bg-slate-50"
      >
        <Plus className="h-3.5 w-3.5" />
        Add block
      </button>
    </div>
  );
}
