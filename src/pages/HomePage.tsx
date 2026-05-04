import Hero from "../components/Hero";
import TrustMarquee from "../components/TrustMarquee";
import RevolutBenefits from "../components/RevolutBenefits";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import TrustStrip from "../components/TrustStrip";
import Story from "../components/Story";
import WhyTara from "../components/WhyTara";
import Faq from "../components/Faq";
import FinalCta from "../components/FinalCta";
import { useCms } from "../cms/store";

function Divider() {
  return <div className="section-divider mt-24 sm:mt-32" />;
}

const DEFAULT_ORDER = ["hero", "categories", "featured", "trustStrip", "story", "why", "faq", "finalCta"];

export default function HomePage() {
  const { visibility, themeSchema } = useCms();
  const sectionOrder = themeSchema?.sectionOrder ?? DEFAULT_ORDER;

  function renderSection(id: string) {
    const partial = themeSchema?.sections?.[id];
    const style = partial
      ? {
          fontSize: partial.fontSize ? `${partial.fontSize}px` : undefined,
          lineHeight: partial.lineHeight || undefined,
          backgroundColor: partial.bgColor || undefined,
          color: partial.textColor || undefined,
          fontFamily: partial.fontFamily || undefined,
          paddingTop: partial.paddingTop != null ? `${partial.paddingTop}px` : undefined,
          paddingBottom: partial.paddingBottom != null ? `${partial.paddingBottom}px` : undefined,
        }
      : undefined;

    let content: React.ReactNode = null;

    switch (id) {
      case "hero":
        if (!visibility.hero) return null;
        content = (
          <>
            <Hero />
            <TrustMarquee />
            <RevolutBenefits />
          </>
        );
        break;
      case "categories":
        if (!visibility.categories) return null;
        content = <Categories />;
        break;
      case "featured":
        if (!visibility.featured) return null;
        content = (
          <>
            <Divider />
            <FeaturedProducts />
          </>
        );
        break;
      case "trustStrip":
        if (!visibility.trustStrip) return null;
        content = <TrustStrip />;
        break;
      case "story":
        if (!visibility.story) return null;
        content = (
          <>
            <Divider />
            <Story />
          </>
        );
        break;
      case "why":
        if (!visibility.why) return null;
        content = <WhyTara />;
        break;
      case "faq":
        if (!visibility.faq) return null;
        content = (
          <>
            <Divider />
            <Faq />
          </>
        );
        break;
      case "finalCta":
        if (!visibility.finalCta) return null;
        content = <FinalCta />;
        break;
      default:
        return null;
    }

    return (
      <div key={id} data-section={id} style={style ?? undefined}>
        {content}
      </div>
    );
  }

  return <>{sectionOrder.map((id) => renderSection(id))}</>;
}
