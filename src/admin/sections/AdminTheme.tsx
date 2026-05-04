import { useState, useRef, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCms } from "../../cms/store";
import type { SectionTheme } from "../../cms/types";
import {
  GripVertical,
  Monitor,
  Smartphone,
  Maximize2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

type ViewMode = "desktop" | "mobile" | "full";

/* ── Constants ─────────────────────────────────────────────────── */

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  categories: "الفئات",
  featured: "منتجات مختارة",
  trustStrip: "Trust Strip",
  story: "قصتنا",
  why: "علاش Tara Tech",
  faq: "FAQ",
  finalCta: "CTA نهائي",
};

const DEFAULT_ORDER = ["hero", "categories", "featured", "trustStrip", "story", "why", "faq", "finalCta"];

const THEME_DEFAULTS: SectionTheme = {
  fontSize: 16,
  lineHeight: 1.6,
  bgColor: "",
  textColor: "",
  accentColor: "",
  fontFamily: "",
  paddingTop: 0,
  paddingBottom: 0,
  borderRadius: 0,
  borderWidth: 0,
  borderColor: "",
};

const FONT_FAMILIES = [
  { label: "Auto", value: "" },
  { label: "Inter", value: "'Inter', system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "'JetBrains Mono', 'Courier New', monospace" },
  { label: "Arabic", value: "'Amiri', 'Cairo', serif" },
];

const COLOR_PRESETS = [
  {
    name: "Default",
    swatch: "#FAF8F5",
    brand: { primaryColor: "#111111", ctaColor: "#B42318", ctaHoverColor: "#8E1F1F", textColor: "#111111", bgColor: "#FAF8F5" },
  },
  {
    name: "Dark",
    swatch: "#0F172A",
    brand: { primaryColor: "#F8FAFC", ctaColor: "#3B82F6", ctaHoverColor: "#2563EB", textColor: "#F8FAFC", bgColor: "#0F172A" },
  },
  {
    name: "Warm",
    swatch: "#FFFBF5",
    brand: { primaryColor: "#1A1209", ctaColor: "#EA580C", ctaHoverColor: "#C2410C", textColor: "#1A1209", bgColor: "#FFFBF5" },
  },
  {
    name: "Minimal",
    swatch: "#FAFAFA",
    brand: { primaryColor: "#171717", ctaColor: "#525252", ctaHoverColor: "#404040", textColor: "#171717", bgColor: "#FAFAFA" },
  },
  {
    name: "Sage",
    swatch: "#F4FAF6",
    brand: { primaryColor: "#14291A", ctaColor: "#166534", ctaHoverColor: "#15803D", textColor: "#14291A", bgColor: "#F4FAF6" },
  },
];

/* ── Helpers ────────────────────────────────────────────────────── */

function ColorPill({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] text-body/60 leading-none">{label}</span>
      <div className="relative h-8 w-8">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded-lg border border-line cursor-pointer p-0.5 bg-white"
        />
        {!value && (
          <div className="absolute inset-0 rounded-lg bg-white border border-dashed border-line/60 pointer-events-none flex items-center justify-center">
            <span className="text-[8px] text-body/30 leading-none">auto</span>
          </div>
        )}
      </div>
      {value && (
        <button onClick={() => onChange("")} className="text-[9px] text-body/40 hover:text-red transition-colors leading-none">
          reset
        </button>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const display = format ? format(value) : String(value);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-body mb-1.5">
        <span>{label}</span>
        <span className="font-mono text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink h-1"
      />
      <div className="flex justify-between text-[10px] text-body/40 mt-0.5">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

/* ── Sortable section row ───────────────────────────────────────── */

function SortableSection({
  id,
  isExpanded,
  isVisible,
  theme,
  onToggleExpand,
  onToggleVisibility,
  onThemeChange,
}: {
  id: string;
  isExpanded: boolean;
  isVisible: boolean;
  theme: Partial<SectionTheme>;
  onToggleExpand: () => void;
  onToggleVisibility: () => void;
  onThemeChange: (partial: Partial<SectionTheme>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const t = { ...THEME_DEFAULTS, ...theme };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 50 : undefined,
      }}
      className="rounded-xl border border-line bg-white overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          {...attributes}
          {...listeners}
          className="text-body/25 hover:text-body/60 cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          onClick={onToggleVisibility}
          className={`shrink-0 transition-colors ${isVisible ? "text-body/50 hover:text-body" : "text-body/20 hover:text-body/40"}`}
        >
          {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
        <span className={`flex-1 text-sm font-medium min-w-0 ${isVisible ? "text-ink" : "text-body/35 line-through"}`}>
          {SECTION_LABELS[id] ?? id}
        </span>
        <button
          onClick={onToggleExpand}
          className="text-body/40 hover:text-body transition-colors shrink-0"
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-line px-3 pt-3 pb-4 space-y-4 bg-gray-50/60">

          {/* Font family */}
          <div>
            <p className="text-[11px] text-body mb-1.5">الخط</p>
            <div className="flex flex-wrap gap-1">
              {FONT_FAMILIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onThemeChange({ fontFamily: f.value })}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    t.fontFamily === f.value
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-body border-line hover:border-ink/40"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Typography sliders */}
          <Slider
            label="حجم الخط"
            value={t.fontSize}
            min={12}
            max={24}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => onThemeChange({ fontSize: v })}
          />
          <Slider
            label="ارتفاع السطر"
            value={t.lineHeight}
            min={1.2}
            max={2.0}
            step={0.1}
            format={(v) => v.toFixed(1)}
            onChange={(v) => onThemeChange({ lineHeight: v })}
          />

          {/* Spacing sliders */}
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Padding ↑"
              value={t.paddingTop ?? 0}
              min={0}
              max={120}
              step={8}
              format={(v) => `${v}px`}
              onChange={(v) => onThemeChange({ paddingTop: v })}
            />
            <Slider
              label="Padding ↓"
              value={t.paddingBottom ?? 0}
              min={0}
              max={120}
              step={8}
              format={(v) => `${v}px`}
              onChange={(v) => onThemeChange({ paddingBottom: v })}
            />
          </div>

          {/* Card styling */}
          <div className="pt-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-body/40 mb-2">Card Styling</p>
            <div className="space-y-3">
              <Slider
                label="Border Radius"
                value={t.borderRadius ?? 0}
                min={0}
                max={32}
                step={2}
                format={(v) => `${v}px`}
                onChange={(v) => onThemeChange({ borderRadius: v })}
              />
              <Slider
                label="Border Width"
                value={t.borderWidth ?? 0}
                min={0}
                max={8}
                step={1}
                format={(v) => `${v}px`}
                onChange={(v) => onThemeChange({ borderWidth: v })}
              />
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <ColorPill
              label="خلفية"
              value={t.bgColor}
              onChange={(v) => onThemeChange({ bgColor: v })}
            />
            <ColorPill
              label="نص"
              value={t.textColor}
              onChange={(v) => onThemeChange({ textColor: v })}
            />
            <ColorPill
              label="تمييز"
              value={t.accentColor}
              onChange={(v) => onThemeChange({ accentColor: v })}
            />
            <ColorPill
              label="Border"
              value={t.borderColor ?? ""}
              onChange={(v) => onThemeChange({ borderColor: v })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export default function AdminTheme() {
  const { themeSchema, setThemeSchema, visibility, setVisibility, brand, setBrand } = useCms();

  const [mode, setMode] = useState<ViewMode>("desktop");
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    () => themeSchema?.sectionOrder ?? DEFAULT_ORDER
  );
  const [sectionThemes, setSectionThemes] = useState<Record<string, Partial<SectionTheme>>>(
    () => (themeSchema?.sections as Record<string, Partial<SectionTheme>>) ?? {}
  );
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [globalOpen, setGlobalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const hasChanges =
    JSON.stringify(sectionOrder) !== JSON.stringify(themeSchema?.sectionOrder) ||
    JSON.stringify(sectionThemes) !== JSON.stringify(themeSchema?.sections);

  /* ── Live CSS injection ── */
  const injectThemeStyles = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc?.head) return;

      let styleEl = doc.getElementById("admin-theme-inject") as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = doc.createElement("style");
        styleEl.id = "admin-theme-inject";
        doc.head.appendChild(styleEl);
      }

      let css = "";
      Object.entries(sectionThemes).forEach(([id, theme]) => {
        const sel = `[data-section="${id}"]`;
        const rules: string[] = [];
        if (theme.bgColor) rules.push(`background-color: ${theme.bgColor}`);
        if (theme.textColor) rules.push(`color: ${theme.textColor}`);
        if (theme.fontSize) rules.push(`font-size: ${theme.fontSize}px`);
        if (theme.lineHeight) rules.push(`line-height: ${theme.lineHeight}`);
        if (theme.fontFamily) rules.push(`font-family: ${theme.fontFamily}`);
        if ((theme.paddingTop ?? 0) > 0) rules.push(`padding-top: ${theme.paddingTop}px`);
        if ((theme.paddingBottom ?? 0) > 0) rules.push(`padding-bottom: ${theme.paddingBottom}px`);
        if (rules.length) css += `${sel} { ${rules.join("; ")}; }\n`;
        if (theme.accentColor) {
          css += `${sel} a { color: ${theme.accentColor}; }\n`;
        }
        // Card styling — target direct card children
        const cardRules: string[] = [];
        if ((theme.borderRadius ?? 0) > 0) cardRules.push(`border-radius: ${theme.borderRadius}px`);
        if ((theme.borderWidth ?? 0) > 0) {
          cardRules.push(`border-width: ${theme.borderWidth}px`);
          cardRules.push(`border-style: solid`);
          cardRules.push(`border-color: ${theme.borderColor || "currentColor"}`);
        }
        if (cardRules.length) {
          css += `${sel} [class*="rounded"] { ${cardRules.join("; ")}; }\n`;
        }
      });

      styleEl.textContent = css;
    } catch {
      // Cross-origin or not yet loaded
    }
  }, [sectionThemes]);

  useEffect(() => {
    const t = setTimeout(injectThemeStyles, 80);
    return () => clearTimeout(t);
  }, [injectThemeStyles]);

  const reloadIframe = useCallback(() => {
    try {
      iframeRef.current?.contentWindow?.location.reload();
    } catch {
      // ignore
    }
  }, []);

  /* ── DnD ── */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((prev) => {
        const oi = prev.indexOf(String(active.id));
        const ni = prev.indexOf(String(over.id));
        return arrayMove(prev, oi, ni);
      });
    }
  }

  /* ── Save ── */
  const handleSave = useCallback(() => {
    setThemeSchema({ sectionOrder, sections: sectionThemes });
    setSaved(true);
    setTimeout(() => {
      reloadIframe();
      setSaved(false);
    }, 900);
  }, [sectionOrder, sectionThemes, setThemeSchema, reloadIframe]);

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100vh - 0px)" }}>

      {/* ── Top bar ── */}
      <div className="h-12 bg-white border-b border-line flex items-center gap-3 px-4 shrink-0 z-10">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-700">Live</span>
        </div>
        <div className="h-4 w-px bg-line" />
        <span className="text-sm font-semibold text-ink">Theme Editor</span>
        <div className="flex-1" />
        <button
          onClick={reloadIframe}
          className="p-1.5 rounded-lg text-body/50 hover:text-body hover:bg-gray-100 transition-colors"
          title="Refresh preview"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode("desktop")}
            title="Desktop"
            className={`p-1.5 rounded-md transition-colors ${mode === "desktop" ? "bg-white shadow-sm text-ink" : "text-body/50 hover:text-body"}`}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMode("mobile")}
            title="Mobile"
            className={`p-1.5 rounded-md transition-colors ${mode === "mobile" ? "bg-white shadow-sm text-ink" : "text-body/50 hover:text-body"}`}
          >
            <Smartphone className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMode("full")}
            title="Full width"
            className={`p-1.5 rounded-md transition-colors ${mode === "full" ? "bg-white shadow-sm text-ink" : "text-body/50 hover:text-body"}`}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges && !saved}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            saved
              ? "bg-green-500 text-white"
              : hasChanges
              ? "bg-ink text-white hover:bg-ink/85"
              : "bg-gray-100 text-body/40 cursor-not-allowed"
          }`}
        >
          {saved && <Check className="h-3.5 w-3.5" />}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Sidebar ── */}
        <div className="w-72 shrink-0 bg-white border-r border-line flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">

            {/* Color scheme presets */}
            <div className="px-4 pt-4 pb-3 border-b border-line">
              <p className="text-[10px] font-bold uppercase tracking-widest text-body/40 mb-2.5">Color Presets</p>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setBrand(preset.brand);
                      setTimeout(reloadIframe, 200);
                    }}
                    className="group flex flex-col items-center gap-1"
                    title={preset.name}
                  >
                    <span
                      className="h-8 w-8 rounded-full border-2 border-line group-hover:border-ink/40 transition-colors shadow-sm"
                      style={{ background: preset.swatch }}
                    />
                    <span className="text-[9px] text-body/50 group-hover:text-body transition-colors">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Global brand colors */}
            <div className="border-b border-line">
              <button
                onClick={() => setGlobalOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-body/40">Global Colors</p>
                <ChevronDown className={`h-4 w-4 text-body/40 transition-transform duration-150 ${globalOpen ? "rotate-180" : ""}`} />
              </button>
              {globalOpen && (
                <div className="px-4 pb-4 grid grid-cols-4 gap-3">
                  {(
                    [
                      { key: "primaryColor" as const, label: "Primary" },
                      { key: "ctaColor" as const, label: "CTA" },
                      { key: "textColor" as const, label: "Text" },
                      { key: "bgColor" as const, label: "BG" },
                    ] as const
                  ).map(({ key, label }) => (
                    <div key={key} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-body/60 leading-none">{label}</span>
                      <input
                        type="color"
                        value={brand[key] || "#ffffff"}
                        onChange={(e) => setBrand({ [key]: e.target.value })}
                        className="h-8 w-8 rounded-lg border border-line cursor-pointer p-0.5 bg-white"
                      />
                    </div>
                  ))}
                  <p className="col-span-4 text-[10px] text-body/40 mt-1">
                    Color changes apply after Refresh ↻
                  </p>
                </div>
              )}
            </div>

            {/* Sections header */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-body/40">Sections</p>
              <p className="text-[11px] text-body/40 mt-0.5">Drag to reorder · eye to toggle</p>
            </div>

            {/* Draggable list */}
            <div className="px-3 pb-3 space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                  {sectionOrder.map((id) => (
                    <SortableSection
                      key={id}
                      id={id}
                      isExpanded={expandedSection === id}
                      isVisible={visibility[id as keyof typeof visibility] !== false}
                      theme={sectionThemes[id] ?? {}}
                      onToggleExpand={() =>
                        setExpandedSection((prev) => (prev === id ? null : id))
                      }
                      onToggleVisibility={() => {
                        const k = id as keyof typeof visibility;
                        setVisibility({ [k]: !visibility[k] });
                        setTimeout(reloadIframe, 200);
                      }}
                      onThemeChange={(partial) =>
                        setSectionThemes((prev) => ({
                          ...prev,
                          [id]: { ...(prev[id] ?? {}), ...partial },
                        }))
                      }
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Reset */}
          <div className="p-3 border-t border-line shrink-0">
            <button
              onClick={() => {
                setSectionOrder(DEFAULT_ORDER);
                setSectionThemes({});
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-body/50 hover:text-body rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to defaults
            </button>
          </div>
        </div>

        {/* ── Iframe preview ── */}
        <div className={`flex-1 flex flex-col items-center justify-start overflow-auto ${mode === "full" ? "bg-white" : "bg-gray-100 p-6"}`}>
          {mode === "full" && (
            <iframe
              ref={iframeRef}
              src="/"
              onLoad={injectThemeStyles}
              className="w-full border-0 block flex-1"
              style={{ height: "calc(100vh - 48px)" }}
              title="Site Preview Full"
            />
          )}

          {mode === "desktop" && (
            <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-xl border border-line/50">
              <div className="h-9 bg-gray-50 border-b border-line flex items-center px-3 gap-1.5 shrink-0">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                <div className="flex-1 mx-4">
                  <div className="bg-white border border-line rounded-md text-[11px] text-body/40 px-3 py-0.5 text-center max-w-xs mx-auto">
                    taratech.pro
                  </div>
                </div>
              </div>
              <iframe
                ref={iframeRef}
                src="/"
                onLoad={injectThemeStyles}
                className="w-full border-0 block"
                style={{ height: "calc(100vh - 185px)" }}
                title="Site Preview Desktop"
              />
            </div>
          )}

          {mode === "mobile" && (
            <div className="w-[390px] rounded-[44px] overflow-hidden shadow-2xl border-[8px] border-gray-800 bg-gray-800">
              <div className="h-7 bg-gray-800 flex items-center justify-center shrink-0">
                <div className="w-24 h-4 rounded-full bg-gray-900" />
              </div>
              <div className="bg-white overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src="/"
                  onLoad={injectThemeStyles}
                  className="w-full border-0 block"
                  style={{ height: "calc(100vh - 195px)", width: "390px" }}
                  title="Site Preview Mobile"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── AI bar ── */}
      <div className="h-14 bg-white border-t border-line flex items-center gap-3 px-5 shrink-0">
        <Sparkles className="h-4 w-4 text-body/30 shrink-0" />
        <input
          type="text"
          placeholder="Ask for changes… e.g. 'make the hero background darker'"
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          className="flex-1 text-sm bg-transparent outline-none text-ink placeholder:text-body/30"
        />
        {aiQuery && (
          <button
            onClick={() => setAiQuery("")}
            className="text-[11px] text-body/50 hover:text-body px-2.5 py-1 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
