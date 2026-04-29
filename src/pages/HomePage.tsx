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

export default function HomePage() {
  const { visibility } = useCms();
  return (
    <>
      {visibility.hero && <Hero />}
      <TrustMarquee />
      <RevolutBenefits />
      {visibility.categories && <Categories />}
      {visibility.featured && (
        <>
          <Divider />
          <FeaturedProducts />
        </>
      )}
      {visibility.trustStrip && <TrustStrip />}
      {visibility.story && (
        <>
          <Divider />
          <Story />
        </>
      )}
      {visibility.why && <WhyTara />}
      {visibility.faq && (
        <>
          <Divider />
          <Faq />
        </>
      )}
      {visibility.finalCta && <FinalCta />}
    </>
  );
}
