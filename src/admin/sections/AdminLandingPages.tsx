import { useState } from "react";
import { Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useCms } from "../../cms/store";
import type { LandingPage, LandingPageFeature } from "../../cms/types";

export default function AdminLandingPages() {
  const { landingPages, products, upsertLandingPage } = useCms();
  const [selected, setSelected] = useState<string>(landingPages[0]?.slug || "");
  const [saved, setSaved] = useState(false);

  const lp = landingPages.find(p => p.slug === selected);
  const [draft, setDraft] = useState<LandingPage | null>(lp || null);

  function select(slug: string) {
    const found = landingPages.find(p => p.slug === slug);
    setSelected(slug);
    setDraft(found || null);
    setSaved(false);
  }

  function setField(field: keyof LandingPage, value: string) {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  }

  function updateFeature(i: number, field: keyof LandingPageFeature, value: string) {
    if (!draft) return;
    const features = [...draft.features];
    features[i] = { ...features[i], [field]: value };
    setDraft({ ...draft, features });
  }

  function addFeature() {
    if (!draft) return;
    setDraft({ ...draft, features: [...draft.features, { icon: "✅", text: "" }] });
  }

  function removeFeature(i: number) {
    if (!draft) return;
    setDraft({ ...draft, features: draft.features.filter((_, idx) => idx !== i) });
  }

  function save() {
    if (!draft) return;
    upsertLandingPage(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const product = products.find(p => p.slug === selected);

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="display text-4xl text-ink leading-tight">صفحات المنتجات</h1>
          <p className="text-body mt-2">عدّل محتوى كل صفحة منتج من هنا.</p>
        </div>
        {product && (
          <Link
            to={`/products/${selected}`}
            target="_blank"
            className="flex items-center gap-2 text-sm text-body hover:text-ink transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            عرض الصفحة
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar: page list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-body uppercase tracking-wider mb-3">الصفحات</p>
          {landingPages.map(lp => {
            const prod = products.find(p => p.slug === lp.slug);
            return (
              <button
                key={lp.slug}
                onClick={() => select(lp.slug)}
                className={`w-full text-right px-4 py-3 rounded-xl border text-sm transition-colors ${
                  selected === lp.slug
                    ? "bg-ink text-white border-ink"
                    : "border-line bg-white text-ink hover:border-ink/30"
                }`}
              >
                <p className="font-semibold">{prod?.title || lp.slug}</p>
                <p className={`text-xs mt-0.5 ${selected === lp.slug ? "text-white/60" : "text-body"}`}>
                  {lp.slug}
                </p>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        {draft ? (
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6 space-y-4" dir="rtl">
              <h2 className="font-bold text-ink text-lg border-b border-line pb-3">Hero Section</h2>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">البادج</label>
                <input value={draft.badge} onChange={e => setField("badge", e.target.value)}
                  className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">العنوان الرئيسي</label>
                <input value={draft.headline} onChange={e => setField("headline", e.target.value)}
                  className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">العنوان الثانوي</label>
                <input value={draft.subheadline} onChange={e => setField("subheadline", e.target.value)}
                  className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">الوصف</label>
                <textarea value={draft.description} onChange={e => setField("description", e.target.value)}
                  rows={3} className="input-base w-full resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">نص الإلحاح</label>
                <input value={draft.urgencyText} onChange={e => setField("urgencyText", e.target.value)}
                  className="input-base w-full" />
              </div>
            </div>

            <div className="card p-6 space-y-4" dir="rtl">
              <h2 className="font-bold text-ink text-lg border-b border-line pb-3">الأزرار</h2>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">زر أضف للسلة</label>
                <input value={draft.primaryCta} onChange={e => setField("primaryCta", e.target.value)}
                  className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">زر الطلب المباشر</label>
                <input value={draft.secondaryCta} onChange={e => setField("secondaryCta", e.target.value)}
                  className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">نص الضمان</label>
                <input value={draft.guarantee} onChange={e => setField("guarantee", e.target.value)}
                  className="input-base w-full" />
              </div>
            </div>

            <div className="card p-6" dir="rtl">
              <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                <h2 className="font-bold text-ink text-lg">المميزات</h2>
                <button onClick={addFeature}
                  className="flex items-center gap-1.5 text-sm text-ink border border-line px-3 py-1.5 rounded-lg hover:border-ink transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  إضافة
                </button>
              </div>
              <div className="space-y-3">
                {draft.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input value={f.icon} onChange={e => updateFeature(i, "icon", e.target.value)}
                      className="input-base w-16 text-center text-lg" />
                    <input value={f.text} onChange={e => updateFeature(i, "text", e.target.value)}
                      className="input-base flex-1" placeholder="نص الميزة" />
                    <button onClick={() => removeFeature(i)} className="text-ink/20 hover:text-red transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={save}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                saved ? "bg-green-600 text-white" : "btn-primary"
              }`}>
              <Save className="h-4 w-4" />
              {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
            </button>
          </div>
        ) : (
          <div className="lg:col-span-3 card p-12 text-center text-body text-sm">
            اختر صفحة للتعديل
          </div>
        )}
      </div>
    </div>
  );
}
