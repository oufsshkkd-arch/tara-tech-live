import { useCms } from "../../cms/store";
import { Field, PageHeader, Section } from "../ui";

export default function AdminBrand() {
  const { brand, nav, setBrand, setNav } = useCms();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marque & SEO"
        description="Identité, logo, contact, navigation et métadonnées du site."
      />

      <Section title="Identité">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom de la marque">
            <input
              className="input"
              value={brand.brandName}
              onChange={(e) => setBrand({ brandName: e.target.value })}
            />
          </Field>
          <Field label="Texte du logo">
            <input
              className="input"
              value={brand.logoText}
              onChange={(e) => setBrand({ logoText: e.target.value })}
            />
          </Field>
          <Field label="Tagline" hint="Phrase courte affichée dans le footer.">
            <input
              className="input"
              value={brand.brandLine}
              onChange={(e) => setBrand({ brandLine: e.target.value })}
            />
          </Field>
          <Field label="Tagline secondaire">
            <input
              className="input"
              value={brand.tagline}
              onChange={(e) => setBrand({ tagline: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Couleurs">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Couleur de fond">
            <input
              type="color"
              className="input h-10 p-1"
              value={brand.bgColor}
              onChange={(e) => setBrand({ bgColor: e.target.value })}
            />
          </Field>
          <Field label="Couleur du texte">
            <input
              type="color"
              className="input h-10 p-1"
              value={brand.textColor}
              onChange={(e) => setBrand({ textColor: e.target.value })}
            />
          </Field>
          <Field label="Couleur CTA">
            <input
              type="color"
              className="input h-10 p-1"
              value={brand.ctaColor}
              onChange={(e) => setBrand({ ctaColor: e.target.value })}
            />
          </Field>
          <Field label="CTA hover">
            <input
              type="color"
              className="input h-10 p-1"
              value={brand.ctaHoverColor}
              onChange={(e) => setBrand({ ctaHoverColor: e.target.value })}
            />
          </Field>
          <Field label="Primaire">
            <input
              type="color"
              className="input h-10 p-1"
              value={brand.primaryColor}
              onChange={(e) => setBrand({ primaryColor: e.target.value })}
            />
          </Field>
        </div>
        <p className="text-[11px] text-body">
          Note: les couleurs principales du thème (off-white, encre, rouge) sont définies par défaut. Ces réglages permettent une personnalisation future via tokens.
        </p>
      </Section>

      <Section title="Contact">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="WhatsApp">
            <input
              className="input"
              value={brand.whatsapp}
              onChange={(e) => setBrand({ whatsapp: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <input
              className="input"
              value={brand.email}
              onChange={(e) => setBrand({ email: e.target.value })}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              className="input"
              value={brand.socials.instagram ?? ""}
              onChange={(e) =>
                setBrand({
                  socials: { ...brand.socials, instagram: e.target.value },
                })
              }
            />
          </Field>
          <Field label="TikTok URL">
            <input
              className="input"
              value={brand.socials.tiktok ?? ""}
              onChange={(e) =>
                setBrand({
                  socials: { ...brand.socials, tiktok: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Facebook URL">
            <input
              className="input"
              value={brand.socials.facebook ?? ""}
              onChange={(e) =>
                setBrand({
                  socials: { ...brand.socials, facebook: e.target.value },
                })
              }
            />
          </Field>
        </div>
      </Section>

      <Section title="Navigation">
        <div className="grid sm:grid-cols-2 gap-4">
          {(
            [
              ["home", "Accueil"],
              ["categories", "Catégories"],
              ["products", "Produits"],
              ["story", "Notre Histoire"],
              ["faq", "FAQ"],
              ["contact", "Contact"],
            ] as const
          ).map(([k, l]) => (
            <Field key={k} label={l}>
              <input
                className="input"
                value={nav.labels[k]}
                onChange={(e) =>
                  setNav({ labels: { ...nav.labels, [k]: e.target.value } })
                }
              />
            </Field>
          ))}
          <Field label="CTA principal du header">
            <input
              className="input"
              value={nav.primaryCta}
              onChange={(e) => setNav({ primaryCta: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="SEO & Liens légaux">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Titre SEO">
            <input
              className="input"
              value={brand.seo.title}
              onChange={(e) =>
                setBrand({ seo: { ...brand.seo, title: e.target.value } })
              }
            />
          </Field>
          <Field label="Description SEO">
            <input
              className="input"
              value={brand.seo.description}
              onChange={(e) =>
                setBrand({
                  seo: { ...brand.seo, description: e.target.value },
                })
              }
            />
          </Field>
        </div>
        <div className="space-y-2">
          {brand.legalLinks.map((l, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Libellé"
                value={l.label}
                onChange={(e) => {
                  const next = [...brand.legalLinks];
                  next[i] = { ...next[i], label: e.target.value };
                  setBrand({ legalLinks: next });
                }}
              />
              <input
                className="input flex-1"
                placeholder="URL"
                value={l.href}
                onChange={(e) => {
                  const next = [...brand.legalLinks];
                  next[i] = { ...next[i], href: e.target.value };
                  setBrand({ legalLinks: next });
                }}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={() =>
                  setBrand({
                    legalLinks: brand.legalLinks.filter((_, j) => j !== i),
                  })
                }
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-dark"
            onClick={() =>
              setBrand({
                legalLinks: [...brand.legalLinks, { label: "", href: "" }],
              })
            }
          >
            Ajouter un lien
          </button>
        </div>
      </Section>
    </div>
  );
}
