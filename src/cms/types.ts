export type LandingPageFeature = {
  icon: string;
  text: string;
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
};

export type FooterContent = {
  tagline: string;
  bottomLeft: string;
  bottomRight: string;
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

export type ThemeSchema = {
  sectionOrder: string[];
  sections: Record<string, Partial<SectionTheme>>;
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
  secondaryCta: string;
  trustLine: string;
  urgencyBadge: string;
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
};

export type WhyContent = {
  title: string;
  intro: string;
  points: string[];
};

export type FinalCtaContent = {
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
};

export type CategorySectionContent = {
  title: string;
  intro: string;
  columns?: number; // 1–4, default 4
  mobileColumns?: number; // 1–2, default 1
};

export type FeaturedSectionContent = {
  title: string;
  intro: string;
  enabled: boolean;
};

export type FaqSectionContent = {
  title: string;
  intro: string;
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
};
