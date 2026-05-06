import {
  Sparkles,
  ShieldCheck,
  Wallet,
  ClipboardCheck,
  HeadphonesIcon,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../cms/store";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  ShieldCheck,
  Wallet,
  ClipboardCheck,
  HeadphonesIcon,
};

const DEFAULT_ICONS = ["Sparkles", "ShieldCheck", "Wallet", "ClipboardCheck", "HeadphonesIcon"];

export default function WhyTara() {
  const { why } = useCms();
  const pillLabel = why.pillLabel || "علاش حنا";
  const icons = why.icons?.length ? why.icons : DEFAULT_ICONS;

  return (
    <section id="why" className="container-x pt-24 sm:pt-32">
      <div className="rounded-2xl bg-ink text-white p-8 sm:p-14 relative overflow-hidden">
        {/* Ambient glow — top-right */}
        <div
          className="absolute -top-32 -right-20 h-[400px] w-[400px] rounded-full opacity-25 pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(180,35,24,0.55), transparent 70%)",
          }}
        />
        {/* Ambient glow — bottom-left */}
        <div
          className="absolute -bottom-24 -left-20 h-[360px] w-[360px] rounded-full opacity-15 pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.35), transparent 70%)",
          }}
        />

        <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ── Left column: heading ── */}
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium text-white/70 mb-5">
              {pillLabel}
            </span>
            <h2
              className="font-sans font-extrabold text-4xl sm:text-5xl leading-tight tracking-[-0.02em]"
              dir="auto"
            >
              {why.title}
            </h2>
            <p
              className="mt-5 text-white/65 leading-relaxed max-w-md"
              dir="auto"
            >
              {why.intro}
            </p>
          </div>

          {/* ── Right column: feature cards ── */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
            {why.points.map((p, i) => {
              const iconName = icons[i % icons.length];
              const Icon = ICON_MAP[iconName] ?? Sparkles;
              return (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm p-5 transition-colors hover:bg-white/[0.1]"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="h-10 w-10 rounded-xl bg-red/15 text-red grid place-items-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="text-[15px] font-medium leading-snug pt-2">
                      {p}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
