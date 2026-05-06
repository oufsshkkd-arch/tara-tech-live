import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../cms/store";

const STORY_IMAGE = "/story-editorial.png";

const DEFAULT_VALUE_CHIPS = [
  { label: "مختارة", sub: "تنسيق تحريري" },
  { label: "موثوقة", sub: "ثقة وجودة" },
  { label: "محلية", sub: "خدمة المغرب" },
];

export default function Story() {
  const { story } = useCms();

  const values = story.valueChips?.length ? story.valueChips : DEFAULT_VALUE_CHIPS;
  const pillLabel = story.pillLabel || "قصتنا";
  const ctaText = story.ctaText || "اقرأ قصتنا";
  const ctaLink = story.ctaLink || "/notre-histoire";
  const overlayTitle = story.overlayTitle || "براند مغربية";
  const overlaySub = story.overlaySub || "مفكر فيها بعناية · مختارة بذوق";

  return (
    <section id="story" className="container-x pt-24 sm:pt-32">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* ── Visual column ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-line bg-white shadow-soft">
            <div className="aspect-[4/5]">
              <img
                src={story.image || STORY_IMAGE}
                alt="قصتنا"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = STORY_IMAGE;
                }}
              />
            </div>
            {/* Branded overlay card */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="rounded-xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-soft px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-full bg-ink text-white grid place-items-center shrink-0">
                    <span className="display text-sm italic leading-none">T</span>
                  </span>
                  <div>
                    <div
                      className="font-sans font-bold text-[15px] leading-tight text-ink"
                      dir="auto"
                    >
                      {overlayTitle}
                    </div>
                    <div className="text-[11px] text-body mt-0.5" dir="auto">
                      {overlaySub}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Text column ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <span className="pill mb-5">{pillLabel}</span>
          <h2
            className="font-sans font-extrabold text-4xl sm:text-5xl text-ink leading-tight tracking-[-0.02em]"
            dir="auto"
          >
            {story.title}
          </h2>
          <p
            className="mt-6 text-base sm:text-lg text-body leading-relaxed max-w-xl"
            dir="auto"
          >
            {story.body}
          </p>

          {/* Value chips */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {values.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-white p-4 text-center shadow-soft transition-shadow hover:shadow-lift"
              >
                <div
                  className="font-sans font-bold text-base text-ink"
                  dir="auto"
                >
                  {s.label}
                </div>
                <div className="text-[11px] text-body mt-1" dir="auto">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              to={ctaLink}
              className="btn-ghost inline-flex"
            >
              {ctaText}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
