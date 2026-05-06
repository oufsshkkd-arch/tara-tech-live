import AnnouncementBar from "../../components/AnnouncementBar";
import Categories from "../../components/Categories";
import FeaturedProducts from "../../components/FeaturedProducts";
import FinalCta from "../../components/FinalCta";
import Footer from "../../components/Footer";
import WhyTara from "../../components/WhyTara";
import Faq from "../../components/Faq";
import HeroRevolut from "../../components/HeroRevolut";
import Story from "../../components/Story";
import { useCms } from "../../cms/store";
import type { HeroThemeSettings } from "../../cms/types";
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
            case "announcementBar":
              return <AnnouncementBar key={section.id} announcementBar={cms.announcementBar} />;
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
              return <FinalCta key={section.id} finalCta={cms.finalCta} />;
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
