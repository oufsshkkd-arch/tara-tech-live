import AnnouncementBar from "../../components/AnnouncementBar";
import Categories from "../../components/Categories";
import FeaturedProducts from "../../components/FeaturedProducts";
import FinalCta from "../../components/FinalCta";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import WhyTara from "../../components/WhyTara";
import Faq from "../../components/Faq";
import HeroRevolut from "../../components/HeroRevolut";
import RevolutBenefits from "../../components/RevolutBenefits";
import Story from "../../components/Story";
import TrustMarquee from "../../components/TrustMarquee";
import { useCms } from "../../cms/store";
import type {
  AnnouncementThemeSettings,
  FinalCtaThemeSettings,
  HeroThemeSettings,
  RevolutBenefitsThemeSettings,
} from "../../cms/types";
import type { EditorSection } from "./types";

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
            case "trustMarquee":
              return <TrustMarquee key={section.id} />;
            case "revolutBenefits":
              return (
                <RevolutBenefits
                  key={section.id}
                  settings={section.settings as RevolutBenefitsThemeSettings}
                />
              );
            case "announcementBar":
              {
                const settings = section.settings as AnnouncementThemeSettings;
                return (
                  <AnnouncementBar
                    key={section.id}
                    announcementBar={{
                      enabled: section.enabled && settings.enabled,
                      link: settings.link,
                      backgroundColor: settings.backgroundColor,
                      textColor: settings.textColor,
                      speed: cms.announcementBar.speed || 40,
                      messages: [
                        {
                          id: `${section.id}-message`,
                          text: settings.text,
                          accent: false,
                          order: 1,
                        },
                      ],
                    }}
                  />
                );
              }
            case "categories":
              return (
                <Categories
                  key={section.id}
                  categorySection={cms.categorySection}
                  categories={cms.categories}
                />
              );
            case "featured":
            case "bestSellers":
              return (
                <FeaturedProducts
                  key={section.id}
                  featuredSection={cms.featuredSection}
                  products={cms.products}
                />
              );
            case "story":
              return <Story key={section.id} story={cms.story} />;
            case "faq":
              return <Faq key={section.id} faqSection={cms.faqSection} faq={cms.faq} />;
            case "whyTara":
              return <WhyTara key={section.id} why={cms.why} />;
            case "finalCta":
              return (
                <FinalCta
                  key={section.id}
                  settings={section.settings as FinalCtaThemeSettings}
                />
              );
            case "footer":
              return (
                <Footer
                  key={section.id}
                  brand={cms.brand}
                  nav={cms.nav}
                  footer={cms.footer}
                />
              );
            default:
              return null;
          }
        })}
    </>
  );
}
