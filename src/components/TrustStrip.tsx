import {
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  HeadphonesIcon,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../cms/store";

const ICON_MAP: Record<string, LucideIcon> = {
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  HeadphonesIcon,
};

export default function TrustStrip() {
  const { trustStrip } = useCms();

  return (
    <section data-section="trustStrip" className="container-x pt-24 sm:pt-32">
      <div className="rounded-2xl border border-line bg-white shadow-soft p-6 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 anim-aurora">
        {trustStrip.map((it, i) => {
          const Icon: LucideIcon = ICON_MAP[it.icon] ?? Wallet;
          return (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex gap-4"
            >
              <span className="h-11 w-11 grid place-items-center rounded-xl bg-ink/5 text-ink shrink-0">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink" dir="auto">{it.title}</div>
                <div className="text-xs text-body mt-1" dir="auto">{it.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
