import { lazy, Suspense } from "react";

// ── Above-fold: eager imports (must be ready on first paint) ────────────────
import AnnouncementBar from "../../components/AnnouncementBar";
import HeroRevolut from "../../components/HeroRevolut";
import Header from "../../components/Header";

// ── Below-fold: lazy imports (split into separate chunks) ───────────────────
const Categories      = lazy(() => import("../../components/Categories"));
const FeaturedProducts = lazy(() => import("../../components/FeaturedProducts"));
const Story           = lazy(() => import("../../components/Story"));
const Faq             = lazy(() => import("../../components/Faq"));
const WhyTara         = lazy(() => import("../../components/WhyTara"));
const FinalCta        = lazy(() => import("../../components/FinalCta"));
const Footer          = lazy(() => import("../../components/Footer"));
const RevolutBenefits = lazy(() => import("../../components/RevolutBenefits"));
const TrustMarquee    = lazy(() => import("../../components/TrustMarquee"));

import { useCms } from "../../cms/store";
import type {
  AnnouncementThemeSettings,
  FinalCtaThemeSettings,
  HeroThemeSettings,
  RevolutBenefitsThemeSettings,
} from "../../cms/types";
import type { EditorSection } from "./types";

// Minimal height fallback prevents layout shift while lazy chunk loads
function SectionShell({ minH = 80 }: { minH?: number }) {
  return <div style={{ minHeight: minH }} aria-hidden />;
}

export default function StorefrontRenderer({
  sections,
  isMobile = false,
  mode = "public",
}: {
  sections: EditorSection[];
  isMobile?: boolean;
  mode?: "public" | "preview";
}) {
  const cms = useCms();
  let heroRendered = false;

  return (
    <>
      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          switch (section.type) {
            case "header":
              return <Header key={section.id} showAnnouncement={false} fixed={mode === "public"} />;

            case "hero":
            case "hero_revolut":
              if (heroRendered) return null;
              heroRendered = true;
              return (
                <HeroRevolut
                  key={section.id}
                  settings={section.settings as HeroThemeSettings}
                  products={cms.products}
                  blocks={section.blocks ?? []}
                  mode={mode}
                  isMobile={isMobile}
                />
              );

            case "announcementBar": {
              const s = section.settings as AnnouncementThemeSettings;
              return (
                <AnnouncementBar
                  key={section.id}
                  announcementBar={{
                    enabled: section.enabled && s.enabled,
                    link: s.link,
                    backgroundColor: s.backgroundColor,
                    textColor: s.textColor,
                    speed: cms.announcementBar.speed || 40,
                    messages: [{ id: `${section.id}-msg`, text: s.text, accent: false, order: 1 }],
                  }}
                />
              );
            }

            case "trustMarquee":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={64} />}>
                  <TrustMarquee />
                </Suspense>
              );

            case "revolutBenefits":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={300} />}>
                  <RevolutBenefits settings={section.settings as RevolutBenefitsThemeSettings} />
                </Suspense>
              );

            case "categories":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={280} />}>
                  <Categories categorySection={cms.categorySection} categories={cms.categories} />
                </Suspense>
              );

            case "featured":
            case "bestSellers":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={320} />}>
                  <FeaturedProducts featuredSection={cms.featuredSection} products={cms.products} />
                </Suspense>
              );

            case "story":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={300} />}>
                  <Story story={cms.story} />
                </Suspense>
              );

            case "faq":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={300} />}>
                  <Faq faqSection={cms.faqSection} faq={cms.faq} />
                </Suspense>
              );

            case "whyTara":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={300} />}>
                  <WhyTara why={cms.why} />
                </Suspense>
              );

            case "finalCta":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={220} />}>
                  <FinalCta settings={section.settings as FinalCtaThemeSettings} />
                </Suspense>
              );

            case "footer":
              return (
                <Suspense key={section.id} fallback={<SectionShell minH={200} />}>
                  <Footer brand={cms.brand} nav={cms.nav} footer={cms.footer} />
                </Suspense>
              );

            default:
              return null;
          }
        })}
    </>
  );
}
