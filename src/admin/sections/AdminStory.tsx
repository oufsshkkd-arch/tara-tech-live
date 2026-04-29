import { useCms } from "../../cms/store";
import { Field, PageHeader, Section } from "../ui";
import { Plus, Trash2 } from "lucide-react";

export default function AdminStory() {
  const { story, why, finalCta, setStory, setWhy, setFinalCta } = useCms();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Histoire & CTA"
        description="Notre histoire, raisons de croire, et bloc final de conversion."
      />

      <Section title="Notre Histoire">
        <Field label="Titre">
          <input
            className="input"
            value={story.title}
            onChange={(e) => setStory({ title: e.target.value })}
          />
        </Field>
        <Field label="Image (URL)">
          <input
            className="input"
            value={story.image}
            onChange={(e) => setStory({ image: e.target.value })}
          />
        </Field>
        <Field label="Texte">
          <textarea
            className="input min-h-[160px]"
            value={story.body}
            onChange={(e) => setStory({ body: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Pourquoi Tara Tech">
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
        <div>
          <div className="label">Points</div>
          <div className="space-y-2">
            {why.points.map((p, i) => (
              <div key={i} className="flex gap-2">
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
                  className="h-10 w-10 grid place-items-center rounded-lg border border-line text-red hover:bg-red/5"
                  onClick={() =>
                    setWhy({
                      points: why.points.filter((_, j) => j !== i),
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              className="btn-dark"
              onClick={() => setWhy({ points: [...why.points, "Nouveau point"] })}
            >
              <Plus className="h-4 w-4" />
              Ajouter un point
            </button>
          </div>
        </div>
      </Section>

      <Section title="CTA final">
        <Field label="Titre">
          <input
            className="input"
            value={finalCta.title}
            onChange={(e) => setFinalCta({ title: e.target.value })}
          />
        </Field>
        <Field label="Texte">
          <textarea
            className="input min-h-[80px]"
            value={finalCta.body}
            onChange={(e) => setFinalCta({ body: e.target.value })}
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="CTA principal">
            <input
              className="input"
              value={finalCta.primaryCta}
              onChange={(e) => setFinalCta({ primaryCta: e.target.value })}
            />
          </Field>
          <Field label="CTA secondaire">
            <input
              className="input"
              value={finalCta.secondaryCta}
              onChange={(e) => setFinalCta({ secondaryCta: e.target.value })}
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}
