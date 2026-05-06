import { useCallback, useEffect, useMemo, useState } from "react";
import { useCms } from "../../cms/store";
import EditorTopBar from "./EditorTopBar";
import SectionSettingsPanel from "./SectionSettingsPanel";
import SectionsPanel from "./SectionsPanel";
import StorefrontPreview from "./StorefrontPreview";
import {
  applyThemeConfigToCmsState,
  moveSection,
  normalizeThemeConfig,
  replaceSectionSettings,
  reorderSections,
  toggleSectionVisibility,
  updateSectionSettings,
} from "./themeConfig";
import type { DeviceMode, SaveStatus, SectionType, ThemeConfig } from "./types";

function serialize(config: ThemeConfig) {
  return JSON.stringify(config);
}

export default function ThemeEditorLayout() {
  const cms = useCms();
  const products = useCms((state) => state.products);

  const initialConfig = useMemo(() => normalizeThemeConfig(useCms.getState()), []);
  const [config, setConfig] = useState<ThemeConfig>(initialConfig);
  const [baseline, setBaseline] = useState(() => serialize(initialConfig));
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [selectedSectionId, setSelectedSectionId] = useState<SectionType>("hero");
  const [expandedSectionId, setExpandedSectionId] = useState<SectionType | null>("hero");

  const selectedSection =
    config.sections.find((section) => section.id === selectedSectionId) ?? config.sections[0];

  const markDirty = useCallback((nextConfig: ThemeConfig) => {
    setConfig(nextConfig);
    setStatus("dirty");
  }, []);

  const refreshFromSupabase = useCallback(async () => {
    await useCms.getState().loadFromDb();
    const next = normalizeThemeConfig(useCms.getState());
    setConfig(next);
    setBaseline(serialize(next));
    setSelectedSectionId(next.sections[0]?.id ?? "hero");
    setExpandedSectionId(next.sections[0]?.id ?? "hero");
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
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1400);
    } catch (error) {
      console.error("Theme save failed", error);
      setStatus("error");
    }
  }, [config]);

  const handleSectionSelect = useCallback((sectionId: SectionType) => {
    setSelectedSectionId(sectionId);
    setExpandedSectionId(sectionId);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-950">
      <EditorTopBar
        device={device}
        status={status}
        onDeviceChange={setDevice}
        onReset={refreshFromSupabase}
        onSave={handleSave}
      />

      <div className="min-h-0 flex-1 overflow-hidden" dir="rtl">
        <div className="flex h-full min-w-0">
          <SectionsPanel
            sections={config.sections}
            selectedSectionId={selectedSectionId}
            expandedSectionId={expandedSectionId}
            onSelect={handleSectionSelect}
            onExpand={setExpandedSectionId}
            onToggleVisibility={(sectionId) => markDirty(toggleSectionVisibility(config, sectionId))}
            onMove={(sectionId, direction) => markDirty(moveSection(config, sectionId, direction))}
            onDragReorder={(activeId, overId) => markDirty(reorderSections(config, activeId, overId))}
          />

          <StorefrontPreview
            config={config}
            products={products}
            device={device}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSectionSelect}
          />

          {selectedSection && (
            <SectionSettingsPanel
              section={selectedSection}
              products={cms.products}
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
    </div>
  );
}
