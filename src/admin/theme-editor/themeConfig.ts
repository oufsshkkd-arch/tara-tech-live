import { loadCmsState as loadSupabaseCmsState, saveCmsState as saveSupabaseCmsState } from "../../lib/db";
import type {
  Category,
  CmsState,
  FaqItem,
  GenericThemeSettings,
  HeroFeaturedProductsSettings,
  HeroThemeMedia,
  StorefrontThemeConfig,
  ThemeEditorSection,
  ThemeEditorBlock,
  ThemeEditorSectionSettingsMap,
  ThemeEditorSectionType,
  ThemeTemplateId,
} from "../../cms/types";

export const SECTION_TYPES: ThemeEditorSectionType[] = [
  "header",
  "announcementBar",
  "hero_revolut",
  "trustMarquee",
  "revolutBenefits",
  "categories",
  "featured",
  "bestSellers",
  "productHighlight",
  "trustStrip",
  "codBenefits",
  "reviews",
  "story",
  "whyTara",
  "faq",
  "finalCta",
  "whatsappCta",
  "footer",
];

export const SECTION_META: Record<
  ThemeEditorSectionType,
  { label: string; badge: string; description: string }
> = {
  header: { label: "الهيدر", badge: "N", description: "Logo، navigation، cart/search" },
  hero: { label: "Hero Legacy", badge: "H", description: "Legacy hero migrated to Hero Revolut" },
  hero_revolut: { label: "Hero Revolut", badge: "HR", description: "Premium hero with media + 3 products strip" },
  announcementBar: { label: "شريط الإعلان", badge: "A", description: "رسالة قصيرة أعلى الموقع" },
  categories: { label: "الفئات", badge: "C", description: "بطاقات التصنيفات الرئيسية" },
  featured: { label: "منتجات مختارة", badge: "P", description: "اختيار المنتجات وطريقة العرض" },
  bestSellers: { label: "الأكثر مبيعاً", badge: "B", description: "Best sellers grid for COD products" },
  productHighlight: { label: "Product Card Hero", badge: "PH", description: "منتج بارز مع COD CTA" },
  trustStrip: { label: "شريط الثقة", badge: "T", description: "COD، ضمان، دعم وخدمة" },
  codBenefits: { label: "مزايا COD", badge: "COD", description: "الدفع عند الاستلام والثقة" },
  reviews: { label: "آراء الزبناء", badge: "R", description: "Reviews وشهادات اجتماعية" },
  story: { label: "القصة", badge: "S", description: "About / Story section" },
  whyTara: { label: "علاش حنا", badge: "Wت", description: "نقاط القوة والميزات" },
  faq: { label: "الأسئلة", badge: "Q", description: "أسئلة وأجوبة قابلة للتفعيل" },
  finalCta: { label: "CTA النهائي", badge: "FC", description: "دعوة للعمل فـ آخر الصفحة" },
  whatsappCta: { label: "WhatsApp CTA", badge: "W", description: "دعوة مباشرة للتواصل" },
  trustMarquee: { label: "شريط الثقة", badge: "TM", description: "شريط متحرك ديال الثقة" },
  revolutBenefits: { label: "بطاقات المزايا", badge: "RB", description: "Revolut-style benefit cards" },
  footer: { label: "الفوتر", badge: "F", description: "الشعار، السوشيال والتواصل" },
};

const PUBLIC_SECTION_IDS: Partial<Record<ThemeEditorSectionType, string>> = {
  hero: "hero",
  hero_revolut: "hero",
  trustMarquee: "hero",
  revolutBenefits: "hero",
  categories: "categories",
  featured: "featured",
  trustStrip: "trustStrip",
  story: "story",
  whyTara: "why",
  faq: "faq",
  finalCta: "finalCta",
};

const TEMPLATE_IDS: ThemeTemplateId[] = ["home", "product", "collection", "cart", "faq"];

function isSectionType(value: unknown): value is ThemeEditorSectionType {
  return typeof value === "string" && SECTION_TYPES.includes(value as ThemeEditorSectionType);
}

function byOrder<T extends { order?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function section<T extends ThemeEditorSectionType>(
  type: T,
  enabled: boolean,
  order: number,
  settings: ThemeEditorSectionSettingsMap[T],
): ThemeEditorSection<T> {
  return { id: type, type, enabled, order, settings, blocks: [] };
}

function genericSettings(title: string, subtitle = ""): GenericThemeSettings {
  return {
    title,
    subtitle,
    imageUrl: "",
    videoUrl: "",
    backgroundColor: "",
    textColor: "",
    accentColor: "",
    spacing: 64,
    radius: 24,
  };
}

function slugify(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function slugFromLink(link: string, fallback: string) {
  const clean = link.trim().split("?")[0].replace(/\/$/, "");
  const last = clean.split("/").filter(Boolean).pop();
  return slugify(last || fallback, fallback);
}

function firstAnnouncementText(state: CmsState) {
  return byOrder(state.announcementBar.messages)[0]?.text ?? "";
}

function firstAnnouncementId(state: CmsState) {
  return byOrder(state.announcementBar.messages)[0]?.id ?? "announcement-main";
}

function firstProductImage(state: CmsState) {
  return state.products.find((product) => product.images?.[0])?.images[0] ?? "";
}

function mediaFromUrl(url: string | undefined, alt: string) {
  if (!url) return null;
  return {
    type: "external" as const,
    url,
    alt,
    mimeType: /\.(mp4|webm|mov)$/i.test(url) ? "video/mp4" : "image/webp",
  };
}

function mediaUrl(media: HeroThemeMedia | undefined, key: keyof HeroThemeMedia, fallback = "") {
  return media?.[key]?.url || fallback;
}

function heroFeaturedProductsBlock(productIds: string[]): ThemeEditorBlock {
  const settings: HeroFeaturedProductsSettings = {
    selectionMode: "manual",
    selectedProductIds: productIds.slice(0, 3),
    collectionId: null,
    productLimit: 3,
    showImage: true,
    showTitle: true,
    showPrice: true,
    showOldPrice: true,
    showRating: true,
    showBadge: true,
    showCTA: true,
    cardStyle: "premium",
    revealOnScroll: true,
    spacing: 16,
    background: "rgba(255,255,255,0.08)",
    textColor: "#ffffff",
    priceColor: "#ffffff",
    badgeText: "اختيار Tara",
    badgeColor: "#2563eb",
  };

  return {
    id: "hero-featured-products",
    type: "featured_products_strip",
    enabled: true,
    order: 1,
    settings: settings as unknown as Record<string, unknown>,
  };
}

export async function loadCmsState() {
  return loadSupabaseCmsState();
}

export async function saveCmsState(state: unknown) {
  return saveSupabaseCmsState(state);
}

export function createThemeConfigFromCmsState(state: CmsState): StorefrontThemeConfig {
  const visibleProducts = state.products.filter((product) => !product.hidden);
  const featuredProductIds = visibleProducts
    .filter((product) => product.featured)
    .sort((a, b) => a.order - b.order)
    .map((product) => product.id);

  const imageUrl =
    state.hero.imageUrl ||
    (state.hero.mediaType === "image" ? state.hero.videoUrl : "") ||
    firstProductImage(state);

  const heroMedia: HeroThemeMedia = {
    image: mediaFromUrl(imageUrl, state.hero.headline),
    mobileImage: mediaFromUrl(state.hero.mobileImageUrl, state.hero.headline),
    video: mediaFromUrl(state.hero.mediaType === "video" ? state.hero.videoUrl : "", state.hero.headline),
    poster: mediaFromUrl(state.hero.videoPoster, `${state.hero.headline} poster`),
  };

  const homeSections: ThemeEditorSection[] = [
      section("header", true, 1, {
        ...genericSettings(state.brand.logoText, "Navigation, search and cart drawer"),
      }),
      section("announcementBar", state.announcementBar.enabled, 2, {
        enabled: state.announcementBar.enabled,
        text: firstAnnouncementText(state),
        link: state.announcementBar.link || "",
        backgroundColor: state.announcementBar.backgroundColor || "#111111",
        textColor: state.announcementBar.textColor || "#ffffff",
      }),
      {
        ...section("hero_revolut", state.visibility.hero, 3, {
        title: state.hero.headline,
        subtitle: state.hero.subheadline,
        primaryCtaText: state.hero.primaryCta,
        primaryCtaLink: state.hero.primaryCtaLink || "/products",
        secondaryCtaText: state.hero.secondaryCta,
        secondaryCtaLink: state.hero.secondaryCtaLink || "",
        imageUrl,
        mobileImageUrl: state.hero.mobileImageUrl || "",
        videoUrl: state.hero.mediaType === "video" ? state.hero.videoUrl : "",
        posterUrl: state.hero.videoPoster || "",
        badgeText: state.hero.urgencyBadge,
        backgroundStyle: state.hero.backgroundStyle || "dark",
        textAlign: state.hero.textAlign || "right",
        titleFontSize: { desktop: state.hero.titleFontSize || 64, mobile: 36 },
        subtitleFontSize: { desktop: state.hero.subtitleFontSize || 18, mobile: 14 },
        titleColor: state.hero.titleColor || ((state.hero.backgroundStyle || "dark") === "light" ? "#0f172a" : "#ffffff"),
        subtitleColor: state.hero.subtitleColor || ((state.hero.backgroundStyle || "dark") === "light" ? "#475569" : "#cbd5e1"),
        accentColor: state.brand.primaryColor || "#2563eb",
        buttonStyle: "premium",
        sectionHeight: 720,
        spacing: 72,
        borderRadius: 32,
        mediaPosition: "left",
        media: heroMedia,
        enableVideo: state.hero.mediaType === "video",
        enableAnimation: true,
        enableHeroProducts: true,
      }),
      id: "hero-main",
      blocks: [heroFeaturedProductsBlock(featuredProductIds)],
    } as ThemeEditorSection,
      section("categories", state.visibility.categories, 4, {
        title: state.categorySection.title,
        categories: byOrder(state.categories).map((category) => ({
          id: category.id,
          name: category.title,
          image: category.image,
          link: `/categories/${category.slug}`,
          enabled: !category.hidden,
        })),
      }),
      section("featured", state.visibility.featured && state.featuredSection.enabled, 5, {
        title: state.featuredSection.title,
        productIds: featuredProductIds,
        layout: state.featuredSection.layout || "grid",
        showPrice: state.featuredSection.showPrice ?? true,
        showRating: state.featuredSection.showRating ?? true,
        showDiscountBadge: state.featuredSection.showDiscountBadge ?? true,
      }),
      section("bestSellers", true, 6, {
        title: "الأكثر مبيعاً",
        productIds: visibleProducts
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((product) => product.id)
          .slice(0, 8),
        layout: "grid",
        showPrice: true,
        showRating: true,
        showDiscountBadge: true,
      }),
      section("productHighlight", true, 7, {
        ...genericSettings(
          visibleProducts[0]?.title || "منتج مختار",
          visibleProducts[0]?.shortDescription || "منتج COD مختار بعناية",
        ),
        imageUrl: visibleProducts[0]?.images?.[0] || "",
        accentColor: state.brand.ctaColor,
      }),
      section("trustStrip", state.visibility.trustStrip, 8, {
        items: state.trustStrip.map((item) => ({
          icon: item.icon,
          title: item.title,
          description: item.sub,
        })),
      }),
      section("codBenefits", true, 9, {
        items: [
          { icon: "Wallet", title: "الدفع عند الاستلام", description: "خلص غير ملي توصلك السلعة." },
          { icon: "PhoneCall", title: "تأكيد قبل الشحن", description: "كنأكدو الطلب معاك قبل الإرسال." },
          { icon: "Truck", title: "توصيل للمغرب", description: "خدمة مناسبة للتجارة المغربية." },
        ],
      }),
      section("trustMarquee", true, 10, {
        items: state.marqueeItems,
        speed: state.announcementBar.speed || 40,
      }),
      section("revolutBenefits", true, 10.5, {
        cards: [
          {
            id: "rb-1",
            badge: "حياة ذكية",
            title: "تكنولوجيا كتسهل عليك يومك.",
            description: "اختارنا ليك أفضل المنتجات اللي كتزيد من الراحة والتنظيم فدارك وفي حياتك اليومية بطريقة ذكية وعملية.",
            ctaText: "كتشف المزيد",
            ctaLink: "/products",
            image: "https://images.unsplash.com/photo-1584006682522-dc17d6c0d0cb?auto=format&fit=crop&w=800&q=80",
            theme: "light" as const,
          },
          {
            id: "rb-2",
            badge: "جودة ممتازة",
            title: "منتجات مختارة بعناية.",
            description: "الجودة هي الأساس ديالنا. كل منتج داز من تجارب صارمة باش نضمنو ليك تجربة شراء راقية ومضمونة 100%.",
            ctaText: "اطلب دابا",
            ctaLink: "/products",
            image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=800&q=80",
            theme: "dark" as const,
          },
        ],
      }),
      section("reviews", true, 10, {
        ...genericSettings("آراء الزبناء", "ثقة اجتماعية كتعاون الزبون يقرر."),
      }),
      section("story", state.visibility.story, 11, {
        title: state.story.title,
        description: state.story.body,
        imageUrl: state.story.image,
        ctaText: state.story.ctaText || "اقرأ قصتنا",
        ctaLink: state.story.ctaLink || "/notre-histoire",
        pillLabel: state.story.pillLabel || "قصتنا",
        overlayTitle: state.story.overlayTitle || "براند مغربية",
        overlaySub: state.story.overlaySub || "مفكر فيها بعناية · مختارة بذوق",
        valueChips: state.story.valueChips || [
          { label: "مختارة", sub: "تنسيق تحريري" },
          { label: "موثوقة", sub: "ثقة وجودة" },
          { label: "محلية", sub: "خدمة المغرب" },
        ],
      }),
      section("whyTara", state.visibility.why, 12, {
        title: state.why.title,
        intro: state.why.intro,
        pillLabel: state.why.pillLabel || "علاش حنا",
        points: state.why.points.map((text, i) => ({
          text,
          icon: state.why.icons?.[i] || ["Sparkles", "ShieldCheck", "Wallet", "ClipboardCheck", "HeadphonesIcon"][i % 5],
        })),
      }),
      section("faq", state.visibility.faq, 13, {
        items: byOrder(state.faq).map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          enabled: item.enabled !== false,
        })),
      }),
      section("finalCta", state.visibility.finalCta, 14, {
        title: state.finalCta.title,
        body: state.finalCta.body,
        primaryCta: state.finalCta.primaryCta,
        secondaryCta: state.finalCta.secondaryCta,
        primaryCtaLink: state.finalCta.primaryCtaLink || "/products",
        secondaryCtaLink: state.finalCta.secondaryCtaLink || "/contact",
        pillLabel: state.finalCta.pillLabel || "مرحبا فـ Tara Tech",
      }),
      section("whatsappCta", true, 15, {
        ...genericSettings("بغيتي تسول قبل الطلب؟", "تواصل معنا مباشرة فالواتساب."),
        accentColor: "#25D366",
      }),
      section("footer", true, 16, {
        logoText: state.brand.logoText,
        description: state.footer.tagline,
        socialLinks: {
          instagram: state.brand.socials.instagram || "",
          tiktok: state.brand.socials.tiktok || "",
          facebook: state.brand.socials.facebook || "",
        },
        contactWhatsApp: state.brand.whatsapp,
        copyrightText: state.footer.bottomLeft,
      }),
    ];

  return {
    sections: homeSections,
    templates: {
      home: { sections: homeSections },
      product: { sections: [] },
      collection: { sections: [] },
      cart: { sections: [] },
      faq: { sections: [] },
    },
    media: [],
    analytics: {
      enabled: true,
      plannedEvents: [
        "hero_cta_click",
        "secondary_cta_click",
        "hero_product_click",
        "product_card_click",
        "add_to_cart",
        "checkout_start",
        "order_created",
        "whatsapp_click",
        "section_view",
        "scroll_depth",
        "image_load_error",
        "video_load_error",
      ],
    },
    theme: {
      direction: "rtl",
      fontFamily: "Cairo",
      headingFontFamily: "Cairo",
      bodyFontFamily: "Cairo",
      primaryColor: state.brand.primaryColor || "#2563eb",
      secondaryColor: state.brand.ctaColor || "#B42318",
      backgroundColor: state.brand.bgColor || "#FAF8F5",
      textColor: state.brand.textColor || "#111111",
      accentColor: state.brand.primaryColor || "#2563eb",
      radius: "large",
      stylePreset: "premium",
      colorPreset: "default",
      pageWidth: "1200px",
      sectionSpacing: 64,
      buttonRadius: 18,
      cardRadius: 24,
      shadows: true,
      layoutWidth: "contained",
      shadowStyle: "soft",
      spacingScale: "normal",
      buttonStyle: "pill",
      productCardStyle: "elevated",
      headerStyle: "sticky",
      cartDrawerStyle: "comfortable",
      searchStyle: "minimal",
      whatsapp: state.brand.whatsapp,
      socialLinks: {
        instagram: state.brand.socials.instagram || "",
        tiktok: state.brand.socials.tiktok || "",
        facebook: state.brand.socials.facebook || "",
      },
    },
  };
}

export function normalizeThemeConfig(state: CmsState): StorefrontThemeConfig {
  const live = createThemeConfigFromCmsState(state);
  const saved = state.themeSchema?.editor;

  const hasSavedSections = Boolean(saved?.templates?.home?.sections?.length || saved?.sections?.length);
  if (!saved || !hasSavedSections) return live;
  const savedHomeSections = saved.templates?.home?.sections?.length ? saved.templates.home.sections : saved.sections;

  const liveByType = new Map(live.sections.map((item) => [item.type, item]));
  const savedValidSections = savedHomeSections
    .map((item) => {
      if (item.type !== "hero") return item;
      return {
        ...item,
        id: item.id === "hero" ? "hero-main" : item.id,
        type: "hero_revolut",
        blocks: item.blocks?.length ? item.blocks : [heroFeaturedProductsBlock([])],
      } as ThemeEditorSection;
    })
    .filter((item) => isSectionType(item.type));
  const savedTypes = new Set(savedValidSections.map((item) => item.type));
  const savedMergedSections = savedValidSections.map((savedSection, index) => {
    const liveSection = liveByType.get(savedSection.type);
    if (!liveSection) return { ...savedSection, order: index + 1 } as ThemeEditorSection;

    return {
      ...liveSection,
      ...savedSection,
      id: savedSection.id || savedSection.type,
      type: savedSection.type,
      order: index + 1,
      enabled: savedSection.enabled ?? liveSection.enabled,
      blocks: savedSection.blocks ?? liveSection.blocks ?? [],
      settings: {
        ...(liveSection.settings as Record<string, unknown>),
        ...((savedSection.settings as Record<string, unknown> | undefined) ?? {}),
        media: {
          ...((liveSection.settings as { media?: HeroThemeMedia }).media ?? {}),
          ...((savedSection.settings as { media?: HeroThemeMedia }).media ?? {}),
        },
      },
    } as ThemeEditorSection;
  });
  const missingSections = SECTION_TYPES.filter((type) => !savedTypes.has(type)).map((type, index) => {
    const liveSection = liveByType.get(type);
    return { ...(liveSection as ThemeEditorSection), order: savedMergedSections.length + index + 1 };
  });
  const homeSections = [...savedMergedSections, ...missingSections].map((item, index) => ({
    ...item,
    order: index + 1,
  })) as ThemeEditorSection[];

  return {
    theme: {
      ...live.theme,
      ...saved.theme,
      direction: "rtl",
      fontFamily: saved.theme?.fontFamily || "Cairo",
      headingFontFamily: saved.theme?.headingFontFamily || "Cairo",
      bodyFontFamily: saved.theme?.bodyFontFamily || "Cairo",
    },
    sections: homeSections,
    media: saved.media ?? live.media ?? [],
    analytics: {
      ...(live.analytics ?? { enabled: true }),
      ...(saved.analytics ?? {}),
    },
    templates: TEMPLATE_IDS.reduce<StorefrontThemeConfig["templates"]>((templates, id) => {
      templates![id] = id === "home"
        ? { sections: homeSections }
        : saved.templates?.[id] ?? live.templates?.[id] ?? { sections: [] };
      return templates;
    }, {}),
  };
}

export function updateSectionSettings<T extends ThemeEditorSectionType>(
  config: StorefrontThemeConfig,
  sectionId: string,
  patch: Partial<ThemeEditorSectionSettingsMap[T]>,
): StorefrontThemeConfig {
  return {
    ...config,
    sections: config.sections.map((item) =>
      item.id === sectionId
        ? ({
            ...item,
            settings: {
              ...(item.settings as Record<string, unknown>),
              ...(patch as Record<string, unknown>),
            },
          } as ThemeEditorSection)
        : item,
    ),
  };
}

export function replaceSectionSettings<T extends ThemeEditorSectionType>(
  config: StorefrontThemeConfig,
  sectionId: string,
  settings: ThemeEditorSectionSettingsMap[T],
): StorefrontThemeConfig {
  return {
    ...config,
    sections: config.sections.map((item) =>
      item.id === sectionId ? ({ ...item, settings } as ThemeEditorSection) : item,
    ),
  };
}

export function toggleSectionVisibility(
  config: StorefrontThemeConfig,
  sectionId: string,
): StorefrontThemeConfig {
  return {
    ...config,
    sections: config.sections.map((item) =>
      item.id === sectionId ? ({ ...item, enabled: !item.enabled } as ThemeEditorSection) : item,
    ),
  };
}

export function reorderSections(
  config: StorefrontThemeConfig,
  activeId: string,
  overId: string,
): StorefrontThemeConfig {
  const from = config.sections.findIndex((item) => item.id === activeId);
  const to = config.sections.findIndex((item) => item.id === overId);
  if (from < 0 || to < 0 || from === to) return config;

  const next = [...config.sections];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);

  return {
    ...config,
    sections: next.map((item, index) => ({ ...item, order: index + 1 })),
  };
}

export function moveSection(
  config: StorefrontThemeConfig,
  sectionId: string,
  direction: -1 | 1,
): StorefrontThemeConfig {
  const index = config.sections.findIndex((item) => item.id === sectionId);
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= config.sections.length) return config;

  const next = [...config.sections];
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);

  return {
    ...config,
    sections: next.map((item, orderIndex) => ({ ...item, order: orderIndex + 1 })),
  };
}

function getSection<T extends ThemeEditorSectionType>(
  config: StorefrontThemeConfig,
  type: T,
): ThemeEditorSection<T> | undefined {
  return config.sections.find((item) => item.type === type) as ThemeEditorSection<T> | undefined;
}

function normalizedEditorConfig(config: StorefrontThemeConfig): StorefrontThemeConfig {
  const homeSections = config.sections.map((item, index) => ({ ...item, order: index + 1 }));
  return {
    ...config,
    theme: {
      ...config.theme,
      direction: "rtl",
      fontFamily: config.theme.fontFamily || "Cairo",
      headingFontFamily: config.theme.headingFontFamily || config.theme.fontFamily || "Cairo",
      bodyFontFamily: config.theme.bodyFontFamily || config.theme.fontFamily || "Cairo",
      stylePreset: config.theme.stylePreset || "premium",
      accentColor: config.theme.accentColor || config.theme.primaryColor,
      pageWidth: config.theme.pageWidth || "1200px",
      sectionSpacing: config.theme.sectionSpacing ?? 64,
      buttonRadius: config.theme.buttonRadius ?? 18,
      cardRadius: config.theme.cardRadius ?? 24,
      shadows: config.theme.shadows ?? true,
    },
    sections: homeSections,
    templates: {
      ...(config.templates ?? {}),
      home: { sections: homeSections },
      product: config.templates?.product ?? { sections: [] },
      collection: config.templates?.collection ?? { sections: [] },
      cart: config.templates?.cart ?? { sections: [] },
      faq: config.templates?.faq ?? { sections: [] },
    },
  };
}

export function applyThemeConfigToCmsState(
  state: CmsState,
  config: StorefrontThemeConfig,
): Partial<CmsState> {
  const normalized = normalizedEditorConfig(config);
  const hero = getSection(normalized, "hero_revolut") ?? getSection(normalized, "hero");
  const announcement = getSection(normalized, "announcementBar");
  const categories = getSection(normalized, "categories");
  const featured = getSection(normalized, "featured");
  const trustStrip = getSection(normalized, "trustStrip");
  const story = getSection(normalized, "story");
  const faq = getSection(normalized, "faq");
  const footer = getSection(normalized, "footer");
  const whyTara = getSection(normalized, "whyTara");
  const finalCtaSection = getSection(normalized, "finalCta");
  const trustMarquee = getSection(normalized, "trustMarquee");

  const publicOrder = normalized.sections
    .map((item) => PUBLIC_SECTION_IDS[item.type])
    .filter((item): item is string => Boolean(item))
    .filter((item, index, items) => items.indexOf(item) === index);
  const preservedPublicSections = (state.themeSchema?.sectionOrder ?? []).filter(
    (item) => !publicOrder.includes(item),
  );

  const categoryItems = categories?.settings.categories ?? [];
  const nextCategories: Category[] = categoryItems.map((item, index) => {
    const existing =
      state.categories.find((category) => category.id === item.id) ?? state.categories[index];
    const fallbackSlug = existing?.slug || `category-${index + 1}`;

    return {
      id: item.id || existing?.id || `cat-${index + 1}`,
      slug: slugFromLink(item.link, fallbackSlug),
      title: item.name,
      description: existing?.description || item.name,
      image: item.image,
      icon: existing?.icon || "Home",
      hidden: !item.enabled,
      order: index + 1,
    };
  });

  const selectedProductIds = new Set(featured?.settings.productIds ?? []);
  const nextProducts = state.products.map((product) => ({
    ...product,
    featured: selectedProductIds.has(product.id),
  }));

  const faqItems: FaqItem[] =
    faq?.settings.items.map((item, index) => ({
      id: item.id || `faq-${index + 1}`,
      question: item.question,
      answer: item.answer,
      enabled: item.enabled,
      order: index + 1,
    })) ?? state.faq;

  const announcementMessages = announcement
    ? [
        {
          id: firstAnnouncementId(state),
          text: announcement.settings.text,
          accent: false,
          order: 1,
        },
        ...byOrder(state.announcementBar.messages)
          .slice(1)
          .map((item, index) => ({ ...item, order: index + 2 })),
      ]
    : state.announcementBar.messages;

  return {
    themeSchema: {
      ...(state.themeSchema ?? { sections: {}, sectionOrder: [] }),
      sectionOrder: [...publicOrder, ...preservedPublicSections],
      editor: normalized,
    },
    visibility: {
      ...state.visibility,
      hero: hero?.enabled ?? state.visibility.hero,
      categories: categories?.enabled ?? state.visibility.categories,
      featured: featured?.enabled ?? state.visibility.featured,
      trustStrip: trustStrip?.enabled ?? state.visibility.trustStrip,
      story: story?.enabled ?? state.visibility.story,
      why: whyTara?.enabled ?? state.visibility.why,
      faq: faq?.enabled ?? state.visibility.faq,
      finalCta: finalCtaSection?.enabled ?? state.visibility.finalCta,
    },
    hero: hero
      ? {
          ...state.hero,
          headline: hero.settings.title,
          subheadline: hero.settings.subtitle,
          primaryCta: hero.settings.primaryCtaText,
          primaryCtaLink: hero.settings.primaryCtaLink,
          secondaryCta: hero.settings.secondaryCtaText,
          secondaryCtaLink: hero.settings.secondaryCtaLink,
          imageUrl: mediaUrl(hero.settings.media, "image", hero.settings.imageUrl),
          mobileImageUrl: mediaUrl(hero.settings.media, "mobileImage", hero.settings.mobileImageUrl),
          videoUrl:
            mediaUrl(hero.settings.media, "video", hero.settings.videoUrl) ||
            mediaUrl(hero.settings.media, "image", hero.settings.imageUrl),
          videoPoster: mediaUrl(hero.settings.media, "poster", hero.settings.posterUrl),
          mediaType: hero.settings.enableVideo && mediaUrl(hero.settings.media, "video", hero.settings.videoUrl) ? "video" : "image",
          urgencyBadge: hero.settings.badgeText,
          backgroundStyle: hero.settings.backgroundStyle === "glass" ? "gradient" : hero.settings.backgroundStyle,
          textAlign: hero.settings.textAlign,
          titleFontSize: hero.settings.titleFontSize?.desktop ?? state.hero.titleFontSize,
          subtitleFontSize: hero.settings.subtitleFontSize?.desktop ?? state.hero.subtitleFontSize,
          titleColor: hero.settings.titleColor ?? state.hero.titleColor,
          subtitleColor: hero.settings.subtitleColor ?? state.hero.subtitleColor,
        }
      : state.hero,
    announcementBar: announcement
      ? {
          ...state.announcementBar,
          enabled: announcement.enabled && announcement.settings.enabled,
          messages: announcementMessages,
          link: announcement.settings.link,
          backgroundColor: announcement.settings.backgroundColor,
          textColor: announcement.settings.textColor,
        }
      : state.announcementBar,
    categorySection: categories
      ? {
          ...state.categorySection,
          title: categories.settings.title,
        }
      : state.categorySection,
    categories: categories ? nextCategories : state.categories,
    featuredSection: featured
      ? {
          ...state.featuredSection,
          title: featured.settings.title,
          enabled: featured.enabled,
          productIds: featured.settings.productIds,
          layout: featured.settings.layout,
          showPrice: featured.settings.showPrice,
          showRating: featured.settings.showRating,
          showDiscountBadge: featured.settings.showDiscountBadge,
        }
      : state.featuredSection,
    products: featured ? nextProducts : state.products,
    trustStrip: trustStrip
      ? trustStrip.settings.items.map((item) => ({
          icon: item.icon,
          title: item.title,
          sub: item.description,
        }))
      : state.trustStrip,
    story: story
      ? {
          ...state.story,
          title: story.settings.title,
          body: story.settings.description,
          image: story.settings.imageUrl,
          ctaText: story.settings.ctaText,
          ctaLink: story.settings.ctaLink,
          pillLabel: story.settings.pillLabel,
          overlayTitle: story.settings.overlayTitle,
          overlaySub: story.settings.overlaySub,
          valueChips: story.settings.valueChips,
        }
      : state.story,
    faq: faqItems,
    why: whyTara
      ? {
          ...state.why,
          title: whyTara.settings.title,
          intro: whyTara.settings.intro,
          pillLabel: whyTara.settings.pillLabel,
          points: whyTara.settings.points.map((p) => p.text),
          icons: whyTara.settings.points.map((p) => p.icon),
        }
      : state.why,
    finalCta: finalCtaSection
      ? {
          ...state.finalCta,
          title: finalCtaSection.settings.title,
          body: finalCtaSection.settings.body,
          primaryCta: finalCtaSection.settings.primaryCta,
          secondaryCta: finalCtaSection.settings.secondaryCta,
          primaryCtaLink: finalCtaSection.settings.primaryCtaLink,
          secondaryCtaLink: finalCtaSection.settings.secondaryCtaLink,
          pillLabel: finalCtaSection.settings.pillLabel,
        }
      : state.finalCta,
    marqueeItems: trustMarquee ? trustMarquee.settings.items : state.marqueeItems,
    footer: footer
      ? {
          ...state.footer,
          tagline: footer.settings.description,
          bottomLeft: footer.settings.copyrightText,
        }
      : state.footer,
    brand: footer
      ? {
          ...state.brand,
          primaryColor: normalized.theme.primaryColor || state.brand.primaryColor,
          ctaColor: normalized.theme.secondaryColor || state.brand.ctaColor,
          bgColor: normalized.theme.backgroundColor || state.brand.bgColor,
          textColor: normalized.theme.textColor || state.brand.textColor,
          logoText: footer.settings.logoText,
          whatsapp: normalized.theme.whatsapp || footer.settings.contactWhatsApp,
          socials: {
            instagram: normalized.theme.socialLinks?.instagram ?? footer.settings.socialLinks.instagram,
            tiktok: normalized.theme.socialLinks?.tiktok ?? footer.settings.socialLinks.tiktok,
            facebook: normalized.theme.socialLinks?.facebook ?? footer.settings.socialLinks.facebook,
          },
        }
      : state.brand,
  };
}
