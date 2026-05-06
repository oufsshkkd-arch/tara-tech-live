import { CheckCircle2, MessageCircle, ShieldCheck, Star, Truck } from "lucide-react";
import type { ReactNode } from "react";
import type {
  AnnouncementThemeSettings,
  CategoriesThemeSettings,
  FeaturedThemeSettings,
  FooterThemeSettings,
  GenericThemeSettings,
  HeroFeaturedProductsSettings,
  HeroThemeSettings,
  Product,
  StoryThemeSettings,
  TrustThemeSettings,
} from "../../cms/types";
import Faq from "../../components/Faq";
import HeroRevolut from "../../components/HeroRevolut";
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
  children,
}: {
  section: EditorSection;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-slate-100 bg-white px-5 py-8 sm:px-8">
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
          {previewPage === "product" && <ProductPagePreview products={products} isMobile={isMobile} />}
          {previewPage === "collection" && <CollectionPagePreview products={products} isMobile={isMobile} />}
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
                {(section.type === "hero" || section.type === "hero_revolut") && (
                  <HeroRevolut
                    settings={section.settings as HeroThemeSettings}
                    products={products}
                    blocks={section.blocks ?? []}
                    mode="preview"
                    isMobile={isMobile}
                  />
                )}
                {section.type === "announcementBar" && (
                  <AnnouncementPreview section={section} settings={section.settings as AnnouncementThemeSettings} />
                )}
                {section.type === "categories" && (
                  <CategoriesPreview section={section} settings={section.settings as CategoriesThemeSettings} isMobile={isMobile} />
                )}
                {(section.type === "featured" || section.type === "bestSellers") && (
                  <FeaturedPreview
                    section={section}
                    settings={section.settings as FeaturedThemeSettings}
                    products={products}
                    isMobile={isMobile}
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
                {section.type === "faq" && <Faq />}
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
    "product.description": product?.shortDescription ?? "",
    "collection.image": image,
    "store.whatsapp": "WhatsApp",
    "store.name": "Tara Tech",
    "{{ product.title }}": product?.title ?? "",
    "{{ product.name }}": product?.title ?? "",
    "{{ product.price }}": product ? `${product.price} درهم` : "",
    "{{ product.compareAtPrice }}": product?.compareAtPrice ? `${product.compareAtPrice} درهم` : "",
    "{{ product.oldPrice }}": product?.compareAtPrice ? `${product.compareAtPrice} درهم` : "",
    "{{ product.image }}": image,
    "{{ product.rating }}": "★★★★★",
    "{{ product.stock }}": product?.stock ?? "",
    "{{ product.description }}": product?.shortDescription ?? "",
    "{{ product.codBadge }}": product?.codNote ?? "الدفع عند الاستلام",
    "{{ collection.title }}": "Collection",
    "{{ collection.image }}": image,
    "{{ page.title }}": "Page",
    "{{ shop.whatsapp }}": "WhatsApp",
    "{{ store.whatsapp }}": "WhatsApp",
    "{{ store.name }}": "Tara Tech",
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

function assetUrl(asset: { url?: string } | null | undefined) {
  return asset?.url ?? "";
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

function HeroPreview({
  section,
  settings,
  products,
  isMobile,
}: {
  section: EditorSection;
  settings: HeroThemeSettings;
  products: Product[];
  isMobile: boolean;
}) {
  const product = products.find((item) => !item.hidden);
  const imageMedia =
    (isMobile && assetUrl(settings.media?.mobileImage)) ||
    assetUrl(settings.media?.image) ||
    (isMobile && settings.mobileImageUrl) ||
    settings.imageUrl ||
    assetUrl(settings.media?.poster) ||
    settings.posterUrl;
  const videoMedia = assetUrl(settings.media?.video) || settings.videoUrl;
  const posterMedia = assetUrl(settings.media?.poster) || settings.posterUrl || imageMedia;
  const media = resolveDynamic(imageMedia, product);
  const alignClass =
    settings.textAlign === "center"
      ? "items-center text-center"
      : settings.textAlign === "left"
        ? "items-start text-left"
        : "items-end text-right";
  const bgClass =
    settings.backgroundStyle === "gradient"
      ? "bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_35%),linear-gradient(135deg,#0f172a,#1e293b)] text-white"
      : settings.backgroundStyle === "glass"
        ? "bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_28%),linear-gradient(135deg,#020617,#172554)] text-white"
      : settings.backgroundStyle === "dark"
        ? "bg-slate-950 text-white"
        : "bg-slate-50 text-slate-950";
  const heroBlocks = section.blocks?.filter((block) => block.enabled) ?? [];

  return (
    <section
      className={`relative overflow-hidden px-6 sm:px-10 ${bgClass}`}
      style={{
        minHeight: settings.sectionHeight ? `${settings.sectionHeight}px` : undefined,
        paddingTop: settings.spacing ? `${settings.spacing}px` : undefined,
        paddingBottom: settings.spacing ? `${settings.spacing}px` : undefined,
      }}
    >
      <div className={`grid items-center gap-8 ${settings.mediaPosition === "top" ? "" : "md:grid-cols-2"}`}>
        <div className={`flex flex-col gap-4 ${alignClass} ${settings.mediaPosition === "left" ? "md:order-2" : ""}`}>
          {settings.badgeText && (
            <span
              className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black ring-1 ring-white/20"
              style={{ color: settings.subtitleColor }}
            >
              {resolveDynamic(settings.badgeText, product)}
            </span>
          )}
          <h2
            className="max-w-xl font-black leading-tight tracking-tight"
            style={{
              color: settings.titleColor,
              fontSize: `${isMobile ? settings.titleFontSize?.mobile ?? 36 : settings.titleFontSize?.desktop ?? 64}px`,
            }}
          >
            {resolveDynamic(settings.title, product)}
          </h2>
          <p
            className="max-w-lg leading-7 opacity-80"
            style={{
              color: settings.subtitleColor,
              fontSize: `${isMobile ? settings.subtitleFontSize?.mobile ?? 14 : settings.subtitleFontSize?.desktop ?? 18}px`,
            }}
          >
            {resolveDynamic(settings.subtitle, product)}
          </p>
          <div className="flex flex-wrap gap-2">
            <span
              className="rounded-full px-5 py-2.5 text-xs font-black text-white shadow-lg"
              style={{ backgroundColor: settings.accentColor || "var(--preview-primary)" }}
            >
              {resolveDynamic(settings.primaryCtaText, product)}
            </span>
            <span className="rounded-full border border-current/20 px-5 py-2.5 text-xs font-black">
              {resolveDynamic(settings.secondaryCtaText, product)}
            </span>
          </div>
        </div>
        <div
          className="relative aspect-[4/5] overflow-hidden bg-white/10 shadow-2xl"
          style={{ borderRadius: `${settings.borderRadius ?? 32}px` }}
        >
          {settings.enableVideo && videoMedia ? (
            <video
              key={videoMedia}
              muted
              autoPlay
              loop
              playsInline
              webkit-playsinline="true"
              poster={posterMedia || media}
              className="h-full w-full object-cover"
            >
              <source src={videoMedia} type="video/mp4" />
            </video>
          ) : media ? (
            <img src={media} alt="" className="h-full w-full object-cover" />
          ) : (
            <EmptyMedia label="Hero media from CMS" />
          )}
        </div>
      </div>
      {settings.enableHeroProducts !== false &&
        heroBlocks
          .filter((block) => block.type === "featured_products_strip")
          .map((block) => (
            <HeroProductsStrip
              key={block.id}
              settings={block.settings as unknown as HeroFeaturedProductsSettings}
              products={products}
              isMobile={isMobile}
            />
          ))}
    </section>
  );
}

function HeroProductsStrip({
  settings,
  products,
  isMobile,
}: {
  settings: HeroFeaturedProductsSettings;
  products: Product[];
  isMobile: boolean;
}) {
  const limit = settings.productLimit || 3;
  const selectedProducts =
    settings.selectionMode === "manual"
      ? settings.selectedProductIds
          .map((id) => products.find((product) => product.id === id && !product.hidden))
          .filter(Boolean) as Product[]
      : products.filter((product) => !product.hidden && (!settings.collectionId || product.categoryId === settings.collectionId));
  const visibleProducts = selectedProducts.slice(0, limit);

  if (visibleProducts.length === 0) {
    return (
      <div className="mt-10 rounded-[2rem] border border-dashed border-white/20 bg-white/5 p-5 text-center text-xs font-black text-white/50">
        اختار 3 منتجات من Theme Editor باش يبان Hero Products Strip
      </div>
    );
  }

  const cols = isMobile ? 1 : visibleProducts.length === 3 ? 3 : 2;

  return (
    <div
      className="mt-10 grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, color: settings.textColor || "inherit" }}
    >
      {visibleProducts.map((product) => (
        <div
          key={product.id}
          className={`group overflow-hidden border p-3 shadow-2xl transition ${
            settings.cardStyle === "glass"
              ? "border-white/15 bg-white/10 backdrop-blur"
              : settings.cardStyle === "minimal"
                ? "border-white/10 bg-transparent"
                : "border-white/15 bg-white/95 text-slate-950"
          }`}
          style={{ borderRadius: `${settings.cardStyle === "compact" ? 20 : 30}px` }}
        >
          {settings.showImage && (
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              ) : (
                <EmptyMedia label="Product media" />
              )}
            </div>
          )}
          <div className="space-y-2 p-2">
            {settings.showBadge && (
              <span
                className="inline-flex rounded-full px-2 py-1 text-[10px] font-black text-white"
                style={{ backgroundColor: settings.badgeColor || "var(--preview-primary)" }}
              >
                {settings.badgeText || product.badge || "COD"}
              </span>
            )}
            {settings.showTitle && <div className="line-clamp-2 text-sm font-black">{product.title}</div>}
            {settings.showRating && <div className="text-xs text-amber-400">★★★★★</div>}
            {settings.showPrice && (
              <div className="flex items-center gap-2 text-sm font-black" style={{ color: settings.priceColor }}>
                <span>{product.price} درهم</span>
                {settings.showOldPrice && product.compareAtPrice && (
                  <span className="text-xs opacity-50 line-through">{product.compareAtPrice} درهم</span>
                )}
              </div>
            )}
            {settings.showCTA && (
              <span className="inline-flex rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-black text-white">
                شوف المنتج
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductPagePreview({ products, isMobile }: { products: Product[]; isMobile: boolean }) {
  const product = products.find((item) => !item.hidden) ?? products[0];
  if (!product) return null;

  return (
    <section className="bg-white px-5 py-8 sm:px-8">
      <div className="grid gap-6" style={{ gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
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

function CollectionPagePreview({ products, isMobile }: { products: Product[]; isMobile: boolean }) {
  const visible = products.filter((item) => !item.hidden).slice(0, 6);
  const cols = isMobile ? 2 : 3;

  return (
    <section className="bg-white px-5 py-8 sm:px-8">
      <h2 className="mb-2 text-4xl font-black">Collection page</h2>
      <p className="mb-6 text-sm text-slate-500">منتجات مختارة بنظام الدفع عند الاستلام.</p>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
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
  isMobile,
}: {
  section: EditorSection;
  settings: CategoriesThemeSettings;
  isMobile: boolean;
}) {
  const enabled = settings.categories.filter((category) => category.enabled);
  const cols = isMobile ? 2 : Math.min(4, Math.max(2, enabled.length));

  return (
    <SectionShell section={section}>
      <h3 className="mb-6 text-3xl font-black">{settings.title}</h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {enabled.map((category) => (
          <div key={category.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
            <div className="aspect-[4/5] bg-slate-100">
              {category.image ? (
                <img src={category.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <EmptyMedia label={category.name} />
              )}
            </div>
            <div className="truncate p-3 text-sm font-black">{category.name}</div>
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
  isMobile,
}: {
  section: EditorSection;
  settings: FeaturedThemeSettings;
  products: Product[];
  isMobile: boolean;
}) {
  const selected = products.filter((product) => settings.productIds.includes(product.id) && !product.hidden);
  const cols = isMobile ? 2 : 4;

  return (
    <SectionShell section={section}>
      <h3 className="mb-6 text-3xl font-black">{settings.title}</h3>
      <div
        className={settings.layout === "carousel" ? "grid grid-flow-col gap-3 overflow-hidden" : "grid gap-3"}
        style={
          settings.layout === "carousel"
            ? { gridAutoColumns: "220px" }
            : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
        }
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
