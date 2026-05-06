import { Plus, Settings2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import type {
  AnnouncementThemeSettings,
  CategoriesThemeSettings,
  CategoryThemeItem,
  FaqThemeItem,
  FaqThemeSettings,
  FeaturedThemeSettings,
  FooterThemeSettings,
  HeroThemeSettings,
  Product,
  StoryThemeSettings,
  TrustThemeItem,
  TrustThemeSettings,
} from "../../cms/types";
import { SECTION_META } from "./themeConfig";
import type { EditorSection, SectionType } from "./types";

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
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "auto" | "rtl" | "ltr";
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      dir={dir}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      dir="auto"
      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    />
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
      <TextInput value={value} onChange={onChange} dir="ltr" />
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
  products,
  onUpdate,
  onReplaceSettings,
}: {
  section: EditorSection;
  products: Product[];
  onUpdate: (sectionId: SectionType, patch: Record<string, unknown>) => void;
  onReplaceSettings: (sectionId: SectionType, settings: EditorSection["settings"]) => void;
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
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings2 className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-black text-slate-700">إعدادات السكشن</span>
          </div>

          {section.type === "hero" && (
            <HeroSettings
              settings={section.settings as HeroThemeSettings}
              onChange={(patch) => onUpdate("hero", patch)}
            />
          )}

          {section.type === "announcementBar" && (
            <AnnouncementSettings
              settings={section.settings as AnnouncementThemeSettings}
              onChange={(patch) => onUpdate("announcementBar", patch)}
            />
          )}

          {section.type === "categories" && (
            <CategoriesSettings
              settings={section.settings as CategoriesThemeSettings}
              onChange={(settings) => onReplaceSettings("categories", settings)}
            />
          )}

          {section.type === "featured" && (
            <FeaturedSettings
              settings={section.settings as FeaturedThemeSettings}
              products={products}
              onChange={(patch) => onUpdate("featured", patch)}
            />
          )}

          {section.type === "trustStrip" && (
            <TrustSettings
              settings={section.settings as TrustThemeSettings}
              onChange={(settings) => onReplaceSettings("trustStrip", settings)}
            />
          )}

          {section.type === "story" && (
            <StorySettings
              settings={section.settings as StoryThemeSettings}
              onChange={(patch) => onUpdate("story", patch)}
            />
          )}

          {section.type === "faq" && (
            <FaqSettings
              settings={section.settings as FaqThemeSettings}
              onChange={(settings) => onReplaceSettings("faq", settings)}
            />
          )}

          {section.type === "footer" && (
            <FooterSettings
              settings={section.settings as FooterThemeSettings}
              onChange={(settings) => onReplaceSettings("footer", settings)}
            />
          )}
        </div>
      </div>
    </aside>
  );
}

function HeroSettings({
  settings,
  onChange,
}: {
  settings: HeroThemeSettings;
  onChange: (patch: Partial<HeroThemeSettings>) => void;
}) {
  return (
    <div className="space-y-4">
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
      <Field label="Hero image URL">
        <TextInput value={settings.imageUrl} onChange={(imageUrl) => onChange({ imageUrl })} dir="ltr" />
      </Field>
      <Field label="Mobile image URL">
        <TextInput
          value={settings.mobileImageUrl}
          onChange={(mobileImageUrl) => onChange({ mobileImageUrl })}
          dir="ltr"
        />
      </Field>
      <Field label="Hero video URL">
        <TextInput value={settings.videoUrl} onChange={(videoUrl) => onChange({ videoUrl })} dir="ltr" />
      </Field>
      <Field label="Poster URL">
        <TextInput value={settings.posterUrl} onChange={(posterUrl) => onChange({ posterUrl })} dir="ltr" />
      </Field>
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
          <Field label="الصورة">
            <TextInput value={category.image} onChange={(image) => updateCategory(index, { image })} dir="ltr" />
          </Field>
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
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wide text-slate-500">اختيار المنتجات</h4>
        {products
          .filter((product) => !product.hidden)
          .slice(0, 12)
          .map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-right transition ${
                selected.has(product.id)
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black">{product.title}</span>
                <span className="block text-[11px] opacity-70">{product.price} درهم</span>
              </span>
            </button>
          ))}
      </div>
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
  return (
    <div className="space-y-4">
      <Field label="العنوان">
        <TextInput value={settings.title} onChange={(title) => onChange({ title })} />
      </Field>
      <Field label="الوصف">
        <TextArea value={settings.description} onChange={(description) => onChange({ description })} rows={5} />
      </Field>
      <Field label="الصورة">
        <TextInput value={settings.imageUrl} onChange={(imageUrl) => onChange({ imageUrl })} dir="ltr" />
      </Field>
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
