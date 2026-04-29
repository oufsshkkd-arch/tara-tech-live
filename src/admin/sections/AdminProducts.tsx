import { useState } from "react";
import { useCms, newId } from "../../cms/store";
import type { Product } from "../../cms/types";
import { Field, PageHeader, Section, Toggle } from "../ui";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";

const blank = (order: number, categoryId: string): Product => ({
  id: newId("p"),
  slug: "nouveau-produit",
  title: "Nouveau produit",
  shortDescription: "",
  longDescription: "",
  price: 0,
  images: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  ],
  categoryId,
  featured: false,
  hidden: false,
  stock: "in",
  order,
});

export default function AdminProducts() {
  const {
    products,
    categories,
    upsertProduct,
    removeProduct,
    reorderProducts,
  } = useCms();
  const [editingId, setEditingId] = useState<string | null>(null);
  const sorted = [...products].sort((a, b) => a.order - b.order);
  const editing = sorted.find((p) => p.id === editingId);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sorted];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    reorderProducts(next.map((p) => p.id));
  };

  const onAdd = () => {
    const cat = categories[0]?.id ?? "";
    const p = blank(sorted.length + 1, cat);
    upsertProduct(p);
    setEditingId(p.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produits"
        description="Gérez le catalogue : ajout, édition, mise en avant, ordre, masquage."
        actions={
          <button onClick={onAdd} className="btn-dark">
            <Plus className="h-4 w-4" />
            Nouveau produit
          </button>
        }
      />

      <Section title="Catalogue">
        <div className="grid gap-2">
          {sorted.map((p, idx) => {
            const cat = categories.find((c) => c.id === p.categoryId);
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3"
              >
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-bg shrink-0">
                  <img
                    src={p.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink truncate">
                      {p.title}
                    </span>
                    {p.featured && <span className="pill text-[10px]">Featured</span>}
                    {p.hidden && <span className="pill text-[10px]">Masqué</span>}
                  </div>
                  <div className="text-xs text-body truncate">
                    {cat?.title ?? "—"} · {p.price} MAD
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="h-8 w-8 grid place-items-center rounded-lg border border-line hover:bg-ink/5"
                    onClick={() => move(idx, -1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    className="h-8 w-8 grid place-items-center rounded-lg border border-line hover:bg-ink/5"
                    onClick={() => move(idx, 1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    className="btn-ghost py-1.5"
                    onClick={() =>
                      setEditingId(editingId === p.id ? null : p.id)
                    }
                  >
                    {editingId === p.id ? "Fermer" : "Modifier"}
                  </button>
                  <button
                    className="h-8 w-8 grid place-items-center rounded-lg border border-line text-red hover:bg-red/5"
                    onClick={() => {
                      if (confirm(`Supprimer "${p.title}" ?`))
                        removeProduct(p.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="text-sm text-body text-center py-6">
              Aucun produit. Cliquez sur "Nouveau produit".
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
                  upsertProduct({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <Field label="Slug">
              <input
                className="input"
                value={editing.slug}
                onChange={(e) =>
                  upsertProduct({
                    ...editing,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  })
                }
              />
            </Field>
            <Field label="Catégorie">
              <select
                className="input"
                value={editing.categoryId}
                onChange={(e) =>
                  upsertProduct({ ...editing, categoryId: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stock">
              <select
                className="input"
                value={editing.stock}
                onChange={(e) =>
                  upsertProduct({ ...editing, stock: e.target.value as any })
                }
              >
                <option value="in">En stock</option>
                <option value="low">Quantité limitée</option>
                <option value="out">Rupture</option>
              </select>
            </Field>
            <Field label="Prix (MAD)">
              <input
                type="number"
                className="input"
                value={editing.price}
                onChange={(e) =>
                  upsertProduct({ ...editing, price: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Prix barré (MAD)">
              <input
                type="number"
                className="input"
                value={editing.compareAtPrice ?? ""}
                onChange={(e) =>
                  upsertProduct({
                    ...editing,
                    compareAtPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </Field>
            <Field label="Badge (ex: Nouveauté)">
              <input
                className="input"
                value={editing.badge ?? ""}
                onChange={(e) =>
                  upsertProduct({ ...editing, badge: e.target.value || undefined })
                }
              />
            </Field>
            <Field label="Garantie">
              <input
                className="input"
                value={editing.guarantee ?? ""}
                onChange={(e) =>
                  upsertProduct({
                    ...editing,
                    guarantee: e.target.value || undefined,
                  })
                }
              />
            </Field>
          </div>

          <Field label="Description courte (Darija)">
            <textarea
              className="input min-h-[60px]"
              value={editing.shortDescription}
              onChange={(e) =>
                upsertProduct({ ...editing, shortDescription: e.target.value })
              }
            />
          </Field>
          <Field label="Description longue (Darija)">
            <textarea
              className="input min-h-[120px]"
              value={editing.longDescription}
              onChange={(e) =>
                upsertProduct({ ...editing, longDescription: e.target.value })
              }
            />
          </Field>
          <Field label="Note COD">
            <input
              className="input"
              value={editing.codNote ?? ""}
              onChange={(e) =>
                upsertProduct({ ...editing, codNote: e.target.value || undefined })
              }
            />
          </Field>

          <div>
            <div className="label">Images (URLs)</div>
            <div className="space-y-2">
              {editing.images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-10 w-10 rounded-lg overflow-hidden bg-bg shrink-0">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                  <input
                    className="input flex-1"
                    value={img}
                    onChange={(e) => {
                      const next = [...editing.images];
                      next[i] = e.target.value;
                      upsertProduct({ ...editing, images: next });
                    }}
                  />
                  <button
                    className="btn-ghost"
                    onClick={() =>
                      upsertProduct({
                        ...editing,
                        images: editing.images.filter((_, j) => j !== i),
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
                  upsertProduct({
                    ...editing,
                    images: [...editing.images, ""],
                  })
                }
              >
                Ajouter une image
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3">
              <span className="text-sm text-ink">Mettre en avant (featured)</span>
              <Toggle
                checked={editing.featured}
                onChange={(v) => upsertProduct({ ...editing, featured: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3">
              <span className="text-sm text-ink">Masquer le produit</span>
              <Toggle
                checked={editing.hidden}
                onChange={(v) => upsertProduct({ ...editing, hidden: v })}
              />
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
