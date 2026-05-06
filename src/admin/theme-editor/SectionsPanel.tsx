import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Layers3, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import SectionCard from "./SectionCard";
import { SECTION_META } from "./themeConfig";
import type { EditorSection, SectionId } from "./types";

export default function SectionsPanel({
  sections,
  selectedSectionId,
  expandedSectionId,
  onSelect,
  onExpand,
  onToggleVisibility,
  onAddSection,
  onDuplicate,
  onDelete,
  onAddBlock,
  onSelectBlock,
  onToggleBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onMoveBlock,
  onMove,
  onDragReorder,
}: {
  sections: EditorSection[];
  selectedSectionId: SectionId;
  expandedSectionId: SectionId | null;
  onSelect: (sectionId: SectionId) => void;
  onExpand: (sectionId: SectionId | null) => void;
  onToggleVisibility: (sectionId: SectionId) => void;
  onAddSection: () => void;
  onDuplicate: (sectionId: SectionId) => void;
  onDelete: (sectionId: SectionId) => void;
  onAddBlock: (sectionId: SectionId) => void;
  onSelectBlock: (sectionId: SectionId, blockId: string) => void;
  onToggleBlock: (sectionId: SectionId, blockId: string) => void;
  onDuplicateBlock: (sectionId: SectionId, blockId: string) => void;
  onDeleteBlock: (sectionId: SectionId, blockId: string) => void;
  onMoveBlock: (sectionId: SectionId, blockId: string, direction: -1 | 1) => void;
  onMove: (sectionId: SectionId, direction: -1 | 1) => void;
  onDragReorder: (activeId: SectionId, overId: SectionId) => void;
}) {
  const [query, setQuery] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (overId && activeId !== overId) onDragReorder(activeId, overId);
  }

  const visibleSections = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return sections;
    return sections.filter((section) => {
      const meta = SECTION_META[section.type];
      return `${section.type} ${meta.label} ${meta.description}`.toLowerCase().includes(cleanQuery);
    });
  }, [query, sections]);

  return (
    <aside className="flex h-full w-[330px] shrink-0 flex-col border-l border-slate-200 bg-slate-50/80" dir="rtl">
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white">
            <Layers3 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-950">Sections</h2>
            <p className="text-[11px] text-slate-500">Template: Home page</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sections/settings"
              className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>
          <button
            type="button"
            onClick={onAddSection}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
            title="Add section"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {visibleSections.map((section) => {
                const index = sections.findIndex((item) => item.id === section.id);
                return (
                <SectionCard
                  key={section.id}
                  section={section}
                  active={selectedSectionId === section.id}
                  expanded={expandedSectionId === section.id}
                  canMoveUp={index > 0}
                  canMoveDown={index < sections.length - 1}
                  onSelect={onSelect}
                  onToggleExpand={(sectionId) =>
                    onExpand(expandedSectionId === sectionId ? null : sectionId)
                  }
                  onToggleVisibility={onToggleVisibility}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onAddBlock={onAddBlock}
                  onSelectBlock={onSelectBlock}
                  onToggleBlock={onToggleBlock}
                  onDuplicateBlock={onDuplicateBlock}
                  onDeleteBlock={onDeleteBlock}
                  onMoveBlock={onMoveBlock}
                  onMove={onMove}
                />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
}
