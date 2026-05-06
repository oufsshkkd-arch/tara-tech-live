import { CheckCircle2, MessageCircle, ShieldCheck, Star, Truck } from "lucide-react";
import type { ReactNode } from "react";
import type {
  AnnouncementThemeSettings,
  CategoriesThemeSettings,
  FaqThemeSettings,
  FeaturedThemeSettings,
  FooterThemeSettings,
  HeroThemeSettings,
  Product,
  StoryThemeSettings,
  TrustThemeSettings,
} from "../../cms/types";
import { SECTION_META } from "./themeConfig";
import type { DeviceMode, EditorSection, ThemeConfig } from "./types";

const previewWidth: Record<DeviceMode, string> = {
  desktop: "1120px",
  tablet: "760px",
  mobile: "390px",
};

function EmptyMedia({ label = "Media" }: { label?: string }) {
  return (
    <div className="grid h-full min-h-[180px] place-items-center rounded-[inherit] bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-black text-slate-400">
      {label}
    </div>
  );
}

function SectionShell({
  section,
  children,
}: {
  section: EditorSection;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-slate-100 bg-white px-5 py-8 sm:px-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black text-slate-500">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-950 text-[10px] text-white">
          {SECTION_META[section.type].badge}
        </span>
        {SECTION_META[section.type].label}
      </div>
      {children}
    </section>
  );
}

export default function StorefrontPreview({
  config,
  products,
  device,
  selectedSectionId,
  onSelectSection,
}: {
  config: ThemeConfig;
  products: Product[];
  device: DeviceMode;
  selectedSectionId: string;
  onSelectSection: (sectionId: EditorSection["id"]) => void;
}) {
  const isMobile = device === "mobile";

  return (
    <main className="min-w-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_top,#e2e8f0,transparent_35%),#eef2f7] p-5">
      <div
        className={`mx-auto transition-all duration-300 ${
          isMobile ? "rounded-[42px] border-[10px] border-slate-950 bg-slate-950 p-2 shadow-2xl" : ""
        }`}
        style={{ width: previewWidth[device], maxWidth: "100%" }}
      >
        {isMobile && <div className="mx-auto mb-2 h-1 w-16 rounded-full bg-slate-700" />}

        <div
          className={`overflow-hidden bg-white font-sans text-slate-950 shadow-xl ${
            isMobile ? "max-h-[760px] overflow-y-auto rounded-[30px]" : "rounded-[28px] border border-white"
          }`}
          dir={config.theme.direction}
          style={{
            fontFamily: `${config.theme.fontFamily}, Cairo, Tajawal, sans-serif`,
            ["--preview-primary" as string]: config.theme.primaryColor,
          }}
        >
          {config.sections.map((section) => {
            if (!section.enabled) return null;
            const selected = selectedSectionId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelectSection(section.id)}
                className={`block w-full text-right transition ${
                  selected ? "outline outline-2 outline-offset-[-2px] outline-blue-500" : "hover:outline hover:outline-1 hover:outline-slate-200"
                }`}
              >
                {section.type === "hero" && (
                  <HeroPreview settings={section.settings as HeroThemeSettings} isMobile={isMobile} />
                )}
                {section.type === "announcementBar" && (
                  <AnnouncementPreview section={section} settings={section.settings as AnnouncementThemeSettings} />
                )}
                {section.type === "categories" && (
                  <CategoriesPreview section={section} settings={section.settings as CategoriesThemeSettings} />
                )}
                {section.type === "featured" && (
                  <FeaturedPreview
                    section={section}
                    settings={section.settings as FeaturedThemeSettings}
                    products={products}
                  />
                )}
                {section.type === "trustStrip" && (
                  <TrustPreview section={section} settings={section.settings as TrustThemeSettings} />
                )}
                {section.type === "story" && (
                  <StoryPreview section={section} settings={section.settings as StoryThemeSettings} />
                )}
                {section.type === "faq" && (
                  <FaqPreview section={section} settings={section.settings as FaqThemeSettings} />
                )}
                {section.type === "footer" && (
                  <FooterPreview section={section} settings={section.settings as FooterThemeSettings} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function HeroPreview({ settings, isMobile }: { settings: HeroThemeSettings; isMobile: boolean }) {
  const media = (isMobile && settings.mobileImageUrl) || settings.imageUrl || settings.posterUrl;
  const alignClass =
    settings.textAlign === "center"
      ? "items-center text-center"
      : settings.textAlign === "left"
        ? "items-start text-left"
        : "items-end text-right";
  const bgClass =
    settings.backgroundStyle === "gradient"
      ? "bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_35%),linear-gradient(135deg,#0f172a,#1e293b)] text-white"
      : settings.backgroundStyle === "dark"
        ? "bg-slate-950 text-white"
        : "bg-slate-50 text-slate-950";

  return (
    <section className={`relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14 ${bgClass}`}>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className={`flex flex-col gap-4 ${alignClass}`}>
          {settings.badgeText && (
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black ring-1 ring-white/20">
              {settings.badgeText}
            </span>
          )}
          <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {settings.title}
          </h2>
          <p className="max-w-lg text-sm leading-7 opacity-75">{settings.subtitle}</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--preview-primary)] px-5 py-2.5 text-xs font-black text-white">
              {settings.primaryCtaText}
            </span>
            <span className="rounded-full border border-current/20 px-5 py-2.5 text-xs font-black">
              {settings.secondaryCtaText}
            </span>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white/10 shadow-2xl">
          {settings.videoUrl ? (
            <video
              key={settings.videoUrl}
              muted
              autoPlay
              loop
              playsInline
              poster={settings.posterUrl || media}
              className="h-full w-full object-cover"
            >
              <source src={settings.videoUrl} type="video/mp4" />
            </video>
          ) : media ? (
            <img src={media} alt="" className="h-full w-full object-cover" />
          ) : (
            <EmptyMedia label="Hero media from CMS" />
          )}
        </div>
      </div>
    </section>
  );
}

function AnnouncementPreview({
  section,
  settings,
}: {
  section: EditorSection;
  settings: AnnouncementThemeSettings;
}) {
  return (
    <SectionShell section={section}>
      <div
        className="rounded-2xl px-4 py-3 text-center text-sm font-black shadow-sm"
        style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
      >
        {settings.text || "Announcement text"}
      </div>
    </SectionShell>
  );
}

function CategoriesPreview({
  section,
  settings,
}: {
  section: EditorSection;
  settings: CategoriesThemeSettings;
}) {
  return (
    <SectionShell section={section}>
      <h3 className="mb-6 text-3xl font-black">{settings.title}</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {settings.categories
          .filter((category) => category.enabled)
          .map((category) => (
            <div key={category.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
              <div className="aspect-[4/5] bg-slate-100">
                {category.image ? (
                  <img src={category.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <EmptyMedia label={category.name} />
                )}
              </div>
              <div className="p-3 text-sm font-black">{category.name}</div>
            </div>
          ))}
      </div>
    </SectionShell>
  );
}

function FeaturedPreview({
  section,
  settings,
  products,
}: {
  section: EditorSection;
  settings: FeaturedThemeSettings;
  products: Product[];
}) {
  const selected = products.filter((product) => settings.productIds.includes(product.id) && !product.hidden);

  return (
    <SectionShell section={section}>
      <h3 className="mb-6 text-3xl font-black">{settings.title}</h3>
      <div
        className={`grid gap-3 ${
          settings.layout === "carousel"
            ? "grid-flow-col auto-cols-[220px] overflow-hidden"
            : "grid-cols-2 md:grid-cols-4"
        }`}
      >
        {selected.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="aspect-square bg-slate-100">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <EmptyMedia label="Product" />
              )}
            </div>
            <div className="space-y-2 p-3">
              {settings.showDiscountBadge && product.compareAtPrice && (
                <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-red-700">
                  تخفيض
                </span>
              )}
              <div className="line-clamp-2 text-sm font-black">{product.title}</div>
              {settings.showRating && (
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} className="h-3 w-3 fill-current" />
                  ))}
                </div>
              )}
              {settings.showPrice && <div className="text-sm font-black">{product.price} درهم</div>}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function TrustPreview({ section, settings }: { section: EditorSection; settings: TrustThemeSettings }) {
  return (
    <SectionShell section={section}>
      <div className="grid gap-3 md:grid-cols-4">
        {settings.items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600" />
            <div className="text-sm font-black">{item.title}</div>
            <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function StoryPreview({ section, settings }: { section: EditorSection; settings: StoryThemeSettings }) {
  return (
    <SectionShell section={section}>
      <div className="grid items-center gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-3xl font-black">{settings.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">{settings.description}</p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-100">
          {settings.imageUrl ? (
            <img src={settings.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <EmptyMedia label="Story image" />
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function FaqPreview({ section, settings }: { section: EditorSection; settings: FaqThemeSettings }) {
  return (
    <SectionShell section={section}>
      <h3 className="mb-5 text-3xl font-black">الأسئلة الشائعة</h3>
      <div className="space-y-3">
        {settings.items
          .filter((item) => item.enabled)
          .map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="font-black">{item.question}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </div>
          ))}
      </div>
    </SectionShell>
  );
}

function FooterPreview({ section, settings }: { section: EditorSection; settings: FooterThemeSettings }) {
  return (
    <SectionShell section={section}>
      <footer className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-2xl font-black">{settings.logoText}</div>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/65">{settings.description}</p>
          </div>
          <div className="space-y-2 text-sm text-white/75">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {settings.contactWhatsApp}
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              COD Morocco
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Verified products
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/50">{settings.copyrightText}</div>
      </footer>
    </SectionShell>
  );
}
