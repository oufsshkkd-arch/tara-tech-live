import { useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCms } from "../../cms/store";
import { Field } from "../ui";
import type { StoryContent, WhyContent, FinalCtaContent } from "../../cms/types";
import SplitEditor from "../SplitEditor";
import StoryPreview from "../previews/StoryPreview";

type Tab = "story" | "why" | "finalCta";

const TAB_LABELS: Record<Tab, string> = {
  story: "قصتنا",
  why: "لماذا؟",
  finalCta: "CTA Final",
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-body/40 pb-1 border-b border-line">
      {children}
    </p>
  );
}

export default function AdminStory() {
  const { story, why, finalCta, setStory, setWhy, setFinalCta } = useCms();

  const [draftStory, setDraftStory] = useState<StoryContent>(() => ({ ...story }));
  const [draftWhy, setDraftWhy] = useState<WhyContent>(() => ({ ...why, points: [...why.points] }));
  const [draftFinalCta, setDraftFinalCta] = useState<FinalCtaContent>(() => ({ ...finalCta }));
  const [activeTab, setActiveTab] = useState<Tab>("story");

  const hasChanges =
    JSON.stringify(draftStory) !== JSON.stringify(story) ||
    JSON.stringify(draftWhy) !== JSON.stringify(why) ||
    JSON.stringify(draftFinalCta) !== JSON.stringify(finalCta);

  const handleSave = useCallback(() => {
    setStory(draftStory);
    setWhy(draftWhy);
    setFinalCta(draftFinalCta);
  }, [draftStory, draftWhy, draftFinalCta, setStory, setWhy, setFinalCta]);

  return (
    <SplitEditor
      title="Histoire & CTA"
      hasChanges={hasChanges}
      onSave={handleSave}
      renderPreview={(mode) => (
        <StoryPreview
          story={draftStory}
          why={draftWhy}
          finalCta={draftFinalCta}
          activeTab={activeTab}
          mode={mode}
        />
      )}
    >
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {(["story", "why", "finalCta"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab ? "bg-white text-ink shadow-sm" : "text-body/60 hover:text-body"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Story tab */}
      {activeTab === "story" && (
        <div className="space-y-4">
          <SectionLabel>Notre Histoire</SectionLabel>
          <Field label="Titre">
            <input
              className="input"
              value={draftStory.title}
              onChange={(e) => setDraftStory((p) => ({ ...p, title: e.target.value }))}
            />
          </Field>
          <Field label="Image (URL)">
            <input
              className="input"
              placeholder="https://..."
              value={draftStory.image}
              onChange={(e) => setDraftStory((p) => ({ ...p, image: e.target.value }))}
            />
          </Field>
          <Field label="Texte">
            <textarea
              className="input min-h-[160px]"
              value={draftStory.body}
              onChange={(e) => setDraftStory((p) => ({ ...p, body: e.target.value }))}
            />
          </Field>
        </div>
      )}

      {/* Why tab */}
      {activeTab === "why" && (
        <div className="space-y-4">
          <SectionLabel>Pourquoi Tara Tech</SectionLabel>
          <Field label="Titre">
            <input
              className="input"
              value={draftWhy.title}
              onChange={(e) => setDraftWhy((p) => ({ ...p, title: e.target.value }))}
            />
          </Field>
          <Field label="Texte d'introduction">
            <textarea
              className="input min-h-[80px]"
              value={draftWhy.intro}
              onChange={(e) => setDraftWhy((p) => ({ ...p, intro: e.target.value }))}
            />
          </Field>
          <div>
            <p className="label mb-2">Points</p>
            <div className="space-y-2">
              {draftWhy.points.map((pt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    value={pt}
                    onChange={(e) => {
                      const next = [...draftWhy.points];
                      next[i] = e.target.value;
                      setDraftWhy((p) => ({ ...p, points: next }));
                    }}
                  />
                  <button
                    className="h-10 w-10 grid place-items-center rounded-lg border border-line text-red hover:bg-red/5"
                    onClick={() =>
                      setDraftWhy((p) => ({ ...p, points: p.points.filter((_, j) => j !== i) }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                className="btn-dark"
                onClick={() =>
                  setDraftWhy((p) => ({ ...p, points: [...p.points, "نقطة جديدة"] }))
                }
              >
                <Plus className="h-4 w-4" />
                Ajouter un point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final CTA tab */}
      {activeTab === "finalCta" && (
        <div className="space-y-4">
          <SectionLabel>CTA Final</SectionLabel>
          <Field label="Titre">
            <input
              className="input"
              value={draftFinalCta.title}
              onChange={(e) => setDraftFinalCta((p) => ({ ...p, title: e.target.value }))}
            />
          </Field>
          <Field label="Texte">
            <textarea
              className="input min-h-[80px]"
              value={draftFinalCta.body}
              onChange={(e) => setDraftFinalCta((p) => ({ ...p, body: e.target.value }))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA principal">
              <input
                className="input"
                value={draftFinalCta.primaryCta}
                onChange={(e) => setDraftFinalCta((p) => ({ ...p, primaryCta: e.target.value }))}
              />
            </Field>
            <Field label="CTA secondaire">
              <input
                className="input"
                value={draftFinalCta.secondaryCta}
                onChange={(e) => setDraftFinalCta((p) => ({ ...p, secondaryCta: e.target.value }))}
              />
            </Field>
          </div>
        </div>
      )}
    </SplitEditor>
  );
}
