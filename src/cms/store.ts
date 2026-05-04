import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loadCmsState, saveCmsState } from "../lib/db";
import type {
  CmsState,
  TrackingStats,
  ThemeSchema,
  SectionTheme,
  Category,
  Product,
  FaqItem,
  AnnouncementMessage,
  AnnouncementBarSettings,
  FooterContent,
  BrandSettings,
  HeroContent,
  StoryContent,
  WhyContent,
  FinalCtaContent,
  CategorySectionContent,
  FeaturedSectionContent,
  FaqSectionContent,
  SectionVisibility,
  Nav,
  AdminUser,
  LandingPage,
} from "./types";
import { seed } from "./seed";

type Actions = {
  reset: () => void;
  incrementStat: (key: keyof TrackingStats) => void;
  resetStats: () => void;

  setBrand: (b: Partial<BrandSettings>) => void;
  setNav: (n: Partial<Nav>) => void;
  setHero: (h: Partial<HeroContent>) => void;
  setStory: (s: Partial<StoryContent>) => void;
  setWhy: (w: Partial<WhyContent>) => void;
  setFinalCta: (c: Partial<FinalCtaContent>) => void;
  setCategorySection: (c: Partial<CategorySectionContent>) => void;
  setFeaturedSection: (f: Partial<FeaturedSectionContent>) => void;
  setFaqSection: (f: Partial<FaqSectionContent>) => void;
  setVisibility: (v: Partial<SectionVisibility>) => void;
  setAdmin: (a: Partial<AdminUser>) => void;

  upsertCategory: (c: Category) => void;
  removeCategory: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;

  upsertProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  reorderProducts: (orderedIds: string[]) => void;

  upsertFaq: (f: FaqItem) => void;
  removeFaq: (id: string) => void;
  reorderFaq: (orderedIds: string[]) => void;

  setAnnouncementBar: (s: Partial<AnnouncementBarSettings>) => void;
  upsertAnnouncementMessage: (m: AnnouncementMessage) => void;
  removeAnnouncementMessage: (id: string) => void;
  reorderAnnouncementMessages: (orderedIds: string[]) => void;

  setFooter: (f: Partial<FooterContent>) => void;
  upsertLandingPage: (lp: LandingPage) => void;

  setThemeSchema: (t: ThemeSchema) => void;
  updateSectionTheme: (sectionId: string, theme: Partial<SectionTheme>) => void;
  reorderSections: (sectionOrder: string[]) => void;

  syncToDb: () => Promise<void>;
  loadFromDb: () => Promise<void>;
};

export type CmsStore = CmsState & Actions;

export const useCms = create<CmsStore>()(
  persist(
    (set, _get) => ({
      ...seed,

      reset: () => set((s) => ({ ...seed, trackingStats: s.trackingStats })),
      incrementStat: (key) =>
        set((s) => ({
          trackingStats: { ...s.trackingStats, [key]: (s.trackingStats[key] ?? 0) + 1 },
        })),
      resetStats: () =>
        set({ trackingStats: { whatsappClicks: 0, formStarts: 0, formSubmissions: 0, pageViews: 0 } }),

      setBrand: (b) =>
        set((s) => ({ brand: { ...s.brand, ...b } })),
      setNav: (n) => set((s) => ({ nav: { ...s.nav, ...n } })),
      setHero: (h) => set((s) => ({ hero: { ...s.hero, ...h } })),
      setStory: (st) => set((s) => ({ story: { ...s.story, ...st } })),
      setWhy: (w) => set((s) => ({ why: { ...s.why, ...w } })),
      setFinalCta: (c) =>
        set((s) => ({ finalCta: { ...s.finalCta, ...c } })),
      setCategorySection: (c) =>
        set((s) => ({ categorySection: { ...s.categorySection, ...c } })),
      setFeaturedSection: (f) =>
        set((s) => ({ featuredSection: { ...s.featuredSection, ...f } })),
      setFaqSection: (f) =>
        set((s) => ({ faqSection: { ...s.faqSection, ...f } })),
      setVisibility: (v) =>
        set((s) => ({ visibility: { ...s.visibility, ...v } })),
      setAdmin: (a) => set((s) => ({ admin: { ...s.admin, ...a } })),

      upsertCategory: (c) =>
        set((s) => {
          const idx = s.categories.findIndex((x) => x.id === c.id);
          const next = [...s.categories];
          if (idx === -1) next.push(c);
          else next[idx] = c;
          return { categories: next };
        }),
      removeCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
        })),
      reorderCategories: (orderedIds) =>
        set((s) => ({
          categories: orderedIds
            .map((id, i) => {
              const c = s.categories.find((x) => x.id === id);
              return c ? { ...c, order: i + 1 } : null;
            })
            .filter(Boolean) as Category[],
        })),

      upsertProduct: (p) =>
        set((s) => {
          const idx = s.products.findIndex((x) => x.id === p.id);
          const next = [...s.products];
          if (idx === -1) next.push(p);
          else next[idx] = p;
          return { products: next };
        }),
      removeProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      reorderProducts: (orderedIds) =>
        set((s) => ({
          products: orderedIds
            .map((id, i) => {
              const p = s.products.find((x) => x.id === id);
              return p ? { ...p, order: i + 1 } : null;
            })
            .filter(Boolean) as Product[],
        })),

      upsertFaq: (f) =>
        set((s) => {
          const idx = s.faq.findIndex((x) => x.id === f.id);
          const next = [...s.faq];
          if (idx === -1) next.push(f);
          else next[idx] = f;
          return { faq: next };
        }),
      removeFaq: (id) =>
        set((s) => ({ faq: s.faq.filter((f) => f.id !== id) })),
      reorderFaq: (orderedIds) =>
        set((s) => ({
          faq: orderedIds
            .map((id, i) => {
              const f = s.faq.find((x) => x.id === id);
              return f ? { ...f, order: i + 1 } : null;
            })
            .filter(Boolean) as FaqItem[],
        })),

      setAnnouncementBar: (s) =>
        set((st) => ({
          announcementBar: { ...st.announcementBar, ...s },
        })),
      upsertAnnouncementMessage: (m) =>
        set((st) => {
          const msgs = [...st.announcementBar.messages];
          const idx = msgs.findIndex((x) => x.id === m.id);
          if (idx === -1) msgs.push(m);
          else msgs[idx] = m;
          return { announcementBar: { ...st.announcementBar, messages: msgs } };
        }),
      removeAnnouncementMessage: (id) =>
        set((st) => ({
          announcementBar: {
            ...st.announcementBar,
            messages: st.announcementBar.messages.filter((m) => m.id !== id),
          },
        })),
      reorderAnnouncementMessages: (orderedIds) =>
        set((st) => ({
          announcementBar: {
            ...st.announcementBar,
            messages: orderedIds
              .map((id, i) => {
                const m = st.announcementBar.messages.find((x) => x.id === id);
                return m ? { ...m, order: i + 1 } : null;
              })
              .filter(Boolean) as AnnouncementMessage[],
          },
        })),

      setFooter: (f) =>
        set((st) => ({ footer: { ...st.footer, ...f } })),

      upsertLandingPage: (lp) =>
        set((s) => {
          const idx = s.landingPages.findIndex((x) => x.slug === lp.slug);
          const next = [...s.landingPages];
          if (idx === -1) next.push(lp);
          else next[idx] = lp;
          return { landingPages: next };
        }),

      setThemeSchema: (t) => set({ themeSchema: t }),
      updateSectionTheme: (sectionId, theme) =>
        set((s) => ({
          themeSchema: {
            ...s.themeSchema,
            sections: {
              ...s.themeSchema.sections,
              [sectionId]: { ...(s.themeSchema.sections[sectionId] ?? {}), ...theme },
            },
          },
        })),
      reorderSections: (sectionOrder) =>
        set((s) => ({ themeSchema: { ...s.themeSchema, sectionOrder } })),

      syncToDb: async () => {
        const state = useCms.getState();
        const { syncToDb: _s, loadFromDb: _l, ...data } = state;
        await saveCmsState(data);
      },

      loadFromDb: async () => {
        const remote = await loadCmsState();
        if (remote && typeof remote === "object") {
          set((local) => ({ ...local, ...(remote as object) }));
        }
      },
    }),
    {
      name: "taratech-cms-v2",
    }
  )
);

export const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
