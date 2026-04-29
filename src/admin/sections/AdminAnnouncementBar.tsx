import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useCms, newId } from "../../cms/store";
import { PageHeader, Section, Field, Toggle } from "../ui";

export default function AdminAnnouncementBar() {
  const {
    announcementBar,
    setAnnouncementBar,
    upsertAnnouncementMessage,
    removeAnnouncementMessage,
    reorderAnnouncementMessages,
  } = useCms();

  const sorted = [...announcementBar.messages].sort((a, b) => a.order - b.order);
  const [newText, setNewText] = useState("");

  const addMessage = () => {
    if (!newText.trim()) return;
    upsertAnnouncementMessage({
      id: newId("ab"),
      text: newText.trim(),
      accent: false,
      order: sorted.length + 1,
    });
    setNewText("");
  };

  const move = (idx: number, dir: -1 | 1) => {
    const ids = sorted.map((m) => m.id);
    const target = idx + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[idx], ids[target]] = [ids[target], ids[idx]];
    reorderAnnouncementMessages(ids);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bandeau d'annonce"
        description="Gérez le bandeau défilant qui apparaît en haut du site."
      />

      <Section title="Paramètres">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink">Afficher le bandeau</span>
          <Toggle
            checked={announcementBar.enabled}
            onChange={(v) => setAnnouncementBar({ enabled: v })}
          />
        </div>
        <Field label="Vitesse d'animation (secondes)" hint="Plus le nombre est grand, plus le défilement est lent.">
          <input
            type="number"
            className="input w-32"
            min={10}
            max={120}
            value={announcementBar.speed}
            onChange={(e) =>
              setAnnouncementBar({ speed: Number(e.target.value) || 40 })
            }
          />
        </Field>
      </Section>

      <Section
        title="Messages"
        description="Les messages apparaissent en boucle infinie dans le bandeau."
        actions={
          <span className="text-xs text-body">{sorted.length} message(s)</span>
        }
      >
        {/* Add new */}
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Nouveau message en Darija..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMessage()}
          />
          <button onClick={addMessage} className="btn-dark shrink-0">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {/* List */}
        <div className="space-y-2 mt-2">
          {sorted.map((msg, i) => (
            <div
              key={msg.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-body hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === sorted.length - 1}
                  className="text-body hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>

              <input
                className="input flex-1"
                value={msg.text}
                onChange={(e) =>
                  upsertAnnouncementMessage({ ...msg, text: e.target.value })
                }
              />

              <Toggle
                checked={msg.accent}
                onChange={(v) =>
                  upsertAnnouncementMessage({ ...msg, accent: v })
                }
                label="Accent"
              />

              <button
                onClick={() => {
                  if (confirm("Supprimer ce message ?"))
                    removeAnnouncementMessage(msg.id);
                }}
                className="text-red hover:text-red-dark shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
