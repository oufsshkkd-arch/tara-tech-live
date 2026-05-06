import { CheckCircle2, MessageCircle, ShieldCheck, Star, Truck } from "lucide-react";
import type { ReactNode } from "react";
import type {
  AnnouncementThemeSettings,
  CategoriesThemeSettings,
  FaqThemeSettings,
  FeaturedThemeSettings,
  FooterThemeSettings,
  GenericThemeSettings,
  HeroThemeSettings,
  Product,
  StoryThemeSettings,
  TrustThemeSettings,
} from "../../cms/types";
import { SECTION_META } from "./themeConfig";
import type { DeviceMode, EditorSection, PreviewPage, ThemeConfig } from "./types";

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
  previewPage,
  refreshKey,
  selectedSectionId,
  onSelectSection,
}: {
  config: ThemeConfig;
  products: Product[];
  device: DeviceMode;
  previewPage: PreviewPage;
  refreshKey: number;
  selectedSectionId: string;
  onSelectSection: (sectionId: EditorSection["id"]) => void;
}) {
  const isMobile = device === "mobile";
  const radius = config.theme.radius === "small" ? "18px" : config.theme.radius === "medium" ? "26px" : "34px";
  const shadow =
    config.theme.shadowStyle === "none"
      ? "none"
      : config.theme.shadowStyle === "deep"
        ? "0 30px 80px rgba(15, 23, 42, 0.25)"
        : "0 18px 50px rgba(15, 23, 42, 0.14)";
  const templateSections =
    previewPage === "home"
      ? config.sections
      : (config.templates?.[previewPage]?.sections ?? []);
  const pageSections =
    previewPage === "home"
      ? templateSections
      : templateSections.length
        ? templateSections
      : config.sections.filter((section) => {
          if (previewPage === "faq") return section.type === "faq" || section.type === "footer";
          return section.type === "announcementBar" || section.type === "footer";
        });

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
          key={`${refreshKey}-${previewPage}`}
          className={`overflow-hidden bg-white font-sans text-slate-950 shadow-xl ${
            isMobile ? "max-h-[760px] overflow-y-auto rounded-[30px]" : "rounded-[28px] border border-white"
          }`}
          dir={config.theme.direction}
          style={{
            fontFamily: `${config.theme.bodyFontFamily || config.theme.fontFamily}, Cairo, Tajawal, sans-serif`,
            ["--preview-primary" as string]: config.theme.primaryColor,
            ["--preview-accent" as string]: config.theme.secondaryColor || config.theme.primaryColor,
            ["--preview-bg" as string]: config.theme.backgroundColor || "#ffffff",
            ["--preview-text" as string]: config.theme.textColor || "#0f172a",
            borderRadius: isMobile ? "30px" : radius,
            boxShadow: shadow,
          }}
        >
          <PreviewHeader config={config} previewPage={previewPage} />
          {previewPage === "product" && <ProductPagePreview products={products} />}
          {previewPage === "collection" && <CollectionPagePreview products={products} />}
          {previewPage === "cart" && <CartPreview products={products} />}
          {pageSections.map((section) => {
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
                  <HeroPreview settings={section.settings as HeroThemeSettings} products={products} isMobile={isMobile} />
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
                {section.type === "codBenefits" && (
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
                {["header", "productHighlight", "reviews", "whatsappCta"].includes(section.type) && (
                  <GenericPreview section={section} settings={section.settings as GenericThemeSettings} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function resolveDynamic(value: unknown, product?: Product) {
  const image = product?.images?.[0] ?? "";
  const sources: Record<string, string> = {
    "product.name": product?.title ?? "",
    "product.oldPrice": product?.compareAtPrice ? `${product.compareAtPrice} درهم` : "",
    "collection.image": image,
    "store.whatsapp": "WhatsApp",
    "{{ product.title }}": product?.title ?? "",
    "{{ product.name }}": product?.title ?? "",
    "{{ product.price }}": product ? `${product.price} درهم` : "",
    "{{ product.compareAtPrice }}": product?.compareAtPrice ? `${product.compareAtPrice} درهم` : "",
    "{{ product.oldPrice }}": product?.compareAtPrice ? `${product.compareAtPrice} درهم` : "",
    "{{ product.image }}": image,
    "{{ product.rating }}": "★★★★★",
    "{{ product.stock }}": product?.stock ?? "",
    "{{ product.codBadge }}": product?.codNote ?? "الدفع عند الاستلام",
    "{{ collection.title }}": "Collection",
    "{{ collection.image }}": image,
    "{{ page.title }}": "Page",
    "{{ shop.whatsapp }}": "WhatsApp",
    "{{ store.whatsapp }}": "WhatsApp",
    "{{ custom.metafield }}": "",
  };

  if (value && typeof value === "object" && "type" in value && (value as { type?: string }).type === "dynamic") {
    const dynamic = value as { source?: string; fallback?: string };
    return sources[dynamic.source ?? ""] || dynamic.fallback || "";
  }

  const text = typeof value === "string" ? value : String(value ?? "");

  return Object.entries(sources).reduce(
    (resolved, [token, sourceValue]) => resolved.split(token).join(sourceValue),
    text,
  );
}

function PreviewHeader({ config, previewPage }: { config: ThemeConfig; previewPage: PreviewPage }) {
  const footer = config.sections.find((section) => section.type === "footer");
  const footerSettings = footer?.settings as FooterThemeSettings | undefined;
  const logoText = footerSettings?.logoText || "Store";

  return (
    <div
      className={`flex items-center justify-between border-b border-slate-100 px-5 py-3 ${
        config.theme.headerStyle === "transparent" ? "bg-white/55 backdrop-blur" : "bg-white"
      }`}
    >
      <div className="text-sm font-black text-[var(--preview-text)]">{logoText}</div>
      <div className="hidden items-center gap-4 text-[11px] font-bold text-slate-500 sm:flex">
        <span>{previewPage}</span>
        <span>COD Morocco</span>
        <span>WhatsApp</span>
      </div>
      <span className="rounded-full bg-[var(--preview-accent)] px-3 py-1 text-[11px] font-black text-white">
        سلة
      </span>
    </div>
  );
}

function HeroPreview({ settings, products, isMobile }: { settings: HeroThemeSettings; products: Product[]; isMobile: boolean }) {
  const product = products[0];
  const media = resolveDynamic((isMobile && settings.mobileImageUrl) || settings.imageUrl || settings.posterUrl, product);
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
              {resolveDynamic(settings.badgeText, product)}
            </span>
          )}
          <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {resolveDynamic(settings.title, product)}
          </h2>
          <p className="max-w-lg text-sm leading-7 opacity-75">{resolveDynamic(settings.subtitle, product)}</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--preview-primary)] px-5 py-2.5 text-xs font-black text-white">
              {resolveDynamic(settings.primaryCtaText, product)}
            </span>
            <span className="rounded-full border border-current/20 px-5 py-2.5 text-xs font-black">
              {resolveDynamic(settings.secondaryCtaText, product)}
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
              webkit-playsinline="true"
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

function ProductPagePreview({ products }: { products: Product[] }) {
  const product = products.find((item) => !item.hidden) ?? products[0];
  if (!product) return null;

  return (
    <section className="bg-white px-5 py-8 sm:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-[2rem] bg-slate-100">
          {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            الدفع عند الاستلام
          </span>
          <h2 className="text-4xl font-black leading-tight">{product.title}</h2>
          <p className="text-sm leading-7 text-slate-600">{product.shortDescription}</p>
          <div className="text-3xl font-black">{product.price} درهم</div>
          <button className="rounded-full bg-[var(--preview-primary)] px-6 py-3 text-sm font-black text-white">
            أضف للسلة
          </button>
        </div>
      </div>
    </section>
  );
}

function CollectionPagePreview({ products }: { products: Product[] }) {
  const visible = products.filter((item) => !item.hidden).slice(0, 6);
  return (
    <section className="bg-white px-5 py-8 sm:px-8">
      <h2 className="mb-2 text-4xl font-black">Collection page</h2>
      <p className="mb-6 text-sm text-slate-500">منتجات مختارة بنظام الدفع عند الاستلام.</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {visible.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="aspect-square bg-slate-100">
              {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="p-3">
              <div className="line-clamp-2 text-sm font-black">{product.title}</div>
              <div className="mt-1 text-xs font-bold text-slate-500">{product.price} درهم</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CartPreview({ products }: { products: Product[] }) {
  const items = products.filter((item) => !item.hidden).slice(0, 2);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return (
    <section className="bg-slate-50 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-2xl font-black">Cart drawer</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                {item.images?.[0] && <img src={item.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-black">{item.title}</div>
                <div className="text-xs text-slate-500">{item.price} درهم</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-black">
          <span>Total</span>
          <span>{total} درهم</span>
        </div>
        <button className="mt-4 w-full rounded-full bg-[var(--preview-primary)] px-5 py-3 text-sm font-black text-white">
          Checkout COD
        </button>
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

function GenericPreview({ section, settings }: { section: EditorSection; settings: GenericThemeSettings }) {
  const hasMedia = Boolean(settings.imageUrl || settings.videoUrl);

  return (
    <SectionShell section={section}>
      <div
        className="rounded-[2rem] p-6"
        style={{
          backgroundColor: settings.backgroundColor || "var(--preview-bg)",
          color: settings.textColor || "var(--preview-text)",
        }}
      >
        <div className={`grid items-center gap-6 ${hasMedia ? "md:grid-cols-2" : ""}`}>
          <div>
            <h3 className="text-3xl font-black">{resolveDynamic(settings.title)}</h3>
            {settings.subtitle && (
              <p className="mt-3 text-sm leading-7 opacity-70">{resolveDynamic(settings.subtitle)}</p>
            )}
          </div>
          {hasMedia && (
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-100">
              {settings.videoUrl ? (
                <video
                  key={settings.videoUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                  webkit-playsinline="true"
                  className="h-full w-full object-cover"
                >
                  <source src={settings.videoUrl} type="video/mp4" />
                </video>
              ) : settings.imageUrl ? (
                <img src={settings.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <EmptyMedia label="CMS media" />
              )}
            </div>
          )}
        </div>
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
