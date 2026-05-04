import { useState, useCallback } from "react";
import { useCms } from "../../cms/store";
import { Field, Toggle } from "../ui";
import type { HeroContent } from "../../cms/types";
import SplitEditor from "../SplitEditor";
import HeroPreview from "../previews/HeroPreview";
import ImageUpload from "../ImageUpload";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-body/40 pb-1 border-b border-line">
      {children}
    </p>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const display = format ? format(value) : String(value);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-body mb-1.5">
        <span>{label}</span>
        <span className="font-mono text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink h-1"
      />
    </div>
  );
}

function ColorPill({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] text-body/60 leading-none">{label}</span>
      <div className="relative h-8 w-8">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded-lg border border-line cursor-pointer p-0.5 bg-white"
        />
        {!value && (
          <div className="absolute inset-0 rounded-lg bg-white border border-dashed border-line/60 pointer-events-none flex items-center justify-center">
            <span className="text-[8px] text-body/30">auto</span>
          </div>
        )}
      </div>
      {value && (
        <button onClick={() => onChange("")} className="text-[9px] text-body/40 hover:text-red transition-colors leading-none">
          reset
        </button>
      )}
    </div>
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

      {/* Typography */}
      <div className="space-y-4">
        <SectionLabel>Typography</SectionLabel>

        <p className="text-[11px] text-body/50">Titre principal</p>
        <Slider
          label="Font Size"
          value={draft.titleFontSize ?? 96}
          min={32}
          max={140}
          step={2}
          format={(v) => `${v}px`}
          onChange={(v) => patch({ titleFontSize: v })}
        />
        <Slider
          label="Line Height"
          value={draft.titleLineHeight ?? 1.05}
          min={0.9}
          max={1.8}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(v) => patch({ titleLineHeight: v })}
        />

        <Slider
          label="Letter Spacing"
          value={draft.titleLetterSpacing ?? -0.03}
          min={-0.1}
          max={0.2}
          step={0.01}
          format={(v) => `${v.toFixed(2)}em`}
          onChange={(v) => patch({ titleLetterSpacing: v })}
        />

        <p className="text-[11px] text-body/50 pt-1">Sous-titre</p>
        <Slider
          label="Font Size"
          value={draft.subtitleFontSize ?? 18}
          min={12}
          max={32}
          step={1}
          format={(v) => `${v}px`}
          onChange={(v) => patch({ subtitleFontSize: v })}
        />
        <Slider
          label="Line Height"
          value={draft.subtitleLineHeight ?? 1.6}
          min={1.2}
          max={2.2}
          step={0.1}
          format={(v) => v.toFixed(1)}
          onChange={(v) => patch({ subtitleLineHeight: v })}
        />
        <Slider
          label="Letter Spacing"
          value={draft.subtitleLetterSpacing ?? 0}
          min={-0.05}
          max={0.2}
          step={0.01}
          format={(v) => `${v.toFixed(2)}em`}
          onChange={(v) => patch({ subtitleLetterSpacing: v })}
        />

        <div className="grid grid-cols-2 gap-4 pt-1">
          <ColorPill
            label="Couleur titre"
            value={draft.titleColor ?? ""}
            onChange={(v) => patch({ titleColor: v })}
          />
          <ColorPill
            label="Couleur sous-titre"
            value={draft.subtitleColor ?? ""}
            onChange={(v) => patch({ subtitleColor: v })}
          />
        </div>
      </div>

      {/* Background */}
      <div className="space-y-4">
        <SectionLabel>Arrière-plan</SectionLabel>

        {/* Media type toggle */}
        <Field label="Type de média">
          <div className="flex rounded-lg overflow-hidden border border-line">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                (draft.mediaType ?? "image") === "image"
                  ? "bg-ink text-white"
                  : "text-body hover:bg-line"
              }`}
              onClick={() => patch({ mediaType: "image" })}
            >
              🖼 Image
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                draft.mediaType === "video"
                  ? "bg-ink text-white"
                  : "text-body hover:bg-line"
              }`}
              onClick={() => patch({ mediaType: "video" })}
            >
              🎬 Vidéo
            </button>
          </div>
        </Field>

        {draft.mediaType === "video" ? (
          <>
            <Field
              label="Vidéo (MP4 / WebM)"
              hint="Upload un fichier ou colle un lien direct — YouTube/Vimeo ne fonctionnent pas en arrière-plan."
            >
              <ImageUpload
                value={draft.videoUrl}
                onChange={(v) => patch({ videoUrl: v })}
                placeholder="https://example.com/video.mp4"
                aspectRatio="aspect-video"
              />
            </Field>
            <Field
              label="Poster image"
              hint="Image affichée pendant le chargement de la vidéo — évite l'écran noir."
            >
              <ImageUpload
                value={draft.videoPoster ?? ""}
                onChange={(v) => patch({ videoPoster: v })}
                placeholder="https://example.com/poster.jpg"
                aspectRatio="aspect-video"
              />
            </Field>
          </>
        ) : (
          <Field
            label="Image d'arrière-plan"
            hint="Upload ou colle un lien. Laisser vide = image par défaut."
          >
            <ImageUpload
              value={draft.videoUrl}
              onChange={(v) => patch({ videoUrl: v })}
              placeholder="https://..."
              aspectRatio="aspect-video"
            />
          </Field>
        )}

        <Field
          label={`Voile sombre — ${Math.round((draft.overlayDarkness ?? 0.15) * 100)}%`}
          hint="Assombrit la photo/vidéo pour rendre le texte blanc plus lisible."
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={draft.overlayDarkness ?? 0.15}
            onChange={(e) =>
              patch({ overlayDarkness: Number(e.target.value) })
            }
            className="w-full accent-ink"
          />
          <div className="flex justify-between text-[10px] text-body mt-0.5">
            <span>Transparent</span>
            <span>Très sombre</span>
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
