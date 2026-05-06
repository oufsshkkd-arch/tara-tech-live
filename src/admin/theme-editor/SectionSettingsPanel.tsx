import { Plus, Settings2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import type {
  AnnouncementThemeSettings,
  Category,
  CategoriesThemeSettings,
  CategoryThemeItem,
  FaqThemeItem,
  FaqThemeSettings,
  FeaturedThemeSettings,
  FinalCtaThemeSettings,
  FooterThemeSettings,
  GenericThemeSettings,
  HeroThemeSettings,
  Product,
  RevolutBenefitCard,
  RevolutBenefitsThemeSettings,
  StoryThemeSettings,
  TrustMarqueeThemeSettings,
  TrustThemeItem,
  TrustThemeSettings,
  StorefrontThemeConfig,
  ThemeEditorBlock,
  WhyTaraThemeSettings,
} from "../../cms/types";
import BlockSettingsPanel from "./BlockSettingsPanel";
import DynamicSourceButton from "./DynamicSourceButton";
import MediaPickerField from "./MediaPickerField";
import ProductPickerField from "./ProductPickerField";
import ThemeSettingsPanel from "./ThemeSettingsPanel";
import { SECTION_META } from "./themeConfig";
import type { EditorSection, SectionId } from "./types";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-black text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-[11px] leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  dir = "auto",
  dynamic = true,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "auto" | "rtl" | "ltr";
  dynamic?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
      {dynamic && (
        <DynamicSourceButton
          fallback={value}
          onPick={(_, token) => onChange(value ? `${value} ${token}` : token)}
        />
      )}
    </div>
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
  dynamic = true,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  dynamic?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        dir="auto"
        className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
      {dynamic && (
        <DynamicSourceButton
          fallback={value}
          onPick={(_, token) => onChange(value ? `${value} ${token}` : token)}
        />
      )}
    </div>
  );
}

function SelectInput({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
    >
      <span>{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-slate-950" : "bg-slate-200"}`}>
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "right-6" : "right-1"
          }`}
        />
      </span>
    </button>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-12 rounded-xl border border-slate-200 bg-white p-1"
      />
      <TextInput value={value} onChange={onChange} dir="ltr" dynamic={false} />
    </div>
  );
}

function ArrayToolbar({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</h4>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-2.5 py-1.5 text-[11px] font-black text-white transition hover:bg-slate-800"
      >
        <Plus className="h-3.5 w-3.5" />
        زيد
      </button>
    </div>
  );
}

export default function SectionSettingsPanel({
  section,
  theme,
  selectedBlock,
  products,
  collections,
  onThemeUpdate,
  onBlockChange,
  onUpdate,
  onReplaceSettings,
}: {
  section: EditorSection;
  theme: StorefrontThemeConfig["theme"];
  selectedBlock: ThemeEditorBlock | null;
  products: Product[];
  collections: Category[];
  onThemeUpdate: (patch: Partial<StorefrontThemeConfig["theme"]>) => void;
  onBlockChange: (block: ThemeEditorBlock) => void;
  onUpdate: (sectionId: SectionId, patch: Record<string, unknown>) => void;
  onReplaceSettings: (sectionId: SectionId, settings: EditorSection["settings"]) => void;
}) {
  const meta = SECTION_META[section.type];

  return (
    <aside className="flex h-full w-[370px] shrink-0 flex-col border-r border-slate-200 bg-white" dir="rtl">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-xs font-black text-white">
            {meta.badge}
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-950">{meta.label}</h2>
            <p className="text-[11px] text-slate-500">{meta.description}</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/80 p-4">
        <div className="mb-4">
          <ThemeSettingsPanel theme={theme} onChange={onThemeUpdate} />
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings2 className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-black text-slate-700">إعدادات السكشن</span>
          </div>

          {(section.type === "hero" || section.type === "hero_revolut") && (
            <HeroSettings
              settings={section.settings as HeroThemeSettings}
              onChange={(patch) => onUpdate(section.id, patch)}
            />
          )}

          {section.type === "announcementBar" && (
            <AnnouncementSettings
              settings={section.settings as AnnouncementThemeSettings}
              onChange={(patch) => onUpdate(section.id, patch)}
            />
          )}

          {section.type === "categories" && (
            <CategoriesSettings
              settings={section.settings as CategoriesThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}

          {(section.type === "featured" || section.type === "bestSellers") && (
            <FeaturedSettings
              settings={section.settings as FeaturedThemeSettings}
              products={products}
              onChange={(patch) => onUpdate(section.id, patch)}
            />
          )}

          {section.type === "trustStrip" && (
            <TrustSettings
              settings={section.settings as TrustThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}

          {section.type === "codBenefits" && (
            <TrustSettings
              settings={section.settings as TrustThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}

          {section.type === "story" && (
            <StorySettings
              settings={section.settings as StoryThemeSettings}
              onChange={(patch) => onUpdate(section.id, patch)}
            />
          )}

          {section.type === "faq" && (
            <FaqSettings
              settings={section.settings as FaqThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}

          {section.type === "footer" && (
            <FooterSettings
              settings={section.settings as FooterThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}

          {["header", "productHighlight", "reviews", "whatsappCta"].includes(section.type) && (
            <GenericSettings
              settings={section.settings as GenericThemeSettings}
              onChange={(patch) => onUpdate(section.id, patch)}
            />
          )}

          {section.type === "revolutBenefits" && (
            <RevolutBenefitsSettings
              settings={section.settings as RevolutBenefitsThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}

          {section.type === "whyTara" && (
            <WhyTaraSettings
              settings={section.settings as WhyTaraThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}

          {section.type === "finalCta" && (
            <FinalCtaSettings
              settings={section.settings as FinalCtaThemeSettings}
              onChange={(patch) => onUpdate(section.id, patch)}
            />
          )}

          {section.type === "trustMarquee" && (
            <TrustMarqueeSettings
              settings={section.settings as TrustMarqueeThemeSettings}
              onChange={(settings) => onReplaceSettings(section.id, settings)}
            />
          )}
        </div>

        <div className="mt-4">
          <BlockSettingsPanel
            block={selectedBlock}
            products={products}
            collections={collections}
            onChange={onBlockChange}
          />
        </div>
      </div>
    </aside>
  );
}

function GenericSettings({
  settings,
  onChange,
}: {
  settings: GenericThemeSettings;
  onChange: (patch: Partial<GenericThemeSettings>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="العنوان">
        <TextInput value={settings.title ?? ""} onChange={(title) => onChange({ title })} />
      </Field>
      <Field label="الوصف">
        <TextArea value={settings.subtitle ?? ""} onChange={(subtitle) => onChange({ subtitle })} rows={3} />
      </Field>
      <MediaPickerField
        label="الصورة"
        value={settings.imageUrl ? { type: "external", url: settings.imageUrl, alt: settings.title } : null}
        kind="image"
        folder="sections"
        onChange={(asset) => onChange({ imageUrl: asset?.url ?? "" })}
      />
      <Field label="الفيديو">
        <TextInput value={settings.videoUrl ?? ""} onChange={(videoUrl) => onChange({ videoUrl })} dir="ltr" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="لون الخلفية">
          <ColorInput value={settings.backgroundColor ?? ""} onChange={(backgroundColor) => onChange({ backgroundColor })} />
        </Field>
        <Field label="لون النص">
          <ColorInput value={settings.textColor ?? ""} onChange={(textColor) => onChange({ textColor })} />
        </Field>
      </div>
    </div>
  );
}

function HeroSettings({
  settings,
  onChange,
}: {
  settings: HeroThemeSettings;
  onChange: (patch: Partial<HeroThemeSettings>) => void;
}) {
  const media = settings.media ?? {
    image: settings.imageUrl ? { type: "external" as const, url: settings.imageUrl, alt: settings.title } : null,
    mobileImage: settings.mobileImageUrl ? { type: "external" as const, url: settings.mobileImageUrl, alt: settings.title } : null,
    video: settings.videoUrl ? { type: "external" as const, url: settings.videoUrl, alt: settings.title, mimeType: "video/mp4" } : null,
    poster: settings.posterUrl ? { type: "external" as const, url: settings.posterUrl, alt: `${settings.title} poster` } : null,
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-bold leading-5 text-blue-800">
        Hero Revolut template: الستايل ثابت premium، وانت كتبدل المحتوى، الميديا، CTA، و3 منتجات من البلوك.
      </div>
      <Field label="العنوان">
        <TextArea value={settings.title} onChange={(title) => onChange({ title })} rows={2} />
      </Field>
      <Field label="الوصف">
        <TextArea value={settings.subtitle} onChange={(subtitle) => onChange({ subtitle })} rows={3} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA الأساسي">
          <TextInput
            value={settings.primaryCtaText}
            onChange={(primaryCtaText) => onChange({ primaryCtaText })}
          />
        </Field>
        <Field label="الرابط">
          <TextInput
            value={settings.primaryCtaLink}
            onChange={(primaryCtaLink) => onChange({ primaryCtaLink })}
            dir="ltr"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA الثانوي">
          <TextInput
            value={settings.secondaryCtaText}
            onChange={(secondaryCtaText) => onChange({ secondaryCtaText })}
          />
        </Field>
        <Field label="الرابط">
          <TextInput
            value={settings.secondaryCtaLink}
            onChange={(secondaryCtaLink) => onChange({ secondaryCtaLink })}
            dir="ltr"
          />
        </Field>
      </div>
      <div className="space-y-3">
        <MediaPickerField
          label="Hero image"
          value={media.image}
          kind="image"
          folder="hero"
          onChange={(asset) => onChange({ media: { ...media, image: asset }, imageUrl: asset?.url ?? "" })}
        />
        <MediaPickerField
          label="Mobile image"
          value={media.mobileImage}
          kind="image"
          folder="hero"
          onChange={(asset) => onChange({ media: { ...media, mobileImage: asset }, mobileImageUrl: asset?.url ?? "" })}
        />
        <MediaPickerField
          label="Hero video"
          value={media.video}
          kind="video"
          folder="hero"
          onChange={(asset) => onChange({ media: { ...media, video: asset }, videoUrl: asset?.url ?? "" })}
        />
        <MediaPickerField
          label="Video poster"
          value={media.poster}
          kind="image"
          folder="hero"
          onChange={(asset) => onChange({ media: { ...media, poster: asset }, posterUrl: asset?.url ?? "" })}
        />
      </div>
      <Toggle checked={settings.enableVideo ?? false} onChange={(enableVideo) => onChange({ enableVideo })} label="تفعيل الفيديو" />
      <Toggle
        checked={settings.enableAnimation ?? true}
        onChange={(enableAnimation) => onChange({ enableAnimation })}
        label="Animation خفيفة"
      />
      <Toggle
        checked={settings.enableHeroProducts ?? true}
        onChange={(enableHeroProducts) => onChange({ enableHeroProducts })}
        label="إظهار 3 منتجات تحت الهيرو"
      />
      <Field label="Badge text">
        <TextInput value={settings.badgeText} onChange={(badgeText) => onChange({ badgeText })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="الخلفية">
          <SelectInput
            value={settings.backgroundStyle}
            onChange={(backgroundStyle) =>
              onChange({ backgroundStyle: backgroundStyle as HeroThemeSettings["backgroundStyle"] })
            }
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
              { label: "Gradient", value: "gradient" },
              { label: "Glass", value: "glass" },
            ]}
          />
        </Field>
        <Field label="محاذاة النص">
          <SelectInput
            value={settings.textAlign}
            onChange={(textAlign) => onChange({ textAlign: textAlign as HeroThemeSettings["textAlign"] })}
            options={[
              { label: "يمين", value: "right" },
              { label: "وسط", value: "center" },
              { label: "يسار", value: "left" },
            ]}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="لون العنوان">
          <ColorInput value={settings.titleColor ?? "#ffffff"} onChange={(titleColor) => onChange({ titleColor })} />
        </Field>
        <Field label="لون الوصف">
          <ColorInput value={settings.subtitleColor ?? "#cbd5e1"} onChange={(subtitleColor) => onChange({ subtitleColor })} />
        </Field>
        <Field label="Accent">
          <ColorInput value={settings.accentColor ?? "#2563eb"} onChange={(accentColor) => onChange({ accentColor })} />
        </Field>
        <Field label="Media position">
          <SelectInput
            value={settings.mediaPosition ?? "left"}
            onChange={(mediaPosition) => onChange({ mediaPosition: mediaPosition as HeroThemeSettings["mediaPosition"] })}
            options={[
              { label: "يسار", value: "left" },
              { label: "يمين", value: "right" },
              { label: "فوق", value: "top" },
              { label: "Background", value: "background" },
            ]}
          />
        </Field>
      </div>
    </div>
  );
}

function AnnouncementSettings({
  settings,
  onChange,
}: {
  settings: AnnouncementThemeSettings;
  onChange: (patch: Partial<AnnouncementThemeSettings>) => void;
}) {
  return (
    <div className="space-y-4">
      <Toggle checked={settings.enabled} onChange={(enabled) => onChange({ enabled })} label="تفعيل الشريط" />
      <Field label="النص">
        <TextInput value={settings.text} onChange={(text) => onChange({ text })} />
      </Field>
      <Field label="الرابط">
        <TextInput value={settings.link} onChange={(link) => onChange({ link })} dir="ltr" />
      </Field>
      <Field label="لون الخلفية">
        <ColorInput
          value={settings.backgroundColor}
          onChange={(backgroundColor) => onChange({ backgroundColor })}
        />
      </Field>
      <Field label="لون النص">
        <ColorInput value={settings.textColor} onChange={(textColor) => onChange({ textColor })} />
      </Field>
    </div>
  );
}

function CategoriesSettings({
  settings,
  onChange,
}: {
  settings: CategoriesThemeSettings;
  onChange: (settings: CategoriesThemeSettings) => void;
}) {
  const updateCategory = (index: number, patch: Partial<CategoryThemeItem>) => {
    onChange({
      ...settings,
      categories: settings.categories.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  };

  return (
    <div className="space-y-4">
      <Field label="عنوان السكشن">
        <TextInput value={settings.title} onChange={(title) => onChange({ ...settings, title })} />
      </Field>
      <ArrayToolbar
        label="الفئات"
        onAdd={() =>
          onChange({
            ...settings,
            categories: [
              ...settings.categories,
              { id: `cat-${Date.now()}`, name: "فئة جديدة", image: "", link: "/categories/new", enabled: true },
            ],
          })
        }
      />
      {settings.categories.map((category, index) => (
        <div key={category.id || index} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <Toggle
              checked={category.enabled}
              onChange={(enabled) => updateCategory(index, { enabled })}
              label={category.name || "فئة"}
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...settings,
                  categories: settings.categories.filter((_, itemIndex) => itemIndex !== index),
                })
              }
              className="mr-2 grid h-9 w-9 place-items-center rounded-xl text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field label="الاسم">
            <TextInput value={category.name} onChange={(name) => updateCategory(index, { name })} />
          </Field>
          <MediaPickerField
            label="صورة الفئة"
            value={category.image ? { type: "external", url: category.image, alt: category.name } : null}
            kind="image"
            folder="categories"
            onChange={(asset) => updateCategory(index, { image: asset?.url ?? "" })}
          />
          <Field label="الرابط">
            <TextInput value={category.link} onChange={(link) => updateCategory(index, { link })} dir="ltr" />
          </Field>
        </div>
      ))}
    </div>
  );
}

function FeaturedSettings({
  settings,
  products,
  onChange,
}: {
  settings: FeaturedThemeSettings;
  products: Product[];
  onChange: (patch: Partial<FeaturedThemeSettings>) => void;
}) {
  const selected = new Set(settings.productIds);

  function toggleProduct(productId: string) {
    const next = selected.has(productId)
      ? settings.productIds.filter((id) => id !== productId)
      : [...settings.productIds, productId];
    onChange({ productIds: next });
  }

  return (
    <div className="space-y-4">
      <Field label="عنوان السكشن">
        <TextInput value={settings.title} onChange={(title) => onChange({ title })} />
      </Field>
      <Field label="Layout">
        <SelectInput
          value={settings.layout}
          onChange={(layout) => onChange({ layout: layout as FeaturedThemeSettings["layout"] })}
          options={[
            { label: "Grid", value: "grid" },
            { label: "Carousel", value: "carousel" },
          ]}
        />
      </Field>
      <Toggle checked={settings.showPrice} onChange={(showPrice) => onChange({ showPrice })} label="إظهار الثمن" />
      <Toggle
        checked={settings.showRating}
        onChange={(showRating) => onChange({ showRating })}
        label="إظهار التقييم"
      />
      <Toggle
        checked={settings.showDiscountBadge}
        onChange={(showDiscountBadge) => onChange({ showDiscountBadge })}
        label="إظهار badge ديال التخفيض"
      />
      <ProductPickerField
        label="اختيار المنتجات"
        value={settings.productIds}
        products={products}
        onChange={(productIds) => onChange({ productIds })}
      />
    </div>
  );
}

function TrustSettings({
  settings,
  onChange,
}: {
  settings: TrustThemeSettings;
  onChange: (settings: TrustThemeSettings) => void;
}) {
  const updateItem = (index: number, patch: Partial<TrustThemeItem>) => {
    onChange({
      items: settings.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    });
  };

  return (
    <div className="space-y-4">
      <ArrayToolbar
        label="عناصر الثقة"
        onAdd={() =>
          onChange({
            items: [...settings.items, { icon: "ShieldCheck", title: "ثقة", description: "وصف قصير" }],
          })
        }
      />
      {settings.items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onChange({ items: settings.items.filter((_, itemIndex) => itemIndex !== index) })}
              className="grid h-8 w-8 place-items-center rounded-xl text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field label="Icon">
            <TextInput value={item.icon} onChange={(icon) => updateItem(index, { icon })} dir="ltr" />
          </Field>
          <Field label="العنوان">
            <TextInput value={item.title} onChange={(title) => updateItem(index, { title })} />
          </Field>
          <Field label="الوصف">
            <TextInput value={item.description} onChange={(description) => updateItem(index, { description })} />
          </Field>
        </div>
      ))}
    </div>
  );
}

function StorySettings({
  settings,
  onChange,
}: {
  settings: StoryThemeSettings;
  onChange: (patch: Partial<StoryThemeSettings>) => void;
}) {
  const updateChip = (index: number, patch: Partial<{ label: string; sub: string }>) => {
    const chips = [...(settings.valueChips || [])];
    chips[index] = { ...chips[index], ...patch };
    onChange({ valueChips: chips });
  };

  return (
    <div className="space-y-4">
      <Field label="العنوان">
        <TextInput value={settings.title} onChange={(title) => onChange({ title })} />
      </Field>
      <Field label="الوصف">
        <TextArea value={settings.description} onChange={(description) => onChange({ description })} rows={5} />
      </Field>
      <MediaPickerField
        label="الصورة"
        value={settings.imageUrl ? { type: "external", url: settings.imageUrl, alt: settings.title } : null}
        kind="image"
        folder="story"
        onChange={(asset) => onChange({ imageUrl: asset?.url ?? "" })}
      />
      <Field label="نص الـ Pill">
        <TextInput value={settings.pillLabel ?? "قصتنا"} onChange={(pillLabel) => onChange({ pillLabel })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="نص CTA">
          <TextInput value={settings.ctaText ?? "اقرأ قصتنا"} onChange={(ctaText) => onChange({ ctaText })} />
        </Field>
        <Field label="رابط CTA">
          <TextInput value={settings.ctaLink ?? "/notre-histoire"} onChange={(ctaLink) => onChange({ ctaLink })} dir="ltr" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="عنوان الكارد">
          <TextInput value={settings.overlayTitle ?? "براند مغربية"} onChange={(overlayTitle) => onChange({ overlayTitle })} />
        </Field>
        <Field label="وصف الكارد">
          <TextInput value={settings.overlaySub ?? ""} onChange={(overlaySub) => onChange({ overlaySub })} />
        </Field>
      </div>
      <ArrayToolbar
        label="Value Chips"
        onAdd={() =>
          onChange({
            valueChips: [...(settings.valueChips || []), { label: "جديد", sub: "وصف" }],
          })
        }
      />
      {(settings.valueChips || []).map((chip, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <Field label="العنوان">
            <TextInput value={chip.label} onChange={(label) => updateChip(index, { label })} />
          </Field>
          <Field label="الوصف">
            <TextInput value={chip.sub} onChange={(sub) => updateChip(index, { sub })} />
          </Field>
        </div>
      ))}
    </div>
  );
}

function FaqSettings({
  settings,
  onChange,
}: {
  settings: FaqThemeSettings;
  onChange: (settings: FaqThemeSettings) => void;
}) {
  const updateItem = (index: number, patch: Partial<FaqThemeItem>) => {
    onChange({
      items: settings.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    });
  };

  return (
    <div className="space-y-4">
      <ArrayToolbar
        label="FAQ"
        onAdd={() =>
          onChange({
            items: [
              ...settings.items,
              { id: `faq-${Date.now()}`, question: "سؤال جديد", answer: "جواب مختصر وواضح", enabled: true },
            ],
          })
        }
      />
      {settings.items.map((item, index) => (
        <div key={item.id || index} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <Toggle checked={item.enabled} onChange={(enabled) => updateItem(index, { enabled })} label="مفعّل" />
            <button
              type="button"
              onClick={() => onChange({ items: settings.items.filter((_, itemIndex) => itemIndex !== index) })}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field label="السؤال">
            <TextInput value={item.question} onChange={(question) => updateItem(index, { question })} />
          </Field>
          <Field label="الجواب">
            <TextArea value={item.answer} onChange={(answer) => updateItem(index, { answer })} rows={4} />
          </Field>
        </div>
      ))}
    </div>
  );
}

function FooterSettings({
  settings,
  onChange,
}: {
  settings: FooterThemeSettings;
  onChange: (settings: FooterThemeSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Logo text">
        <TextInput value={settings.logoText} onChange={(logoText) => onChange({ ...settings, logoText })} />
      </Field>
      <Field label="الوصف">
        <TextArea
          value={settings.description}
          onChange={(description) => onChange({ ...settings, description })}
          rows={4}
        />
      </Field>
      <Field label="Instagram">
        <TextInput
          value={settings.socialLinks.instagram}
          onChange={(instagram) =>
            onChange({ ...settings, socialLinks: { ...settings.socialLinks, instagram } })
          }
          dir="ltr"
        />
      </Field>
      <Field label="TikTok">
        <TextInput
          value={settings.socialLinks.tiktok}
          onChange={(tiktok) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, tiktok } })}
          dir="ltr"
        />
      </Field>
      <Field label="Facebook">
        <TextInput
          value={settings.socialLinks.facebook}
          onChange={(facebook) =>
            onChange({ ...settings, socialLinks: { ...settings.socialLinks, facebook } })
          }
          dir="ltr"
        />
      </Field>
      <Field label="WhatsApp">
        <TextInput
          value={settings.contactWhatsApp}
          onChange={(contactWhatsApp) => onChange({ ...settings, contactWhatsApp })}
          dir="ltr"
        />
      </Field>
      <Field label="Copyright">
        <TextInput
          value={settings.copyrightText}
          onChange={(copyrightText) => onChange({ ...settings, copyrightText })}
        />
      </Field>
    </div>
  );
}

function RevolutBenefitsSettings({
  settings,
  onChange,
}: {
  settings: RevolutBenefitsThemeSettings;
  onChange: (settings: RevolutBenefitsThemeSettings) => void;
}) {
  const updateCard = (index: number, patch: Partial<RevolutBenefitCard>) => {
    onChange({
      cards: settings.cards.map((card, i) => (i === index ? { ...card, ...patch } : card)),
    });
  };

  return (
    <div className="space-y-4">
      <ArrayToolbar
        label="بطاقات المزايا"
        onAdd={() =>
          onChange({
            cards: [
              ...settings.cards,
              {
                id: `rb-${Date.now()}`,
                badge: "جديد",
                title: "عنوان البطاقة",
                description: "وصف البطاقة",
                ctaText: "اكتشف",
                ctaLink: "/products",
                image: "",
                theme: "light",
              },
            ],
          })
        }
      />
      {settings.cards.map((card, index) => (
        <div key={card.id} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700">
              {card.theme === "dark" ? "⚫ Dark" : "⚪ Light"}
            </span>
            <button
              type="button"
              onClick={() =>
                onChange({ cards: settings.cards.filter((_, i) => i !== index) })
              }
              className="grid h-8 w-8 place-items-center rounded-xl text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field label="Badge">
            <TextInput value={card.badge} onChange={(badge) => updateCard(index, { badge })} />
          </Field>
          <Field label="العنوان">
            <TextInput value={card.title} onChange={(title) => updateCard(index, { title })} />
          </Field>
          <Field label="الوصف">
            <TextArea value={card.description} onChange={(description) => updateCard(index, { description })} rows={3} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA نص">
              <TextInput value={card.ctaText} onChange={(ctaText) => updateCard(index, { ctaText })} />
            </Field>
            <Field label="CTA رابط">
              <TextInput value={card.ctaLink} onChange={(ctaLink) => updateCard(index, { ctaLink })} dir="ltr" />
            </Field>
          </div>
          <MediaPickerField
            label="صورة البطاقة"
            value={card.image ? { type: "external", url: card.image, alt: card.title } : null}
            kind="image"
            folder="benefits"
            onChange={(asset) => updateCard(index, { image: asset?.url ?? "" })}
          />
          <Field label="الثيم">
            <SelectInput
              value={card.theme}
              onChange={(theme) => updateCard(index, { theme: theme as "light" | "dark" })}
              options={[
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
              ]}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

function WhyTaraSettings({
  settings,
  onChange,
}: {
  settings: WhyTaraThemeSettings;
  onChange: (settings: WhyTaraThemeSettings) => void;
}) {
  const updatePoint = (index: number, patch: Partial<{ text: string; icon: string }>) => {
    onChange({
      ...settings,
      points: settings.points.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    });
  };

  return (
    <div className="space-y-4">
      <Field label="العنوان">
        <TextInput value={settings.title} onChange={(title) => onChange({ ...settings, title })} />
      </Field>
      <Field label="المقدمة">
        <TextArea value={settings.intro} onChange={(intro) => onChange({ ...settings, intro })} rows={3} />
      </Field>
      <Field label="نص الـ Pill">
        <TextInput value={settings.pillLabel} onChange={(pillLabel) => onChange({ ...settings, pillLabel })} />
      </Field>
      <ArrayToolbar
        label="نقاط القوة"
        onAdd={() =>
          onChange({
            ...settings,
            points: [...settings.points, { text: "نقطة جديدة", icon: "Sparkles" }],
          })
        }
      />
      {settings.points.map((point, index) => (
        <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...settings,
                  points: settings.points.filter((_, i) => i !== index),
                })
              }
              className="grid h-8 w-8 place-items-center rounded-xl text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Field label="النص">
            <TextInput value={point.text} onChange={(text) => updatePoint(index, { text })} />
          </Field>
          <Field label="Icon" hint="Sparkles, ShieldCheck, Wallet, ClipboardCheck, HeadphonesIcon">
            <TextInput value={point.icon} onChange={(icon) => updatePoint(index, { icon })} dir="ltr" />
          </Field>
        </div>
      ))}
    </div>
  );
}

function FinalCtaSettings({
  settings,
  onChange,
}: {
  settings: FinalCtaThemeSettings;
  onChange: (patch: Partial<FinalCtaThemeSettings>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="العنوان">
        <TextInput value={settings.title} onChange={(title) => onChange({ title })} />
      </Field>
      <Field label="الوصف">
        <TextArea value={settings.body} onChange={(body) => onChange({ body })} rows={3} />
      </Field>
      <Field label="نص الـ Pill">
        <TextInput value={settings.pillLabel} onChange={(pillLabel) => onChange({ pillLabel })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA الأساسي">
          <TextInput value={settings.primaryCta} onChange={(primaryCta) => onChange({ primaryCta })} />
        </Field>
        <Field label="رابط">
          <TextInput value={settings.primaryCtaLink} onChange={(primaryCtaLink) => onChange({ primaryCtaLink })} dir="ltr" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA الثانوي">
          <TextInput value={settings.secondaryCta} onChange={(secondaryCta) => onChange({ secondaryCta })} />
        </Field>
        <Field label="رابط">
          <TextInput value={settings.secondaryCtaLink} onChange={(secondaryCtaLink) => onChange({ secondaryCtaLink })} dir="ltr" />
        </Field>
      </div>
    </div>
  );
}

function TrustMarqueeSettings({
  settings,
  onChange,
}: {
  settings: TrustMarqueeThemeSettings;
  onChange: (settings: TrustMarqueeThemeSettings) => void;
}) {
  const updateItem = (index: number, text: string) => {
    onChange({
      ...settings,
      items: settings.items.map((item, i) => (i === index ? text : item)),
    });
  };

  return (
    <div className="space-y-4">
      <ArrayToolbar
        label="عناصر الشريط"
        onAdd={() =>
          onChange({
            ...settings,
            items: [...settings.items, "عنصر جديد"],
          })
        }
      />
      {settings.items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1">
            <TextInput value={item} onChange={(text) => updateItem(index, text)} />
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...settings,
                items: settings.items.filter((_, i) => i !== index),
              })
            }
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Field label="سرعة الشريط" hint="القيمة بالثواني">
        <input
          type="number"
          value={settings.speed}
          onChange={(e) => onChange({ ...settings, speed: parseInt(e.target.value) || 40 })}
          min={5}
          max={120}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </Field>
    </div>
  );
}
