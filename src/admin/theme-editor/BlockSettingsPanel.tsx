import type { Category, HeroFeaturedProductsSettings, Product, ThemeEditorBlock } from "../../cms/types";
import CollectionPickerField from "./CollectionPickerField";
import ProductPickerField from "./ProductPickerField";
import { heroFeaturedProductsBlockSchema } from "./sectionSchemas";

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
    >
      <span>{label}</span>
      <span className={`h-5 w-9 rounded-full p-0.5 transition ${checked ? "bg-slate-950" : "bg-slate-200"}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-0" : "-translate-x-4"}`} />
      </span>
    </button>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-black text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function BlockSettingsPanel({
  block,
  products,
  collections,
  onChange,
}: {
  block: ThemeEditorBlock | null;
  products: Product[];
  collections: Category[];
  onChange: (block: ThemeEditorBlock) => void;
}) {
  if (!block) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs font-bold text-slate-400">
        اختار block من الشجرة باش تعدلو
      </div>
    );
  }

  const updateSettings = (patch: Record<string, unknown>) =>
    onChange({ ...block, settings: { ...block.settings, ...patch } });

  const isHeroProducts = block.type === heroFeaturedProductsBlockSchema.type;
  const heroSettings = {
    ...heroFeaturedProductsBlockSchema.defaultSettings,
    ...block.settings,
  } as unknown as HeroFeaturedProductsSettings;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-black text-slate-700">Block settings</div>
          <div className="text-[11px] text-slate-400">{block.type}</div>
        </div>
        <ToggleRow label="مفعل" checked={block.enabled} onChange={(enabled) => onChange({ ...block, enabled })} />
      </div>

      {!isHeroProducts && (
        <label className="block space-y-1.5">
          <span className="text-[11px] font-black text-slate-500">Type</span>
          <input
            value={block.type}
            onChange={(event) => onChange({ ...block, type: event.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </label>
      )}

      {isHeroProducts && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-[11px] font-bold leading-5 text-slate-600">
            هاد البلوك هو اللي كيعطيك 3 products اللي كيبانو مع scroll تحت Hero Revolut.
          </div>
          <SelectRow
            label="طريقة الاختيار"
            value={heroSettings.selectionMode}
            onChange={(selectionMode) => updateSettings({ selectionMode })}
            options={[
              { label: "Manual", value: "manual" },
              { label: "Collection", value: "collection" },
            ]}
          />
          {heroSettings.selectionMode === "manual" ? (
            <ProductPickerField
              label="اختار بالضبط 3 منتجات"
              value={heroSettings.selectedProductIds}
              products={products}
              max={3}
              onChange={(selectedProductIds) => updateSettings({ selectedProductIds })}
            />
          ) : (
            <CollectionPickerField
              label="اختار collection"
              value={heroSettings.collectionId ?? ""}
              collections={collections}
              onChange={(collectionId) => updateSettings({ collectionId: collectionId || null })}
            />
          )}
          <SelectRow
            label="ستايل الكروت"
            value={heroSettings.cardStyle}
            onChange={(cardStyle) => updateSettings({ cardStyle })}
            options={[
              { label: "Revolut", value: "revolut" },
              { label: "Premium", value: "premium" },
              { label: "Glass", value: "glass" },
              { label: "Minimal", value: "minimal" },
              { label: "Compact", value: "compact" },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="الصورة" checked={heroSettings.showImage} onChange={(showImage) => updateSettings({ showImage })} />
            <ToggleRow label="العنوان" checked={heroSettings.showTitle} onChange={(showTitle) => updateSettings({ showTitle })} />
            <ToggleRow label="الثمن" checked={heroSettings.showPrice} onChange={(showPrice) => updateSettings({ showPrice })} />
            <ToggleRow label="الثمن القديم" checked={heroSettings.showOldPrice} onChange={(showOldPrice) => updateSettings({ showOldPrice })} />
            <ToggleRow label="Rating" checked={heroSettings.showRating} onChange={(showRating) => updateSettings({ showRating })} />
            <ToggleRow label="CTA" checked={heroSettings.showCTA} onChange={(showCTA) => updateSettings({ showCTA })} />
          </div>
        </div>
      )}
    </div>
  );
}
