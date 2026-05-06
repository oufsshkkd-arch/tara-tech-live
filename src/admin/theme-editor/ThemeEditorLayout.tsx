import { useCallback, useEffect, useMemo, useState } from "react";
import type { ThemeEditorBlock } from "../../cms/types";
import { useCms } from "../../cms/store";
import AddBlockModal from "./AddBlockModal";
import AddSectionModal from "./AddSectionModal";
import EditorTopBar from "./EditorTopBar";
import SectionSettingsPanel from "./SectionSettingsPanel";
import SectionsTreePanel from "./SectionsTreePanel";
import StorefrontPreview from "./StorefrontPreview";
import { heroFeaturedProductsBlockSchema } from "./sectionSchemas";
import {
  applyThemeConfigToCmsState,
  moveSection,
  normalizeThemeConfig,
  replaceSectionSettings,
  reorderSections,
  toggleSectionVisibility,
  updateSectionSettings,
} from "./themeConfig";
import type { DeviceMode, PreviewPage, SaveStatus, SectionId, SectionType, ThemeConfig } from "./types";

function serialize(config: ThemeConfig) {
  return JSON.stringify(config);
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function resequenceBlocks(blocks: ThemeEditorBlock[]) {
  return blocks.map((block, index) => ({ ...block, order: index + 1 }));
}

function resequenceSections(config: ThemeConfig): ThemeConfig {
  return {
    ...config,
    sections: config.sections.map((section, index) => ({ ...section, order: index + 1 })),
  };
}

function updateSectionBlocks(
  config: ThemeConfig,
  sectionId: SectionId,
  updater: (blocks: ThemeEditorBlock[]) => ThemeEditorBlock[],
): ThemeConfig {
  return {
    ...config,
    sections: config.sections.map((section) =>
      section.id === sectionId
        ? { ...section, blocks: resequenceBlocks(updater(section.blocks ?? [])) }
        : section,
    ),
  };
}

function createBlock(type: string, order: number): ThemeEditorBlock {
  return {
    id: `${type}-${Date.now()}`,
    type,
    enabled: true,
    order,
    settings: type === heroFeaturedProductsBlockSchema.type
      ? { ...heroFeaturedProductsBlockSchema.defaultSettings }
      : {},
  };
}

export default function ThemeEditorLayout() {
  const cms = useCms();
  const products = useCms((state) => state.products);

  const initialConfig = useMemo(() => normalizeThemeConfig(useCms.getState()), []);
  const [config, setConfig] = useState<ThemeConfig>(initialConfig);
  const [baseline, setBaseline] = useState(() => serialize(initialConfig));
  const [history, setHistory] = useState<ThemeConfig[]>([]);
  const [future, setFuture] = useState<ThemeConfig[]>([]);
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [previewPage, setPreviewPage] = useState<PreviewPage>("home");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [selectedSectionId, setSelectedSectionId] = useState<SectionId>("hero-main");
  const [expandedSectionId, setExpandedSectionId] = useState<SectionId | null>("hero-main");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addBlockSectionId, setAddBlockSectionId] = useState<SectionId | null>(null);

  const selectedSection =
    config.sections.find((section) => section.id === selectedSectionId) ?? config.sections[0];
  const selectedBlock =
    selectedSection?.blocks?.find((block) => block.id === selectedBlockId) ?? null;

  const markDirty = useCallback((nextConfig: ThemeConfig) => {
    setHistory((items) => [...items.slice(-24), config]);
    setFuture([]);
    setConfig(nextConfig);
    setStatus("dirty");
  }, [config]);

  const handleUndo = useCallback(() => {
    setHistory((items) => {
      const previous = items[items.length - 1];
      if (!previous) return items;
      setFuture((futureItems) => [config, ...futureItems].slice(0, 25));
      setConfig(previous);
      setStatus("dirty");
      return items.slice(0, -1);
    });
  }, [config]);

  const handleRedo = useCallback(() => {
    setFuture((items) => {
      const next = items[0];
      if (!next) return items;
      setHistory((historyItems) => [...historyItems.slice(-24), config]);
      setConfig(next);
      setStatus("dirty");
      return items.slice(1);
    });
  }, [config]);

  const refreshFromSupabase = useCallback(async () => {
    await useCms.getState().loadFromDb();
    const next = normalizeThemeConfig(useCms.getState());
    setConfig(next);
    setBaseline(serialize(next));
    setHistory([]);
    setFuture([]);
    setSelectedSectionId(next.sections[0]?.id ?? "hero");
    setExpandedSectionId(next.sections[0]?.id ?? "hero");
    setSelectedBlockId(null);
    setStatus("idle");
  }, []);

  useEffect(() => {
    void refreshFromSupabase();
  }, [refreshFromSupabase]);

  useEffect(() => {
    if (status === "saving" || status === "error") return;
    setStatus(serialize(config) === baseline ? "idle" : "dirty");
  }, [baseline, config, status]);

  const handleSave = useCallback(async () => {
    setStatus("saving");
    try {
      const patch = applyThemeConfigToCmsState(useCms.getState(), config);
      useCms.setState(patch);
      await useCms.getState().syncToDb();
      const savedConfig = normalizeThemeConfig(useCms.getState());
      setConfig(savedConfig);
      setBaseline(serialize(savedConfig));
      setHistory([]);
      setFuture([]);
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1400);
    } catch (error) {
      console.error("Theme save failed", error);
      setStatus("error");
    }
  }, [config]);

  const handleSectionSelect = useCallback((sectionId: SectionId) => {
    setSelectedSectionId(sectionId);
    setExpandedSectionId(sectionId);
    setSelectedBlockId(null);
  }, []);

  const handleAddSection = useCallback(() => {
    setAddSectionOpen(true);
  }, []);

  const handleAddSectionType = useCallback((type: SectionType) => {
    const disabledSection = config.sections.find((section) => section.type === type && !section.enabled);
    if (disabledSection) {
      markDirty(toggleSectionVisibility(config, disabledSection.id));
      setSelectedSectionId(disabledSection.id);
      setExpandedSectionId(disabledSection.id);
      setSelectedBlockId(null);
      setAddSectionOpen(false);
      return;
    }

    const source = config.sections.find((section) => section.type === type);
    if (!source) {
      setAddSectionOpen(false);
      return;
    }

    const clone = cloneJson(source);
    clone.id = `${type}-${Date.now()}`;
    clone.enabled = true;
    clone.order = config.sections.length + 1;
    clone.blocks = [];

    markDirty(resequenceSections({ ...config, sections: [...config.sections, clone] }));
    setSelectedSectionId(clone.id);
    setExpandedSectionId(clone.id);
    setSelectedBlockId(null);
    setAddSectionOpen(false);
  }, [config, markDirty]);

  const handleDeleteSection = useCallback((sectionId: SectionId) => {
    const target = config.sections.find((section) => section.id === sectionId);
    if (!target) return;
    if (!window.confirm("واش متأكد؟ النسخ الإضافية غادي تتحيد، والسكشن الأساسي غادي يتخبا.")) return;

    const sameTypeCount = config.sections.filter((section) => section.type === target.type).length;
    const canRemove = sameTypeCount > 1 || target.id !== target.type;
    const next = canRemove
      ? resequenceSections({ ...config, sections: config.sections.filter((section) => section.id !== sectionId) })
      : toggleSectionVisibility(config, sectionId);

    markDirty(next);
    if (selectedSectionId === sectionId) {
      const fallback = next.sections[0]?.id ?? "hero";
      setSelectedSectionId(fallback);
      setExpandedSectionId(fallback);
      setSelectedBlockId(null);
    }
  }, [config, markDirty, selectedSectionId]);

  const handleDuplicateSection = useCallback((sectionId: SectionId) => {
    const target = config.sections.find((section) => section.id === sectionId);
    if (!target) return;

    const clone = cloneJson(target);
    clone.id = `${target.type}-${Date.now()}`;
    clone.enabled = true;
    clone.order = config.sections.length + 1;
    clone.blocks = (clone.blocks ?? []).map((block, index) => ({
      ...block,
      id: `${block.type}-${Date.now()}-${index}`,
      order: index + 1,
    }));

    markDirty(resequenceSections({ ...config, sections: [...config.sections, clone] }));
    setSelectedSectionId(clone.id);
    setExpandedSectionId(clone.id);
    setSelectedBlockId(null);
  }, [config, markDirty]);

  const handleAddBlock = useCallback((sectionId: SectionId) => {
    setAddBlockSectionId(sectionId);
    setSelectedSectionId(sectionId);
    setExpandedSectionId(sectionId);
  }, []);

  const handleAddBlockType = useCallback((type: string) => {
    if (!addBlockSectionId) return;
    const section = config.sections.find((item) => item.id === addBlockSectionId);
    if (!section) return;

    const block = createBlock(type, (section.blocks?.length ?? 0) + 1);
    markDirty(updateSectionBlocks(config, addBlockSectionId, (blocks) => [...blocks, block]));
    setSelectedSectionId(addBlockSectionId);
    setExpandedSectionId(addBlockSectionId);
    setSelectedBlockId(block.id);
    setAddBlockSectionId(null);
  }, [addBlockSectionId, config, markDirty]);

  const handleSelectBlock = useCallback((sectionId: SectionId, blockId: string) => {
    setSelectedSectionId(sectionId);
    setExpandedSectionId(sectionId);
    setSelectedBlockId(blockId);
  }, []);

  const handleToggleBlock = useCallback((sectionId: SectionId, blockId: string) => {
    markDirty(updateSectionBlocks(config, sectionId, (blocks) =>
      blocks.map((block) => (block.id === blockId ? { ...block, enabled: !block.enabled } : block)),
    ));
  }, [config, markDirty]);

  const handleDuplicateBlock = useCallback((sectionId: SectionId, blockId: string) => {
    const blocks = config.sections.find((section) => section.id === sectionId)?.blocks ?? [];
    const target = blocks.find((block) => block.id === blockId);
    if (!target) return;
    const clone = { ...cloneJson(target), id: `${target.type}-${Date.now()}`, enabled: true };
    markDirty(updateSectionBlocks(config, sectionId, (items) => [...items, clone]));
    setSelectedSectionId(sectionId);
    setExpandedSectionId(sectionId);
    setSelectedBlockId(clone.id);
  }, [config, markDirty]);

  const handleDeleteBlock = useCallback((sectionId: SectionId, blockId: string) => {
    markDirty(updateSectionBlocks(config, sectionId, (blocks) => blocks.filter((block) => block.id !== blockId)));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  }, [config, markDirty, selectedBlockId]);

  const handleMoveBlock = useCallback((sectionId: SectionId, blockId: string, direction: -1 | 1) => {
    markDirty(updateSectionBlocks(config, sectionId, (blocks) => {
      const index = blocks.findIndex((block) => block.id === blockId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= blocks.length) return blocks;
      const next = [...blocks];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    }));
  }, [config, markDirty]);

  const handleBlockChange = useCallback((block: ThemeEditorBlock) => {
    if (!selectedSection) return;
    markDirty(updateSectionBlocks(config, selectedSection.id, (blocks) =>
      blocks.map((item) => (item.id === block.id ? block : item)),
    ));
  }, [config, markDirty, selectedSection]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-950">
      <EditorTopBar
        device={device}
        previewPage={previewPage}
        status={status}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onDeviceChange={setDevice}
        onPreviewPageChange={setPreviewPage}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRefreshPreview={() => setPreviewVersion((value) => value + 1)}
        onReset={refreshFromSupabase}
        onSave={handleSave}
      />

      <div className="min-h-0 flex-1 overflow-hidden" dir="rtl">
        <div className="flex h-full min-w-0">
          <SectionsTreePanel
            sections={config.sections}
            selectedSectionId={selectedSectionId}
            expandedSectionId={expandedSectionId}
            onSelect={handleSectionSelect}
            onExpand={setExpandedSectionId}
            onToggleVisibility={(sectionId) => markDirty(toggleSectionVisibility(config, sectionId))}
            onAddSection={handleAddSection}
            onDuplicate={handleDuplicateSection}
            onDelete={handleDeleteSection}
            onAddBlock={handleAddBlock}
            onSelectBlock={handleSelectBlock}
            onToggleBlock={handleToggleBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onMove={(sectionId, direction) => markDirty(moveSection(config, sectionId, direction))}
            onDragReorder={(activeId, overId) => markDirty(reorderSections(config, activeId, overId))}
          />

          <StorefrontPreview
            config={config}
            products={products}
            device={device}
            previewPage={previewPage}
            refreshKey={previewVersion}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSectionSelect}
          />

          {selectedSection && (
            <SectionSettingsPanel
              section={selectedSection}
              theme={config.theme}
              selectedBlock={selectedBlock}
              products={cms.products}
              collections={cms.categories}
              onThemeUpdate={(patch) => markDirty({ ...config, theme: { ...config.theme, ...patch } })}
              onBlockChange={handleBlockChange}
              onUpdate={(sectionId, patch) =>
                markDirty(updateSectionSettings(config, sectionId, patch as never))
              }
              onReplaceSettings={(sectionId, settings) =>
                markDirty(replaceSectionSettings(config, sectionId, settings as never))
              }
            />
          )}
        </div>
      </div>

      <AddSectionModal
        open={addSectionOpen}
        existing={config.sections.map((section) => section.type)}
        onClose={() => setAddSectionOpen(false)}
        onAdd={handleAddSectionType}
      />
      <AddBlockModal
        open={Boolean(addBlockSectionId)}
        sectionId={addBlockSectionId}
        onClose={() => setAddBlockSectionId(null)}
        onAdd={handleAddBlockType}
      />
    </div>
  );
}
