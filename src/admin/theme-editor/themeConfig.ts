import { loadCmsState as loadSupabaseCmsState, saveCmsState as saveSupabaseCmsState } from "../../lib/db";
import type {
  Category,
  CmsState,
  FaqItem,
  StorefrontThemeConfig,
  ThemeEditorSection,
  ThemeEditorSectionSettingsMap,
  ThemeEditorSectionType,
} from "../../cms/types";

export const SECTION_TYPES: ThemeEditorSectionType[] = [
  "hero",
  "announcementBar",
  "categories",
  "featured",
  "trustStrip",
  "story",
  "faq",
  "footer",
];

export const SECTION_META: Record<
  ThemeEditorSectionType,
  { label: string; badge: string; description: string }
> = {
  hero: { label: "الهيرو", badge: "H", description: "العنوان، CTA، الصورة والفيديو" },
  announcementBar: { label: "شريط الإعلان", badge: "A", description: "رسالة قصيرة أعلى الموقع" },
  categories: { label: "الفئات", badge: "C", description: "بطاقات التصنيفات الرئيسية" },
  featured: { label: "منتجات مختارة", badge: "P", description: "اختيار المنتجات وطريقة العرض" },
  trustStrip: { label: "شريط الثقة", badge: "T", description: "COD، ضمان، دعم وخدمة" },
  story: { label: "القصة", badge: "S", description: "About / Story section" },
  faq: { label: "الأسئلة", badge: "Q", description: "أسئلة وأجوبة قابلة للتفعيل" },
  footer: { label: "الفوتر", badge: "F", description: "الشعار، السوشيال والتواصل" },
};

const PUBLIC_SECTION_IDS: Partial<Record<ThemeEditorSectionType, string>> = {
  hero: "hero",
  categories: "categories",
  featured: "featured",
  trustStrip: "trustStrip",
  story: "story",
  faq: "faq",
};

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
  return { id: type, type, enabled, order, settings };
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

  return {
    sections: [
      section("hero", state.visibility.hero, 1, {
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
      }),
      section("announcementBar", state.announcementBar.enabled, 2, {
        enabled: state.announcementBar.enabled,
        text: firstAnnouncementText(state),
        link: state.announcementBar.link || "",
        backgroundColor: state.announcementBar.backgroundColor || "#111111",
        textColor: state.announcementBar.textColor || "#ffffff",
      }),
      section("categories", state.visibility.categories, 3, {
        title: state.categorySection.title,
        categories: byOrder(state.categories).map((category) => ({
          id: category.id,
          name: category.title,
          image: category.image,
          link: `/categories/${category.slug}`,
          enabled: !category.hidden,
        })),
      }),
      section("featured", state.visibility.featured && state.featuredSection.enabled, 4, {
        title: state.featuredSection.title,
        productIds: featuredProductIds,
        layout: state.featuredSection.layout || "grid",
        showPrice: state.featuredSection.showPrice ?? true,
        showRating: state.featuredSection.showRating ?? true,
        showDiscountBadge: state.featuredSection.showDiscountBadge ?? true,
      }),
      section("trustStrip", state.visibility.trustStrip, 5, {
        items: state.trustStrip.map((item) => ({
          icon: item.icon,
          title: item.title,
          description: item.sub,
        })),
      }),
      section("story", state.visibility.story, 6, {
        title: state.story.title,
        description: state.story.body,
        imageUrl: state.story.image,
      }),
      section("faq", state.visibility.faq, 7, {
        items: byOrder(state.faq).map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          enabled: item.enabled !== false,
        })),
      }),
      section("footer", true, 8, {
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
    ],
    theme: {
      direction: "rtl",
      fontFamily: "Cairo",
      primaryColor: state.brand.primaryColor || "#2563eb",
      radius: "large",
      stylePreset: "minimal",
    },
  };
}

export function normalizeThemeConfig(state: CmsState): StorefrontThemeConfig {
  const live = createThemeConfigFromCmsState(state);
  const saved = state.themeSchema?.editor;

  if (!saved?.sections?.length) return live;

  const liveByType = new Map(live.sections.map((item) => [item.type, item]));
  const savedByType = new Map(
    saved.sections.filter((item) => isSectionType(item.type)).map((item) => [item.type, item]),
  );
  const orderedTypes = [
    ...saved.sections.map((item) => item.type).filter(isSectionType),
    ...SECTION_TYPES.filter((type) => !savedByType.has(type)),
  ];

  return {
    theme: {
      ...live.theme,
      ...saved.theme,
      direction: "rtl",
      fontFamily: saved.theme?.fontFamily || "Cairo",
    },
    sections: orderedTypes.map((type, index) => {
      const liveSection = liveByType.get(type);
      const savedSection = savedByType.get(type);
      if (!liveSection) return savedSection as ThemeEditorSection;

      return {
        ...liveSection,
        ...savedSection,
        id: type,
        type,
        order: index + 1,
        enabled: savedSection?.enabled ?? liveSection.enabled,
        settings: {
          ...(liveSection.settings as Record<string, unknown>),
          ...((savedSection?.settings as Record<string, unknown> | undefined) ?? {}),
        },
      } as ThemeEditorSection;
    }),
  };
}

export function updateSectionSettings<T extends ThemeEditorSectionType>(
  config: StorefrontThemeConfig,
  sectionId: T,
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
  sectionId: T,
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
  sectionId: ThemeEditorSectionType,
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
  activeId: ThemeEditorSectionType,
  overId: ThemeEditorSectionType,
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
  sectionId: ThemeEditorSectionType,
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
  return {
    ...config,
    theme: {
      ...config.theme,
      direction: "rtl",
      fontFamily: config.theme.fontFamily || "Cairo",
    },
    sections: config.sections.map((item, index) => ({ ...item, order: index + 1 })),
  };
}

export function applyThemeConfigToCmsState(
  state: CmsState,
  config: StorefrontThemeConfig,
): Partial<CmsState> {
  const normalized = normalizedEditorConfig(config);
  const hero = getSection(normalized, "hero");
  const announcement = getSection(normalized, "announcementBar");
  const categories = getSection(normalized, "categories");
  const featured = getSection(normalized, "featured");
  const trustStrip = getSection(normalized, "trustStrip");
  const story = getSection(normalized, "story");
  const faq = getSection(normalized, "faq");
  const footer = getSection(normalized, "footer");

  const publicOrder = normalized.sections
    .map((item) => PUBLIC_SECTION_IDS[item.type])
    .filter((item): item is string => Boolean(item));
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
      faq: faq?.enabled ?? state.visibility.faq,
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
          imageUrl: hero.settings.imageUrl,
          mobileImageUrl: hero.settings.mobileImageUrl,
          videoUrl: hero.settings.videoUrl || hero.settings.imageUrl,
          videoPoster: hero.settings.posterUrl,
          mediaType: hero.settings.videoUrl ? "video" : "image",
          urgencyBadge: hero.settings.badgeText,
          backgroundStyle: hero.settings.backgroundStyle,
          textAlign: hero.settings.textAlign,
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
        }
      : state.story,
    faq: faqItems,
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
          logoText: footer.settings.logoText,
          whatsapp: footer.settings.contactWhatsApp,
          socials: {
            instagram: footer.settings.socialLinks.instagram,
            tiktok: footer.settings.socialLinks.tiktok,
            facebook: footer.settings.socialLinks.facebook,
          },
        }
      : state.brand,
  };
}
