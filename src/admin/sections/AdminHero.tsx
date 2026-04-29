import { useCms } from "../../cms/store";
import { Field, PageHeader, Section, Toggle } from "../ui";

export default function AdminHero() {
  const { hero, setHero } = useCms();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Section Hero"
        description="Le bloc d'ouverture du site — première impression."
      />

      <Section title="Texte">
        <div className="grid gap-4">
          <Field label="Titre principal">
            <input
              className="input"
              value={hero.headline}
              onChange={(e) => setHero({ headline: e.target.value })}
            />
          </Field>
          <Field label="Sous-titre" hint="Darija recommandée.">
            <textarea
              className="input min-h-[100px]"
              value={hero.subheadline}
              onChange={(e) => setHero({ subheadline: e.target.value })}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CTA principal">
              <input
                className="input"
                value={hero.primaryCta}
                onChange={(e) => setHero({ primaryCta: e.target.value })}
              />
            </Field>
            <Field label="CTA secondaire">
              <input
                className="input"
                value={hero.secondaryCta}
                onChange={(e) => setHero({ secondaryCta: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Ligne de réassurance" hint="Sous le bouton.">
            <input
              className="input"
              value={hero.trustLine}
              onChange={(e) => setHero({ trustLine: e.target.value })}
            />
          </Field>
          <Field label="Badge d'urgence (rouge)">
            <input
              className="input"
              value={hero.urgencyBadge}
              onChange={(e) => setHero({ urgencyBadge: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Arrière-plan">
        <Field
          label="URL vidéo (optionnelle)"
          hint="Laissez vide pour utiliser l'animation mesh par défaut."
        >
          <input
            className="input"
            placeholder="https://..."
            value={hero.videoUrl}
            onChange={(e) => setHero({ videoUrl: e.target.value })}
          />
        </Field>
        <Field
          label={`Intensité du voile (${(hero.overlayDarkness * 100).toFixed(0)}%)`}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={hero.overlayDarkness}
            onChange={(e) =>
              setHero({ overlayDarkness: Number(e.target.value) })
            }
            className="w-full"
          />
        </Field>
      </Section>

      <Section title="Carte flottante (glass)">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink">Afficher la carte</span>
          <Toggle
            checked={hero.showFloatingCard}
            onChange={(v) => setHero({ showFloatingCard: v })}
          />
        </div>
        {hero.showFloatingCard && (
          <div className="grid gap-3">
            {hero.floatingCardLines.map((line, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  value={line}
                  onChange={(e) => {
                    const next = [...hero.floatingCardLines];
                    next[i] = e.target.value;
                    setHero({ floatingCardLines: next });
                  }}
                />
                <button
                  className="btn-ghost"
                  onClick={() =>
                    setHero({
                      floatingCardLines: hero.floatingCardLines.filter(
                        (_, j) => j !== i
                      ),
                    })
                  }
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              className="btn-dark"
              onClick={() =>
                setHero({
                  floatingCardLines: [...hero.floatingCardLines, "Nouveau"],
                })
              }
            >
              Ajouter une ligne
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
