import { useCms } from "../../cms/store";
import { PageHeader, Section, Field } from "../ui";

export default function AdminFooter() {
  const { footer, setFooter, brand, setBrand } = useCms();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Footer"
        description="Personnalisez le pied de page du site."
      />

      <Section title="Contenu du footer">
        <Field label="Phrase de marque (tagline)" hint="Apparaît sous le logo dans le footer.">
          <textarea
            className="input min-h-[60px]"
            value={footer.tagline}
            onChange={(e) => setFooter({ tagline: e.target.value })}
          />
        </Field>
        <Field label="Texte bas gauche" hint="Ex: © 2026 Tara Tech. جميع الحقوق محفوظة.">
          <input
            className="input"
            value={footer.bottomLeft}
            onChange={(e) => setFooter({ bottomLeft: e.target.value })}
          />
        </Field>
        <Field label="Texte bas droite" hint="Ex: صنع بعناية فالمغرب.">
          <input
            className="input"
            value={footer.bottomRight}
            onChange={(e) => setFooter({ bottomRight: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Contact (lié à Marque & SEO)">
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
      </Section>

      <Section title="Liens légaux">
        <div className="space-y-3">
          {brand.legalLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Label"
                value={link.label}
                onChange={(e) => {
                  const next = [...brand.legalLinks];
                  next[i] = { ...next[i], label: e.target.value };
                  setBrand({ legalLinks: next });
                }}
              />
              <input
                className="input flex-1"
                placeholder="URL"
                value={link.href}
                onChange={(e) => {
                  const next = [...brand.legalLinks];
                  next[i] = { ...next[i], href: e.target.value };
                  setBrand({ legalLinks: next });
                }}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
