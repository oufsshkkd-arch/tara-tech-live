import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useCms } from "../cms/store";

export default function FinalCta() {
  const { finalCta } = useCms();
  return (
    <section className="container-x pt-24 sm:pt-32">
      <div className="relative rounded-2xl border border-line bg-white shadow-soft p-8 sm:p-16 anim-wave">
        <div className="absolute inset-0 bg-bg/40 rounded-2xl" />
        <div className="relative grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="pill-red mb-4">مرحبا فـ Tara Tech</span>
            <h2
              className="font-sans font-extrabold text-4xl sm:text-6xl text-ink leading-[1.05] tracking-[-0.03em]"
              dir="auto"
            >
              {finalCta.title}
            </h2>
            <p className="mt-5 text-body max-w-2xl leading-relaxed" dir="auto">
              {finalCta.body}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link to="/products" className="btn-primary justify-center w-full">
              {finalCta.primaryCta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-ghost justify-center w-full">
              {finalCta.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
