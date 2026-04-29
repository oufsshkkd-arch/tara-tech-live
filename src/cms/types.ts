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
  order: number;
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
};

export type HeroContent = {
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  trustLine: string;
  urgencyBadge: string;
  overlayDarkness: number; // 0..1
  showFloatingCard: boolean;
  floatingCardLines: string[];
  videoUrl: string;
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
