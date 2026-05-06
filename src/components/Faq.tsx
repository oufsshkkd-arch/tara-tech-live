import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useCms } from "../cms/store";

export default function Faq() {
  const { faqSection, faq } = useCms();
  const items = [...faq].filter((item) => item.enabled !== false).sort((a, b) => a.order - b.order);
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section id="faq" className="container-x pt-24 sm:pt-32">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <span className="pill mb-4">الأسئلة</span>
          <h2
            className="font-sans font-extrabold text-4xl sm:text-5xl text-ink leading-tight tracking-[-0.02em]"
            dir="auto"
          >
            {faqSection.title}
          </h2>
          <p className="mt-5 text-body leading-relaxed" dir="auto">
            {faqSection.intro}
          </p>
        </div>
        <div className="lg:col-span-8 flex flex-col gap-3">
          {items.map((item) => {
            const isOpen = open === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white transition-colors ${
                  isOpen ? "border-ink/30 shadow-soft" : "border-line"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                >
                  <span className="text-base sm:text-lg font-medium text-ink" dir="auto">
                    {item.question}
                  </span>
                  <span
                    className={`h-9 w-9 grid place-items-center rounded-full border border-line shrink-0 transition-transform ${
                      isOpen ? "rotate-45 bg-ink text-white border-ink" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-5 sm:px-6 pb-5 -mt-1 text-body leading-relaxed"
                        dir="auto"
                      >
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
