import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { ChevronDown, Copy, Eye, EyeOff, GripVertical, MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import BlocksList from "./BlocksList";
import { SECTION_META } from "./themeConfig";
import type { EditorSection, SectionId } from "./types";

export default function SectionCard({
  section,
  active,
  expanded,
  canMoveUp,
  canMoveDown,
  onSelect,
  onToggleExpand,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  onAddBlock,
  onSelectBlock,
  onToggleBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onMove,
}: {
  section: EditorSection;
  active: boolean;
  expanded: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: (sectionId: SectionId) => void;
  onToggleExpand: (sectionId: SectionId) => void;
  onToggleVisibility: (sectionId: SectionId) => void;
  onDuplicate: (sectionId: SectionId) => void;
  onDelete: (sectionId: SectionId) => void;
  onAddBlock: (sectionId: SectionId) => void;
  onSelectBlock: (sectionId: SectionId, blockId: string) => void;
  onToggleBlock: (sectionId: SectionId, blockId: string) => void;
  onDuplicateBlock: (sectionId: SectionId, blockId: string) => void;
  onDeleteBlock: (sectionId: SectionId, blockId: string) => void;
  onMove: (sectionId: SectionId, direction: -1 | 1) => void;
}) {
  const sortable = useSortable({ id: section.id });
  const meta = SECTION_META[section.type];

  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      className={`rounded-2xl border bg-white shadow-sm transition ${
        active ? "border-slate-950 ring-2 ring-slate-950/5" : "border-slate-200 hover:border-slate-300"
      } ${!section.enabled ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-2 p-2">
        <button
          type="button"
          {...sortable.attributes}
          {...sortable.listeners}
          className="grid h-9 w-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Drag section"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            onSelect(section.id);
            onToggleExpand(section.id);
          }}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-right transition hover:bg-slate-50"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">
            {meta.badge}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-black text-slate-950">{meta.label}</span>
            <span className="block truncate text-[11px] text-slate-500">{meta.description}</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={() => onToggleVisibility(section.id)}
          className={`grid h-9 w-9 place-items-center rounded-xl transition ${
            section.enabled
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          }`}
          title={section.enabled ? "إخفاء السكشن" : "إظهار السكشن"}
        >
          {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3">
          <div className="mb-3">
            <BlocksList
              blocks={section.blocks ?? []}
              onAdd={() => onAddBlock(section.id)}
              onSelect={(blockId) => onSelectBlock(section.id, blockId)}
              onToggle={(blockId) => onToggleBlock(section.id, blockId)}
              onDuplicate={(blockId) => onDuplicateBlock(section.id, blockId)}
              onDelete={(blockId) => onDeleteBlock(section.id, blockId)}
            />
          </div>

          <div className="mb-3 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => onAddBlock(section.id)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-black text-slate-600 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Block
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(section.id)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-black text-slate-600 hover:bg-slate-50"
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>
            <button
              type="button"
              onClick={() => onDelete(section.id)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-100 px-2 py-1.5 text-[11px] font-black text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">ترتيب السكشن: {section.order}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={!canMoveUp}
                onClick={() => onMove(section.id, -1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                title="طلع الفوق"
              >
                <MoveUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={!canMoveDown}
                onClick={() => onMove(section.id, 1)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                title="هبط لتحت"
              >
                <MoveDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
