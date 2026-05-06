export type LandingPageFeature = {
  icon: string;
  text: string;
};

export type TrustStripItem = {
  icon: string; // lucide icon name
  title: string;
  sub: string;
};

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  icon: string; // lucide icon name
  hidden: boolean;
  order: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  badge?: string;
  featured: boolean;
  hidden: boolean;
  stock: "in" | "low" | "out";
  guarantee?: string;
  codNote?: string;
  features?: LandingPageFeature[];
  order: number;
  copy?: ProductPageCopy;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
  enabled?: boolean;
};

export type AnnouncementMessage = {
  id: string;
  text: string;
  accent: boolean;
  order: number;
};

export type AnnouncementBarSettings = {
  enabled: boolean;
  messages: AnnouncementMessage[];
  speed: number; // animation duration in seconds
  link?: string;
  backgroundColor?: string;
  textColor?: string;
};

export type FooterContent = {
  tagline: string;
  bottomLeft: string;
  bottomRight: string;
  navLabel?: string;
  contactLabel?: string;
  legalLabel?: string;
};

export type SectionVisibility = {
  hero: boolean;
  categories: boolean;
  featured: boolean;
  trustStrip: boolean;
  story: boolean;
  why: boolean;
  faq: boolean;
  finalCta: boolean;
};

export type BrandSettings = {
  brandName: string;
  tagline: string;
  logoText: string;
  logoTagline?: string; // subtitle below logo, e.g. "Tech & Style"
  primaryColor: string;
  ctaColor: string;
  ctaHoverColor: string;
  textColor: string;
  bgColor: string;
  whatsapp: string;
  email: string;
  socials: { instagram?: string; tiktok?: string; facebook?: string };
  legalLinks: { label: string; href: string }[];
  seo: { title: string; description: string };
  brandLine: string;
  clarityId?: string;
};

export type SectionTheme = {
  fontSize: number;         // 12–24 px
  lineHeight: number;       // 1.2–2.0
  letterSpacing?: number;   // -0.05 to 0.2 em
  bgColor: string;          // hex or ""
  textColor: string;        // hex or ""
  accentColor: string;      // hex or ""
  fontFamily?: string;      // "" = inherit
  paddingTop?: number;      // 0–120 px
  paddingBottom?: number;   // 0–120 px
  borderRadius?: number;    // 0–32 px
  borderWidth?: number;     // 0–8 px
  borderColor?: string;     // hex or ""
};

export type MediaAsset = {
  type: "upload" | "external";
  bucket?: string;
  path?: string;
  url: string;
  alt?: string;
  mimeType?: string;
  size?: number;
};

export type ResponsiveNumber = {
  desktop: number;
  mobile: number;
};

export type DynamicSourceValue = {
  type: "dynamic";
  source: string;
  fallback: string;
};

export type HeroThemeMedia = {
  image: MediaAsset | null;
  mobileImage: MediaAsset | null;
  video: MediaAsset | null;
  poster: MediaAsset | null;
};

export type HeroFeaturedProductsSettings = {
  selectionMode: "manual" | "collection";
  selectedProductIds: string[];
  collectionId: string | null;
  productLimit: number;
  showImage: boolean;
  showTitle: boolean;
  showPrice: boolean;
  showOldPrice: boolean;
  showRating: boolean;
  showBadge: boolean;
  showCTA: boolean;
  cardStyle: "minimal" | "glass" | "premium" | "compact" | "revolut";
  revealOnScroll: boolean;
  spacing?: number;
  background?: string;
  textColor?: string;
  priceColor?: string;
  badgeText?: string;
  badgeColor?: string;
};

export type HeroThemeSettings = {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  mobileImageUrl: string;
  videoUrl: string;
  posterUrl: string;
  badgeText: string;
  backgroundStyle: "light" | "dark" | "gradient" | "glass";
  textAlign: "left" | "center" | "right";
  titleFontSize?: ResponsiveNumber;
  subtitleFontSize?: ResponsiveNumber;
  titleColor?: string;
  subtitleColor?: string;
  accentColor?: string;
  buttonStyle?: "rounded" | "pill" | "sharp" | "premium";
  sectionHeight?: number;
  spacing?: number;
  borderRadius?: number;
  mediaPosition?: "right" | "left" | "top" | "background";
  media?: HeroThemeMedia;
  enableVideo?: boolean;
  enableAnimation?: boolean;
  enableHeroProducts?: boolean;
  starRatingText?: string;
};

export type AnnouncementThemeSettings = {
  enabled: boolean;
  text: string;
  link: string;
  backgroundColor: string;
  textColor: string;
};

export type CategoryThemeItem = {
  id: string;
  name: string;
  image: string;
  link: string;
  enabled: boolean;
};

export type CategoriesThemeSettings = {
  title: string;
  categories: CategoryThemeItem[];
};

export type FeaturedThemeSettings = {
  title: string;
  productIds: string[];
  layout: "grid" | "carousel";
  showPrice: boolean;
  showRating: boolean;
  showDiscountBadge: boolean;
};

export type TrustThemeItem = {
  icon: string;
  title: string;
  description: string;
};

export type TrustThemeSettings = {
  items: TrustThemeItem[];
};

export type StoryThemeSettings = {
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  pillLabel?: string;
  overlayTitle?: string;
  overlaySub?: string;
  valueChips?: { label: string; sub: string }[];
};

export type FaqThemeItem = {
  id: string;
  question: string;
  answer: string;
  enabled: boolean;
};

export type FaqThemeSettings = {
  items: FaqThemeItem[];
};

export type FooterThemeSettings = {
  logoText: string;
  description: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    facebook: string;
  };
  contactWhatsApp: string;
  copyrightText: string;
};

export type RevolutBenefitCard = {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  theme: "light" | "dark";
};

export type RevolutBenefitsThemeSettings = {
  cards: RevolutBenefitCard[];
};

export type WhyTaraThemeSettings = {
  title: string;
  intro: string;
  pillLabel: string;
  points: { text: string; icon: string }[];
};

export type FinalCtaThemeSettings = {
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  primaryCtaLink: string;
  secondaryCtaLink: string;
  pillLabel: string;
};

export type TrustMarqueeThemeSettings = {
  items: string[];
  speed: number;
};

export type ThemeEditorSectionType =
  | "hero"
  | "header"
  | "hero_revolut"
  | "announcementBar"
  | "categories"
  | "featured"
  | "bestSellers"
  | "productHighlight"
  | "trustStrip"
  | "codBenefits"
  | "reviews"
  | "story"
  | "faq"
  | "whatsappCta"
  | "footer"
  | "revolutBenefits"
  | "whyTara"
  | "finalCta"
  | "trustMarquee";

export type ThemeEditorBlock = {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  settings: Record<string, unknown>;
};

export type GenericThemeSettings = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  videoUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  spacing?: number;
  radius?: number;
};

export type ThemeEditorSectionSettingsMap = {
  header: GenericThemeSettings;
  hero: HeroThemeSettings;
  hero_revolut: HeroThemeSettings;
  announcementBar: AnnouncementThemeSettings;
  categories: CategoriesThemeSettings;
  featured: FeaturedThemeSettings;
  bestSellers: FeaturedThemeSettings;
  productHighlight: GenericThemeSettings;
  trustStrip: TrustThemeSettings;
  codBenefits: TrustThemeSettings;
  reviews: GenericThemeSettings;
  story: StoryThemeSettings;
  faq: FaqThemeSettings;
  whatsappCta: GenericThemeSettings;
  footer: FooterThemeSettings;
  revolutBenefits: RevolutBenefitsThemeSettings;
  whyTara: WhyTaraThemeSettings;
  finalCta: FinalCtaThemeSettings;
  trustMarquee: TrustMarqueeThemeSettings;
};

export type ThemeEditorSection<T extends ThemeEditorSectionType = ThemeEditorSectionType> = {
  id: string;
  type: T;
  enabled: boolean;
  order: number;
  settings: ThemeEditorSectionSettingsMap[T];
  blocks?: ThemeEditorBlock[];
};

export type ThemeTemplateId = "home" | "product" | "collection" | "cart" | "faq";

export type ThemeTemplate = {
  sections: ThemeEditorSection[];
};

export type StorefrontThemeConfig = {
  sections: ThemeEditorSection[];
  templates?: Partial<Record<ThemeTemplateId, ThemeTemplate>>;
  media?: MediaAsset[];
  analytics?: {
    enabled: boolean;
    plannedEvents?: string[];
  };
  theme: {
    direction: "rtl" | "ltr";
    fontFamily: string;
    headingFontFamily?: string;
    bodyFontFamily?: string;
    primaryColor: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    radius: "small" | "medium" | "large";
    stylePreset: "minimal" | "bold" | "editorial" | "premium";
    colorPreset?: "default" | "minimal" | "dark" | "warm" | "sage";
    pageWidth?: string;
    sectionSpacing?: number;
    buttonRadius?: number;
    cardRadius?: number;
    shadows?: boolean;
    layoutWidth?: "contained" | "wide" | "full";
    shadowStyle?: "none" | "soft" | "deep";
    spacingScale?: "compact" | "normal" | "airy";
    buttonStyle?: "rounded" | "pill" | "sharp";
    productCardStyle?: "minimal" | "elevated" | "bordered";
    headerStyle?: "clean" | "sticky" | "transparent";
    cartDrawerStyle?: "compact" | "comfortable";
    searchStyle?: "minimal" | "prominent";
    whatsapp?: string;
    socialLinks?: {
      instagram?: string;
      tiktok?: string;
      facebook?: string;
    };
  };
};

export type ThemeSchema = {
  sectionOrder: string[];
  sections: Record<string, Partial<SectionTheme>>;
  editor?: StorefrontThemeConfig;
};

export type TrackingStats = {
  whatsappClicks: number;
  formStarts: number;
  formSubmissions: number;
  pageViews: number;
};

export type HeroContent = {
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaLink?: string;
  secondaryCta: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  starRatingText?: string; // default "آلاف العملاء الراضين"
  productCtaText?: string; // default "اشتري الآن"
  trustLine: string;
  urgencyBadge: string;
  backgroundStyle?: "light" | "dark" | "gradient";
  textAlign?: "left" | "center" | "right";
  overlayDarkness: number;
  showFloatingCard: boolean;
  floatingCardLines: string[];
  mediaType?: "image" | "video";
  videoUrl: string;
  // End-state section (appears after scroll animation completes)
  endTitle?: string;
  endSub?: string;
  endCta?: string;
  // Trust chips + scarcity below the CTA buttons
  trustChips?: string[];
  scarcityLine?: string;
  // Label shown on each product card in the hero ("اختيار" etc.)
  cardLabel?: string;
  // Hero typography overrides
  titleFontSize?: number;       // px, default ~96
  titleLineHeight?: number;     // default 1.05
  titleLetterSpacing?: number;  // em, default -0.03
  titleColor?: string;          // hex, default white
  subtitleFontSize?: number;    // px, default 18
  subtitleLineHeight?: number;  // default 1.6
  subtitleLetterSpacing?: number; // em, default 0
  subtitleColor?: string;       // hex, default white/90
  // Video poster (shown while video loads)
  videoPoster?: string;
  // Mobile-optimized video (lower bitrate, served on screens < 768px)
  mobileVideoUrl?: string;
  // Entrance animations for title and subtitle
  titleAnimation?: "none" | "fadeUp" | "slideLeft" | "zoom";
  subtitleAnimation?: "none" | "fadeUp" | "slideLeft" | "zoom";
  // Urgency badge custom colors
  badgeColor?: string;
  badgeBgColor?: string;
};

export type StoryContent = {
  title: string;
  body: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  pillLabel?: string;
  overlayTitle?: string;
  overlaySub?: string;
  valueChips?: { label: string; sub: string }[];
};

export type WhyContent = {
  title: string;
  intro: string;
  points: string[];
  pillLabel?: string;
  icons?: string[];
};

export type FinalCtaContent = {
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  primaryCtaLink?: string;
  secondaryCtaLink?: string;
  pillLabel?: string;
};

export type CategorySectionContent = {
  title: string;
  intro: string;
  columns?: number; // 1–4, default 4
  mobileColumns?: number; // 1–2, default 1
  pillLabel?: string;
  discoverText?: string;
};

export type FeaturedSectionContent = {
  title: string;
  intro: string;
  enabled: boolean;
  productIds?: string[];
  layout?: "grid" | "carousel";
  showPrice?: boolean;
  showRating?: boolean;
  showDiscountBadge?: boolean;
  pillLabel?: string;
  viewAllText?: string;
};

export type FaqSectionContent = {
  title: string;
  intro: string;
  pillLabel?: string;
};

export type ProductPageReview = {
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
};

export type ProductPageCopy = {
  sectionToggles?: {
    marquee?: boolean;
    problem?: boolean;
    solution?: boolean;
    howItWorks?: boolean;
    benefits?: boolean;
    whoFor?: boolean;
    value?: boolean;
    reviews?: boolean;
    finalCta?: boolean;
  };
  promoTicker: string[];
  heroHeadline: string[];
  heroSub: string;
  problemTitle: string;
  problemSub: string;
  problemQuote: string;
  problems: { emoji: string; text: string }[];
  solutionTitle: string;
  solutionSub: string;
  solutionBullets: { emoji: string; text: string }[];
  solutionQuote: string;
  howItWorksTitle: string;
  howSteps: { label: string; steps: string[] }[];
  benefits: { emoji: string; title: string; body: string }[];
  whoFor: { emoji: string; title: string; body: string }[];
  valueTitle: string;
  valueSub: string;
  valueCosts: { emoji: string; text: string }[];
  valueConclusion: string;
  reviews: ProductPageReview[];
  finalHeadline: string;
  finalSub: string;
  scarcityText: string;
};

export type LandingPage = {
  productId: string;
  slug: string;
  badge: string;
  headline: string;
  subheadline: string;
  description: string;
  features: LandingPageFeature[];
  primaryCta: string;
  secondaryCta: string;
  guarantee: string;
  urgencyText: string;
};

export type StoredOrder = {
  id: string;
  date: string;
  time: string;
  full_name: string;
  phone: string;
  city: string;
  product_name: string;
  price: number;
  quantity: number;
  status: "جديد" | "مؤكد" | "مشحون" | "مسلم" | "ملغي";
  source: string;
};

export type AdminUser = {
  email: string;
  password: string;
};

export type Nav = {
  labels: {
    home: string;
    categories: string;
    products: string;
    story: string;
    faq: string;
    contact: string;
  };
  primaryCta: string;
};

export type CmsState = {
  trustStrip: TrustStripItem[];
  marqueeItems: string[];
  trackingStats: TrackingStats;
  themeSchema: ThemeSchema;
  landingPages: LandingPage[];
  brand: BrandSettings;
  nav: Nav;
  hero: HeroContent;
  categorySection: CategorySectionContent;
  featuredSection: FeaturedSectionContent;
  story: StoryContent;
  why: WhyContent;
  faqSection: FaqSectionContent;
  finalCta: FinalCtaContent;
  visibility: SectionVisibility;
  categories: Category[];
  products: Product[];
  faq: FaqItem[];
  announcementBar: AnnouncementBarSettings;
  footer: FooterContent;
  admin: AdminUser;
  uiLabels?: {
    addToCart?: string;
    limitedStock?: string;
    priceOnRequest?: string;
    currency?: string;
    whatsappLabel?: string;
  };
};
