import { useState } from "react";
import { useCms, newId } from "../../cms/store";
import type { Category } from "../../cms/types";
import { Field, PageHeader, Section, Toggle } from "../ui";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";

const ICONS = ["Home", "Car", "Plane", "Laptop2"];

const blank = (order: number): Category => ({
  id: newId("cat"),
  slug: "nouvelle-categorie",
  title: "Nouvelle catégorie",
  description: "",
  image:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  icon: "Home",
  hidden: false,
  order,
});

export default function AdminCategories() {
  const {
    categories,
    upsertCategory,
    removeCategory,
    reorderCategories,
    categorySection,
    setCategorySection,
  } = useCms();
  const [editingId, setEditingId] = useState<string | null>(null);
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const editing = sorted.find((c) => c.id === editingId);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sorted];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    reorderCategories(next.map((c) => c.id));
  };

  const onAdd = () => {
    const c = blank(sorted.length + 1);
    upsertCategory(c);
    setEditingId(c.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catégories"
        description="Ajoutez, réorganisez et masquez les catégories. Affichées dans la grille de la page d'accueil."
        actions={
          <button onClick={onAdd} className="btn-dark">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        }
      />

      {/* Grid layout controls — synced to Supabase via SaveBar */}
      <Section title="Mise en page de la grille">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Colonnes desktop" hint="1 à 4 colonnes sur grand écran.">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCategorySection({ columns: n })}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    (categorySection.columns ?? 4) === n
                      ? "bg-ink text-white border-ink"
                      : "border-line text-body hover:border-ink/40"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Colonnes mobile" hint="1 ou 2 colonnes sur petit écran.">
            <div className="flex gap-1">
              {[1, 2].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCategorySection({ mobileColumns: n })}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    (categorySection.mobileColumns ?? 1) === n
                      ? "bg-ink text-white border-ink"
                      : "border-line text-body hover:border-ink/40"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Liste">
        <div className="grid gap-2">
          {sorted.map((c, idx) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3"
            >
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-bg shrink-0">
                <img src={c.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink truncate">{c.title}</span>
                  {c.hidden && <span className="pill text-[10px]">Masquée</span>}
                </div>
                <div className="text-xs text-body truncate">/{c.slug}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="h-8 w-8 grid place-items-center rounded-lg border border-line hover:bg-ink/5"
                  onClick={() => move(idx, -1)}
                  title="Monter"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  className="h-8 w-8 grid place-items-center rounded-lg border border-line hover:bg-ink/5"
                  onClick={() => move(idx, 1)}
                  title="Descendre"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  className="btn-ghost py-1.5"
                  onClick={() =>
                    setEditingId(editingId === c.id ? null : c.id)
                  }
                >
                  {editingId === c.id ? "Fermer" : "Modifier"}
                </button>
                <button
                  className="h-8 w-8 grid place-items-center rounded-lg border border-line text-red hover:bg-red/5"
                  onClick={() => {
                    if (confirm(`Supprimer la catégorie "${c.title}" ?`))
                      removeCategory(c.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-sm text-body text-center py-6">
              Aucune catégorie. Cliquez sur "Ajouter".
            </div>
          )}
        </div>
      </Section>

      {editing && (
        <Section title={`Modifier — ${editing.title}`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Titre">
              <input
                className="input"
                value={editing.title}
                onChange={(e) =>
                  upsertCategory({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <Field label="Slug" hint="URL: /categories/&lt;slug&gt;">
              <input
                className="input"
                value={editing.slug}
                onChange={(e) =>
                  upsertCategory({
                    ...editing,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  })
                }
              />
            </Field>
            <Field label="Image (URL)">
              <input
                className="input"
                value={editing.image}
                onChange={(e) =>
                  upsertCategory({ ...editing, image: e.target.value })
                }
              />
            </Field>
            <Field label="Icône">
              <select
                className="input"
                value={editing.icon}
                onChange={(e) =>
                  upsertCategory({ ...editing, icon: e.target.value })
                }
              >
                {ICONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description (Darija)">
            <textarea
              className="input min-h-[100px]"
              value={editing.description}
              onChange={(e) =>
                upsertCategory({ ...editing, description: e.target.value })
              }
            />
          </Field>
          <div className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3">
            <span className="text-sm text-ink">Masquer la catégorie</span>
            <Toggle
              checked={editing.hidden}
              onChange={(v) => upsertCategory({ ...editing, hidden: v })}
            />
          </div>
        </Section>
      )}
    </div>
  );
}
