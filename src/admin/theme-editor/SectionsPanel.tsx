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
import { Layers3 } from "lucide-react";
import SectionCard from "./SectionCard";
import type { EditorSection, SectionType } from "./types";

export default function SectionsPanel({
  sections,
  selectedSectionId,
  expandedSectionId,
  onSelect,
  onExpand,
  onToggleVisibility,
  onMove,
  onDragReorder,
}: {
  sections: EditorSection[];
  selectedSectionId: SectionType;
  expandedSectionId: SectionType | null;
  onSelect: (sectionId: SectionType) => void;
  onExpand: (sectionId: SectionType | null) => void;
  onToggleVisibility: (sectionId: SectionType) => void;
  onMove: (sectionId: SectionType, direction: -1 | 1) => void;
  onDragReorder: (activeId: SectionType, overId: SectionType) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id) as SectionType;
    const overId = event.over ? (String(event.over.id) as SectionType) : null;
    if (overId && activeId !== overId) onDragReorder(activeId, overId);
  }

  return (
    <aside className="flex h-full w-[330px] shrink-0 flex-col border-l border-slate-200 bg-slate-50/80" dir="rtl">
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white">
            <Layers3 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-950">Sections</h2>
            <p className="text-[11px] text-slate-500">رتّب، خبي، وعدّل homepage</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {sections.map((section, index) => (
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
                  onMove={onMove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
}
