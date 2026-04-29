import { useCms, newId } from "../../cms/store";
import { Field, PageHeader, Section } from "../ui";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";

export default function AdminFaq() {
  const { faq, upsertFaq, removeFaq, reorderFaq } = useCms();
  const sorted = [...faq].sort((a, b) => a.order - b.order);
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sorted];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    reorderFaq(next.map((f) => f.id));
  };
  const onAdd = () => {
    upsertFaq({
      id: newId("f"),
      question: "Nouvelle question ?",
      answer: "",
      order: sorted.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ"
        description="Questions fréquentes affichées sur la page d'accueil et la page FAQ."
        actions={
          <button onClick={onAdd} className="btn-dark">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        }
      />
      <Section title="Questions">
        <div className="space-y-3">
          {sorted.map((f, idx) => (
            <div
              key={f.id}
              className="rounded-2xl border border-line bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs uppercase tracking-wider text-body">
                  Question #{idx + 1}
                </span>
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
                    className="h-8 w-8 grid place-items-center rounded-lg border border-line text-red hover:bg-red/5"
                    onClick={() => {
                      if (confirm("Supprimer cette question ?")) removeFaq(f.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <Field label="Question (FR)">
                <input
                  className="input"
                  value={f.question}
                  onChange={(e) => upsertFaq({ ...f, question: e.target.value })}
                />
              </Field>
              <Field label="Réponse (Darija)">
                <textarea
                  className="input min-h-[80px]"
                  value={f.answer}
                  onChange={(e) => upsertFaq({ ...f, answer: e.target.value })}
                />
              </Field>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
