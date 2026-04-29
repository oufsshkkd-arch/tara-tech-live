import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCms } from "../../cms/store";
import { Field, PageHeader, Section, Toggle } from "../ui";

const labels: Record<string, string> = {
  hero: "Hero",
  categories: "Catégories",
  featured: "Produits sélectionnés",
  trustStrip: "Bandeau de confiance",
  story: "Notre Histoire",
  why: "Pourquoi Tara Tech",
  faq: "FAQ",
  finalCta: "CTA final",
};

export default function AdminSections() {
  const {
    visibility,
    setVisibility,
    categorySection,
    setCategorySection,
    featuredSection,
    setFeaturedSection,
    faqSection,
    setFaqSection,
    why,
    setWhy,
    finalCta,
    setFinalCta,
  } = useCms();

  const [newPoint, setNewPoint] = useState("");

  const addPoint = () => {
    if (!newPoint.trim()) return;
    setWhy({ points: [...why.points, newPoint.trim()] });
    setNewPoint("");
  };

  const removePoint = (idx: number) => {
    setWhy({ points: why.points.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sections de la page"
        description="Affichez ou masquez les sections de la page d'accueil et personnalisez leurs textes."
      />

      <Section title="Visibilité des sections">
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.keys(visibility) as (keyof typeof visibility)[]).map((k) => (
            <div
              key={k}
              className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3"
            >
              <span className="text-sm text-ink">{labels[k]}</span>
              <Toggle
                checked={visibility[k]}
                onChange={(v) => setVisibility({ [k]: v } as any)}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Section Catégories">
        <Field label="Titre">
          <input
            className="input"
            value={categorySection.title}
            onChange={(e) => setCategorySection({ title: e.target.value })}
          />
        </Field>
        <Field label="Texte d'introduction">
          <textarea
            className="input min-h-[80px]"
            value={categorySection.intro}
            onChange={(e) => setCategorySection({ intro: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Section Produits sélectionnés">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink">Activer la section</span>
          <Toggle
            checked={featuredSection.enabled}
            onChange={(v) => setFeaturedSection({ enabled: v })}
          />
        </div>
        <Field label="Titre">
          <input
            className="input"
            value={featuredSection.title}
            onChange={(e) => setFeaturedSection({ title: e.target.value })}
          />
        </Field>
        <Field label="Texte d'introduction">
          <textarea
            className="input min-h-[80px]"
            value={featuredSection.intro}
            onChange={(e) => setFeaturedSection({ intro: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Section « Pourquoi Tara Tech »">
        <Field label="Titre">
          <input
            className="input"
            value={why.title}
            onChange={(e) => setWhy({ title: e.target.value })}
          />
        </Field>
        <Field label="Texte d'introduction">
          <textarea
            className="input min-h-[80px]"
            value={why.intro}
            onChange={(e) => setWhy({ intro: e.target.value })}
          />
        </Field>
        <Field label="Points de valeur">
          <div className="space-y-2 mb-3">
            {why.points.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  value={p}
                  onChange={(e) => {
                    const next = [...why.points];
                    next[i] = e.target.value;
                    setWhy({ points: next });
                  }}
                />
                <button
                  onClick={() => removePoint(i)}
                  className="text-red hover:text-red-dark shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Nouveau point..."
              value={newPoint}
              onChange={(e) => setNewPoint(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPoint()}
            />
            <button onClick={addPoint} className="btn-dark shrink-0">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </Field>
      </Section>

      <Section title="Section FAQ">
        <Field label="Titre">
          <input
            className="input"
            value={faqSection.title}
            onChange={(e) => setFaqSection({ title: e.target.value })}
          />
        </Field>
        <Field label="Texte d'introduction">
          <textarea
            className="input min-h-[80px]"
            value={faqSection.intro}
            onChange={(e) => setFaqSection({ intro: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Section CTA final">
        <Field label="Titre">
          <input
            className="input"
            value={finalCta.title}
            onChange={(e) => setFinalCta({ title: e.target.value })}
          />
        </Field>
        <Field label="Corps du texte">
          <textarea
            className="input min-h-[80px]"
            value={finalCta.body}
            onChange={(e) => setFinalCta({ body: e.target.value })}
          />
        </Field>
        <Field label="Texte CTA principal">
          <input
            className="input"
            value={finalCta.primaryCta}
            onChange={(e) => setFinalCta({ primaryCta: e.target.value })}
          />
        </Field>
        <Field label="Texte CTA secondaire">
          <input
            className="input"
            value={finalCta.secondaryCta}
            onChange={(e) => setFinalCta({ secondaryCta: e.target.value })}
          />
        </Field>
      </Section>
    </div>
  );
}
