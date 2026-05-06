import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useCms } from "../cms/store";
import ScrollReveal from "./ScrollReveal";
import type { FinalCtaContent, FinalCtaThemeSettings } from "../cms/types";

export default function FinalCta({
  finalCta: finalCtaProp,
  settings,
}: {
  finalCta?: FinalCtaContent;
  settings?: FinalCtaThemeSettings;
} = {}) {
  const cms = useCms();
  const finalCta = settings
    ? {
        title: settings.title,
        body: settings.body,
        primaryCta: settings.primaryCta,
        secondaryCta: settings.secondaryCta,
        primaryCtaLink: settings.primaryCtaLink,
        secondaryCtaLink: settings.secondaryCtaLink,
        pillLabel: settings.pillLabel,
      }
    : (finalCtaProp ?? cms.finalCta);
  return (
    <section className="bg-slate-50 px-4 py-20 sm:py-28">
      <ScrollReveal className="container-x">
      <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-slate-950 p-8 shadow-[0_30px_110px_rgba(15,23,42,0.25)] sm:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(29,78,216,0.42),transparent_34%),linear-gradient(135deg,#020617,#0f172a)]" />
        <div className="relative grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-white backdrop-blur">
              {finalCta.pillLabel || "مرحبا فـ Tara Tech"}
            </span>
            <h2
              className="font-sans text-4xl font-black leading-[1.02] text-white sm:text-6xl"
              dir="rtl"
              style={{ overflowWrap: "anywhere", letterSpacing: 0 }}
            >
              {finalCta.title}
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-slate-300" dir="auto">
              {finalCta.body}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link to={finalCta.primaryCtaLink || "/products"} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100">
              {finalCta.primaryCta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to={finalCta.secondaryCtaLink || "/contact"} className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">
              {finalCta.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}
