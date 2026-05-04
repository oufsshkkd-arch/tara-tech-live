import { useState, useCallback } from "react";
import { useCms } from "../../cms/store";
import { Field, Toggle } from "../ui";
import type { HeroContent } from "../../cms/types";
import SplitEditor from "../SplitEditor";
import HeroPreview from "../previews/HeroPreview";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-body/40 pb-1 border-b border-line">
      {children}
    </p>
  );
}

export default function AdminHero() {
  const { hero, setHero } = useCms();
  const [draft, setDraft] = useState<HeroContent>(() => ({ ...hero }));

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(hero);

  const patch = (p: Partial<HeroContent>) =>
    setDraft((prev) => ({ ...prev, ...p }));

  const handleSave = useCallback(() => {
    setHero(draft);
  }, [draft, setHero]);

  return (
    <SplitEditor
      title="Hero Section"
      hasChanges={hasChanges}
      onSave={handleSave}
      renderPreview={(mode) => <HeroPreview data={draft} mode={mode} />}
    >
      {/* Text */}
      <div className="space-y-4">
        <SectionLabel>Text</SectionLabel>
        <Field label="Titre principal">
          <input
            className="input"
            value={draft.headline}
            onChange={(e) => patch({ headline: e.target.value })}
          />
        </Field>
        <Field label="Sous-titre" hint="Darija recommandée.">
          <textarea
            className="input min-h-[90px]"
            value={draft.subheadline}
            onChange={(e) => patch({ subheadline: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="CTA principal">
            <input
              className="input"
              value={draft.primaryCta}
              onChange={(e) => patch({ primaryCta: e.target.value })}
            />
          </Field>
          <Field label="CTA secondaire">
            <input
              className="input"
              value={draft.secondaryCta}
              onChange={(e) => patch({ secondaryCta: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Ligne de réassurance">
          <input
            className="input"
            value={draft.trustLine}
            onChange={(e) => patch({ trustLine: e.target.value })}
          />
        </Field>
        <Field label="Badge d'urgence">
          <input
            className="input"
            value={draft.urgencyBadge}
            onChange={(e) => patch({ urgencyBadge: e.target.value })}
          />
        </Field>
      </div>

      {/* Background */}
      <div className="space-y-4">
        <SectionLabel>Arrière-plan</SectionLabel>
        <Field
          label="URL image"
          hint="Laisser vide pour utiliser le mesh par défaut."
        >
          <input
            className="input"
            placeholder="https://..."
            value={draft.videoUrl}
            onChange={(e) => patch({ videoUrl: e.target.value })}
          />
        </Field>
        <Field
          label={`Intensité du voile — ${(draft.overlayDarkness * 100).toFixed(0)}%`}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={draft.overlayDarkness}
            onChange={(e) =>
              patch({ overlayDarkness: Number(e.target.value) })
            }
            className="w-full accent-ink"
          />
          <div className="flex justify-between text-[10px] text-body mt-0.5">
            <span>0%</span>
            <span>100%</span>
          </div>
        </Field>
      </div>

      {/* Trust chips */}
      <div className="space-y-3">
        <SectionLabel>Trust Chips (الأقراص تحت الأزرار)</SectionLabel>
        <div className="space-y-2">
          {(draft.trustChips ?? ["الدفع عند الاستلام", "تأكيد قبل الإرسال", "مراجعة المنتج قبل الشحن"]).map((chip, i) => {
            const chips = draft.trustChips ?? ["الدفع عند الاستلام", "تأكيد قبل الإرسال", "مراجعة المنتج قبل الشحن"];
            return (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  value={chip}
                  onChange={(e) => {
                    const next = [...chips];
                    next[i] = e.target.value;
                    patch({ trustChips: next });
                  }}
                />
                <button
                  className="shrink-0 h-9 w-9 grid place-items-center rounded-lg text-body hover:bg-red/5 hover:text-red transition-colors"
                  onClick={() => patch({ trustChips: chips.filter((_, j) => j !== i) })}
                >
                  ✕
                </button>
              </div>
            );
          })}
          <button
            className="btn-dark w-full"
            onClick={() => patch({ trustChips: [...(draft.trustChips ?? []), ""] })}
          >
            + أضف chip
          </button>
        </div>
        <Field label="نص الشح (scarcity)" hint="يظهر تحت الأقراص بخط رمادي.">
          <input
            className="input"
            value={draft.scarcityLine ?? ""}
            onChange={(e) => patch({ scarcityLine: e.target.value })}
          />
        </Field>
      </div>

      {/* End state */}
      <div className="space-y-4">
        <SectionLabel>End State (بعد الأنيميشن)</SectionLabel>
        <Field label="العنوان الكبير">
          <input
            className="input"
            value={draft.endTitle ?? ""}
            onChange={(e) => patch({ endTitle: e.target.value })}
          />
        </Field>
        <Field label="النص التحتي">
          <textarea
            className="input min-h-[80px]"
            value={draft.endSub ?? ""}
            onChange={(e) => patch({ endSub: e.target.value })}
          />
        </Field>
        <Field label="نص زر CTA">
          <input
            className="input"
            value={draft.endCta ?? ""}
            onChange={(e) => patch({ endCta: e.target.value })}
          />
        </Field>
        <Field label="تسمية كروت المنتجات" hint='الكلمة اللي كتظهر فوق السعر فكل كارد ("اختيار", "جديد"...)'>
          <input
            className="input"
            value={draft.cardLabel ?? ""}
            onChange={(e) => patch({ cardLabel: e.target.value })}
          />
        </Field>
      </div>
    </SplitEditor>
  );
}
