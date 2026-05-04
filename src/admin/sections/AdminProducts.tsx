import { useState, useRef, useEffect, useCallback } from "react";
import { useCms, newId } from "../../cms/store";
import type { Product, ProductPageCopy } from "../../cms/types";
import { COPY as DEFAULT_COPY, GENERIC_COPY } from "../../cms/defaultProductCopy";
import { Toggle } from "../ui";
import SplitEditor from "../SplitEditor";
import ProductPagePreview from "../previews/ProductPagePreview";
import {
  Plus, Trash2, X, Eye, EyeOff,
  Star, Package, ImagePlus, ChevronDown, ChevronUp,
} from "lucide-react";

async function compressImage(file: File, maxPx = 900, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxPx || h > maxPx) {
        if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
        else { w = Math.round(w * maxPx / h); h = maxPx; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const BLANK_COPY: ProductPageCopy = {
  promoTicker: ["منتج جديد", "الدفع عند الاستلام", "توصيل المغرب كامل"],
  heroHeadline: ["", ""], heroSub: "",
  problemTitle: "", problemSub: "", problemQuote: "", problems: [],
  solutionTitle: "", solutionSub: "", solutionBullets: [], solutionQuote: "",
  howItWorksTitle: "كيفاش تستعمله؟", howSteps: [],
  benefits: [], whoFor: [],
  valueTitle: "", valueSub: "", valueCosts: [], valueConclusion: "",
  reviews: [], finalHeadline: "", finalSub: "",
  scarcityText: "الكمية محدودة — اطلب قبل ما ينتهي",
};

const STOCK_LABELS: Record<string, string> = {
  in: "متوفر", low: "كمية محدودة", out: "نفدت الكمية",
};

function blankProduct(order: number, categoryId: string): Product {
  return {
    id: newId("p"), slug: "منتج-جديد", title: "منتج جديد",
    shortDescription: "", longDescription: "", price: 0,
    images: [], categoryId, featured: false, hidden: false, stock: "in", order,
  };
}

type SectionId = "images" | "content" | "pricing" | "features" | "page";

export default function AdminProducts() {
  const { products, categories, upsertProduct, removeProduct, reorderProducts } = useCms();
  const sorted = [...products].sort((a, b) => a.order - b.order);

  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id ?? null);
  const [uploading, setUploading] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId>("images");
  const [openPageSub, setOpenPageSub] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Draft state — local copy edited without saving until user hits Save
  const [draftProduct, setDraftProduct] = useState<Product | null>(() =>
    sorted.find((p) => p.id === selectedId) ?? null
  );

  // Keep a ref to latest products for the effect below
  const productsRef = useRef(products);
  productsRef.current = products;

  // Reset draft whenever the selected product changes
  useEffect(() => {
    const p = productsRef.current.find((p) => p.id === selectedId) ?? null;
    setDraftProduct(p ? structuredClone(p) : null);
    setOpenSection("images");
    setOpenPageSub(null);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const storeProduct = sorted.find((p) => p.id === selectedId) ?? null;
  const hasChanges = JSON.stringify(draftProduct) !== JSON.stringify(storeProduct);

  const pc: ProductPageCopy =
    draftProduct?.copy ?? DEFAULT_COPY[draftProduct?.id ?? ""] ?? GENERIC_COPY;

  /* ── update helpers ── */
  function update(patch: Partial<Product>) {
    setDraftProduct((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function updateCopy(patch: Partial<ProductPageCopy>) {
    if (!draftProduct) return;
    const cur = draftProduct.copy ?? DEFAULT_COPY[draftProduct.id] ?? GENERIC_COPY;
    update({ copy: { ...cur, ...patch } });
  }

  function setToggle(key: string, val: boolean) {
    updateCopy({ sectionToggles: { ...pc.sectionToggles, [key]: val } });
  }

  const handleSave = useCallback(() => {
    if (draftProduct) upsertProduct(draftProduct);
  }, [draftProduct, upsertProduct]);

  /* ── image upload ── */
  async function handleFileUpload(files: FileList | null) {
    if (!files || !draftProduct) return;
    setUploading(true);
    const results: string[] = [];
    for (const file of Array.from(files)) {
      try { results.push(await compressImage(file)); } catch { /* skip */ }
    }
    update({ images: [...draftProduct.images, ...results] });
    setUploading(false);
  }

  function removeImage(i: number) {
    if (!draftProduct) return;
    update({ images: draftProduct.images.filter((_, j) => j !== i) });
  }

  function moveImage(i: number, dir: -1 | 1) {
    if (!draftProduct) return;
    const imgs = [...draftProduct.images];
    const j = i + dir;
    if (j < 0 || j >= imgs.length) return;
    [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    update({ images: imgs });
  }

  /* ── product list actions ── */
  function addProduct() {
    const cat = categories[0]?.id ?? "";
    const p = blankProduct(sorted.length + 1, cat);
    upsertProduct(p);
    setSelectedId(p.id);
  }

  function deleteProduct(id: string) {
    if (!confirm("تحذف هاد المنتج؟")) return;
    removeProduct(id);
    const next = sorted.find((p) => p.id !== id);
    setSelectedId(next?.id ?? null);
  }

  function moveProduct(idx: number, dir: -1 | 1) {
    const next = [...sorted];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    reorderProducts(next.map((p) => p.id));
  }

  function updateFeature(i: number, key: "icon" | "text", val: string) {
    if (!draftProduct) return;
    const features = [...(draftProduct.features || [])];
    features[i] = { ...features[i], [key]: val };
    update({ features });
  }

  function toggleSection(s: SectionId) {
    setOpenSection((prev) => (prev === s ? "images" : s));
  }

  /* ── inner components ── */
  function SectionHeader({ id, label }: { id: SectionId; label: string }) {
    const open = openSection === id;
    return (
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-ink hover:bg-gray-50 transition-colors"
      >
        {label}
        {open ? <ChevronUp className="h-4 w-4 text-body" /> : <ChevronDown className="h-4 w-4 text-body" />}
      </button>
    );
  }

  function PSub({ id, label, toggleKey }: { id: string; label: string; toggleKey?: string }) {
    const isOpen = openPageSub === id;
    const enabled = toggleKey
      ? (pc.sectionToggles as Record<string, boolean> | undefined)?.[toggleKey] !== false
      : true;
    return (
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="flex items-center">
          {toggleKey && (
            <div
              className="flex items-center justify-center border-l border-line px-3 py-3"
              onClick={(e) => { e.stopPropagation(); setToggle(toggleKey, !enabled); }}
            >
              <Toggle checked={enabled} onChange={(v) => setToggle(toggleKey, v)} />
            </div>
          )}
          <button
            onClick={() => setOpenPageSub((prev) => (prev === id ? null : id))}
            className="flex flex-1 items-center justify-between px-4 py-3 text-sm font-semibold text-ink hover:bg-bg/50 transition-colors text-right"
          >
            <span className="flex items-center gap-2">
              {label}
              {toggleKey && !enabled && (
                <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-normal text-body">مخفي</span>
              )}
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4 text-body shrink-0" /> : <ChevronDown className="h-4 w-4 text-body shrink-0" />}
          </button>
        </div>
      </div>
    );
  }

  const inp = "input text-sm";

  return (
    <div className="flex h-full overflow-hidden">
      {/* ══ Product list ══ */}
      <div className="w-52 shrink-0 border-r border-line bg-white flex flex-col" dir="rtl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <span className="font-bold text-ink text-sm">المنتجات ({sorted.length})</span>
          <button
            onClick={addProduct}
            className="flex items-center gap-1 rounded-full bg-ink text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            جديد
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sorted.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`group flex items-center gap-2.5 px-3 py-3 cursor-pointer border-b border-line/60 transition-colors ${
                selectedId === p.id ? "bg-ink/5 border-r-2 border-r-ink" : "hover:bg-bg"
              }`}
            >
              <div className="h-9 w-9 shrink-0 rounded-xl overflow-hidden bg-bg border border-line">
                {p.images[0]
                  ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                  : <div className="h-full w-full grid place-items-center text-body/30"><Package className="h-4 w-4" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink truncate">{p.title}</p>
                <p className="text-[10px] text-body">{p.price} درهم</p>
              </div>
              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); moveProduct(idx, -1); }} className="h-5 w-5 grid place-items-center rounded text-body hover:text-ink"><ChevronUp className="h-3.5 w-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); moveProduct(idx, 1); }} className="h-5 w-5 grid place-items-center rounded text-body hover:text-ink"><ChevronDown className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="p-6 text-center text-sm text-body">لا توجد منتجات.</p>
          )}
        </div>
      </div>

      {/* ══ Split editor ══ */}
      {draftProduct ? (
        <SplitEditor
          title={draftProduct.title || "منتج جديد"}
          hasChanges={hasChanges}
          onSave={handleSave}
          renderPreview={(mode) => <ProductPagePreview product={draftProduct} mode={mode} />}
        >
          <div dir="rtl" className="space-y-3">

            {/* Meta actions bar */}
            <div className="flex items-center justify-between rounded-xl border border-line bg-bg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg overflow-hidden bg-white border border-line shrink-0">
                  {draftProduct.images[0]
                    ? <img src={draftProduct.images[0]} alt="" className="h-full w-full object-cover" />
                    : <div className="h-full w-full grid place-items-center text-body/30"><Package className="h-4 w-4" /></div>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink leading-none">{draftProduct.title}</p>
                  <p className="text-[10px] text-body mt-0.5">{draftProduct.price} درهم</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/products/${draftProduct.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[11px] text-ink hover:bg-bg transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  معاينة
                </a>
                <button
                  onClick={() => deleteProduct(draftProduct.id)}
                  className="flex items-center gap-1 rounded-lg border border-red/20 bg-red/5 px-2.5 py-1.5 text-[11px] text-red hover:bg-red/10 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  حذف
                </button>
              </div>
            </div>

            {/* ── Images ── */}
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <SectionHeader id="images" label="📸 الصور" />
              {openSection === "images" && (
                <div className="px-5 pb-5 space-y-4">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line bg-bg py-8 cursor-pointer hover:border-ink/30 hover:bg-white transition-colors"
                  >
                    {uploading
                      ? <div className="text-sm text-body animate-pulse">جاري الرفع...</div>
                      : <>
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-white border border-line text-body">
                          <ImagePlus className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-ink">اسحب صورة هنا أو اضغط للرفع</p>
                          <p className="text-xs text-body mt-1">JPG, PNG, WEBP — تتضغط تلقائياً</p>
                        </div>
                      </>}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
                  {draftProduct.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2.5">
                      {draftProduct.images.map((img, i) => (
                        <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-line bg-bg">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          {i === 0 && <div className="absolute top-1.5 right-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] text-white font-medium">رئيسية</div>}
                          <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            {i > 0 && <button onClick={() => moveImage(i, -1)} className="h-6 w-6 grid place-items-center rounded-full bg-white text-ink"><ChevronUp className="h-3.5 w-3.5" /></button>}
                            <button onClick={() => removeImage(i)} className="h-6 w-6 grid place-items-center rounded-full bg-red text-white"><X className="h-3.5 w-3.5" /></button>
                            {i < draftProduct.images.length - 1 && <button onClick={() => moveImage(i, 1)} className="h-6 w-6 grid place-items-center rounded-full bg-white text-ink"><ChevronDown className="h-3.5 w-3.5" /></button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Content ── */}
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <SectionHeader id="content" label="✏️ المحتوى" />
              {openSection === "content" && (
                <div className="px-5 pb-5 space-y-4">
                  <div>
                    <label className="label">اسم المنتج</label>
                    <input className="input" value={draftProduct.title} onChange={(e) => update({ title: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">الـ Slug (URL)</label>
                    <input className="input" value={draftProduct.slug} dir="ltr"
                      onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
                  </div>
                  <div>
                    <label className="label">وصف قصير</label>
                    <textarea className="input min-h-[70px]" value={draftProduct.shortDescription} onChange={(e) => update({ shortDescription: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">وصف كامل</label>
                    <textarea className="input min-h-[110px]" value={draftProduct.longDescription} onChange={(e) => update({ longDescription: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">ملاحظة الدفع عند الاستلام</label>
                    <input className="input" value={draftProduct.codNote ?? ""} onChange={(e) => update({ codNote: e.target.value || undefined })} placeholder="الدفع عند الاستلام متوفر فجميع المدن." />
                  </div>
                </div>
              )}
            </div>

            {/* ── Pricing ── */}
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <SectionHeader id="pricing" label="💰 السعر والمخزون" />
              {openSection === "pricing" && (
                <div className="px-5 pb-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">السعر (درهم)</label>
                      <input type="number" className="input" value={draftProduct.price} onChange={(e) => update({ price: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="label">السعر المشطوب</label>
                      <input type="number" className="input" value={draftProduct.compareAtPrice ?? ""} onChange={(e) => update({ compareAtPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="—" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">الفئة</label>
                      <select className="input" value={draftProduct.categoryId} onChange={(e) => update({ categoryId: e.target.value })}>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">المخزون</label>
                      <select className="input" value={draftProduct.stock} onChange={(e) => update({ stock: e.target.value as Product["stock"] })}>
                        <option value="in">متوفر</option>
                        <option value="low">كمية محدودة</option>
                        <option value="out">نفدت الكمية</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">البادج</label>
                      <input className="input" value={draftProduct.badge ?? ""} onChange={(e) => update({ badge: e.target.value || undefined })} placeholder="الأكثر مبيعاً..." />
                    </div>
                    <div>
                      <label className="label">الضمان</label>
                      <input className="input" value={draftProduct.guarantee ?? ""} onChange={(e) => update({ guarantee: e.target.value || undefined })} placeholder="ضمان 12 شهر..." />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center justify-between rounded-xl border border-line bg-bg px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-ink">
                        <Star className="h-4 w-4 text-amber-400" />
                        مميز (Featured)
                      </div>
                      <Toggle checked={draftProduct.featured} onChange={(v) => update({ featured: v })} />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-line bg-bg px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-ink">
                        <EyeOff className="h-4 w-4 text-body" />
                        مخفي
                      </div>
                      <Toggle checked={draftProduct.hidden} onChange={(v) => update({ hidden: v })} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Feature Pills ── */}
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <SectionHeader id="features" label="⚡ المميزات (Feature Pills)" />
              {openSection === "features" && (
                <div className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-body">كتظهر كـ pills فصفحة المنتج تحت السعر.</p>
                  {(draftProduct.features || []).map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input className="input w-16 text-center text-lg px-2" value={f.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)} placeholder="⚡" />
                      <input className="input flex-1" value={f.text} onChange={(e) => updateFeature(i, "text", e.target.value)} placeholder="وصف المميزة..." />
                      <button onClick={() => update({ features: (draftProduct.features || []).filter((_, j) => j !== i) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => update({ features: [...(draftProduct.features || []), { icon: "✅", text: "" }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors">
                    <Plus className="h-4 w-4" />أضف مميزة
                  </button>
                </div>
              )}
            </div>

            {/* ══ Page Editor ══ */}
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <SectionHeader id="page" label="📄 صفحة المنتج" />
              {openSection === "page" && (
                <div className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-body pb-1">اضغط على كل قسم باش تعدله. استعمل المفتاح باش تخفيه أو تظهره.</p>

                  {/* Promo Ticker */}
                  <PSub id="ticker" label="🎯 شريط الترويج" />
                  {openPageSub === "ticker" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-2 -mt-2">
                      {pc.promoTicker.map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <input className={inp} value={item} onChange={(e) => { const a = [...pc.promoTicker]; a[i] = e.target.value; updateCopy({ promoTicker: a }); }} />
                          <button onClick={() => updateCopy({ promoTicker: pc.promoTicker.filter((_, j) => j !== i) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => updateCopy({ promoTicker: [...pc.promoTicker, ""] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف نص</button>
                    </div>
                  )}

                  {/* Hero */}
                  <PSub id="hero" label="🦸 الهيرو والعنوان" />
                  {openPageSub === "hero" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-3 -mt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="label text-xs">السطر الأول</label><input className={inp} value={pc.heroHeadline[0] ?? ""} onChange={(e) => { const h = [...pc.heroHeadline]; h[0] = e.target.value; updateCopy({ heroHeadline: h }); }} /></div>
                        <div><label className="label text-xs">السطر الثاني (رمادي)</label><input className={inp} value={pc.heroHeadline[1] ?? ""} onChange={(e) => { const h = [...pc.heroHeadline]; h[1] = e.target.value; updateCopy({ heroHeadline: h }); }} /></div>
                      </div>
                      <div><label className="label text-xs">النص التحتي</label><textarea className="input min-h-[70px] text-sm" value={pc.heroSub} onChange={(e) => updateCopy({ heroSub: e.target.value })} /></div>
                      <div><label className="label text-xs">نص الشح (scarcity)</label><input className={inp} value={pc.scarcityText} onChange={(e) => updateCopy({ scarcityText: e.target.value })} /></div>
                    </div>
                  )}

                  {/* Problem */}
                  <PSub id="problem" label="😤 قسم المشكلة" toggleKey="problem" />
                  {openPageSub === "problem" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-3 -mt-2">
                      <div><label className="label text-xs">العنوان</label><input className={inp} value={pc.problemTitle} onChange={(e) => updateCopy({ problemTitle: e.target.value })} /></div>
                      <div><label className="label text-xs">النص التحتي</label><textarea className="input min-h-[60px] text-sm" value={pc.problemSub} onChange={(e) => updateCopy({ problemSub: e.target.value })} /></div>
                      <div><label className="label text-xs">الاقتباس</label><input className={inp} value={pc.problemQuote} onChange={(e) => updateCopy({ problemQuote: e.target.value })} /></div>
                      <div>
                        <label className="label text-xs">المشاكل</label>
                        <div className="space-y-2">
                          {pc.problems.map((prob, i) => (
                            <div key={i} className="flex gap-2">
                              <input className="input w-14 text-center px-1 text-base" value={prob.emoji} onChange={(e) => { const a = [...pc.problems]; a[i] = { ...a[i], emoji: e.target.value }; updateCopy({ problems: a }); }} />
                              <input className="input flex-1 text-sm" value={prob.text} onChange={(e) => { const a = [...pc.problems]; a[i] = { ...a[i], text: e.target.value }; updateCopy({ problems: a }); }} />
                              <button onClick={() => updateCopy({ problems: pc.problems.filter((_, j) => j !== i) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                            </div>
                          ))}
                          <button onClick={() => updateCopy({ problems: [...pc.problems, { emoji: "😤", text: "" }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف مشكلة</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Solution */}
                  <PSub id="solution" label="✅ قسم الحل" toggleKey="solution" />
                  {openPageSub === "solution" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-3 -mt-2">
                      <div><label className="label text-xs">العنوان</label><input className={inp} value={pc.solutionTitle} onChange={(e) => updateCopy({ solutionTitle: e.target.value })} /></div>
                      <div><label className="label text-xs">النص التحتي</label><textarea className="input min-h-[60px] text-sm" value={pc.solutionSub} onChange={(e) => updateCopy({ solutionSub: e.target.value })} /></div>
                      <div><label className="label text-xs">الاقتباس</label><input className={inp} value={pc.solutionQuote} onChange={(e) => updateCopy({ solutionQuote: e.target.value })} /></div>
                      <div>
                        <label className="label text-xs">نقاط الحل</label>
                        <div className="space-y-2">
                          {pc.solutionBullets.map((b, i) => (
                            <div key={i} className="flex gap-2">
                              <input className="input w-14 text-center px-1 text-base" value={b.emoji} onChange={(e) => { const a = [...pc.solutionBullets]; a[i] = { ...a[i], emoji: e.target.value }; updateCopy({ solutionBullets: a }); }} />
                              <input className="input flex-1 text-sm" value={b.text} onChange={(e) => { const a = [...pc.solutionBullets]; a[i] = { ...a[i], text: e.target.value }; updateCopy({ solutionBullets: a }); }} />
                              <button onClick={() => updateCopy({ solutionBullets: pc.solutionBullets.filter((_, j) => j !== i) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                            </div>
                          ))}
                          <button onClick={() => updateCopy({ solutionBullets: [...pc.solutionBullets, { emoji: "✅", text: "" }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف نقطة</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* How it works */}
                  <PSub id="how" label="⚙️ كيفاش يشتغل" toggleKey="howItWorks" />
                  {openPageSub === "how" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-3 -mt-2">
                      <div><label className="label text-xs">عنوان القسم</label><input className={inp} value={pc.howItWorksTitle} onChange={(e) => updateCopy({ howItWorksTitle: e.target.value })} /></div>
                      <div>
                        <label className="label text-xs">مجموعات الخطوات</label>
                        <div className="space-y-3">
                          {pc.howSteps.map((group, gi) => (
                            <div key={gi} className="rounded-xl border border-line bg-white p-3 space-y-2">
                              <div className="flex gap-2">
                                <input className="input flex-1 text-sm" placeholder="اسم المجموعة..." value={group.label} onChange={(e) => { const a = [...pc.howSteps]; a[gi] = { ...a[gi], label: e.target.value }; updateCopy({ howSteps: a }); }} />
                                <button onClick={() => updateCopy({ howSteps: pc.howSteps.filter((_, j) => j !== gi) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                              </div>
                              <textarea className="input min-h-[80px] text-xs" placeholder="خطوة في كل سطر..." value={group.steps.join("\n")} onChange={(e) => { const a = [...pc.howSteps]; a[gi] = { ...a[gi], steps: e.target.value.split("\n") }; updateCopy({ howSteps: a }); }} />
                            </div>
                          ))}
                          <button onClick={() => updateCopy({ howSteps: [...pc.howSteps, { label: "", steps: [] }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف مجموعة</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <PSub id="benefits" label="⭐ المميزات والفوائد" toggleKey="benefits" />
                  {openPageSub === "benefits" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-2 -mt-2">
                      {pc.benefits.map((b, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <input className="input w-14 text-center px-1 text-base shrink-0" value={b.emoji} onChange={(e) => { const a = [...pc.benefits]; a[i] = { ...a[i], emoji: e.target.value }; updateCopy({ benefits: a }); }} />
                          <div className="flex-1 space-y-1">
                            <input className="input text-sm" placeholder="العنوان" value={b.title} onChange={(e) => { const a = [...pc.benefits]; a[i] = { ...a[i], title: e.target.value }; updateCopy({ benefits: a }); }} />
                            <input className="input text-sm" placeholder="الوصف" value={b.body} onChange={(e) => { const a = [...pc.benefits]; a[i] = { ...a[i], body: e.target.value }; updateCopy({ benefits: a }); }} />
                          </div>
                          <button onClick={() => updateCopy({ benefits: pc.benefits.filter((_, j) => j !== i) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => updateCopy({ benefits: [...pc.benefits, { emoji: "✅", title: "", body: "" }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف فائدة</button>
                    </div>
                  )}

                  {/* Who it's for */}
                  <PSub id="who" label="👤 لمن مناسب؟" toggleKey="whoFor" />
                  {openPageSub === "who" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-2 -mt-2">
                      {pc.whoFor.map((w, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <input className="input w-14 text-center px-1 text-base shrink-0" value={w.emoji} onChange={(e) => { const a = [...pc.whoFor]; a[i] = { ...a[i], emoji: e.target.value }; updateCopy({ whoFor: a }); }} />
                          <div className="flex-1 space-y-1">
                            <input className="input text-sm" placeholder="العنوان" value={w.title} onChange={(e) => { const a = [...pc.whoFor]; a[i] = { ...a[i], title: e.target.value }; updateCopy({ whoFor: a }); }} />
                            <input className="input text-sm" placeholder="الوصف" value={w.body} onChange={(e) => { const a = [...pc.whoFor]; a[i] = { ...a[i], body: e.target.value }; updateCopy({ whoFor: a }); }} />
                          </div>
                          <button onClick={() => updateCopy({ whoFor: pc.whoFor.filter((_, j) => j !== i) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => updateCopy({ whoFor: [...pc.whoFor, { emoji: "🎯", title: "", body: "" }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف شريحة</button>
                    </div>
                  )}

                  {/* Value */}
                  <PSub id="value" label="💰 قسم القيمة" toggleKey="value" />
                  {openPageSub === "value" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-3 -mt-2">
                      <div><label className="label text-xs">العنوان</label><input className={inp} value={pc.valueTitle} onChange={(e) => updateCopy({ valueTitle: e.target.value })} /></div>
                      <div><label className="label text-xs">النص التحتي</label><textarea className="input min-h-[60px] text-sm" value={pc.valueSub} onChange={(e) => updateCopy({ valueSub: e.target.value })} /></div>
                      <div>
                        <label className="label text-xs">مقارنة التكاليف</label>
                        <div className="space-y-2">
                          {pc.valueCosts.map((c, i) => (
                            <div key={i} className="flex gap-2">
                              <input className="input w-14 text-center px-1 text-base" value={c.emoji} onChange={(e) => { const a = [...pc.valueCosts]; a[i] = { ...a[i], emoji: e.target.value }; updateCopy({ valueCosts: a }); }} />
                              <input className="input flex-1 text-sm" value={c.text} onChange={(e) => { const a = [...pc.valueCosts]; a[i] = { ...a[i], text: e.target.value }; updateCopy({ valueCosts: a }); }} />
                              <button onClick={() => updateCopy({ valueCosts: pc.valueCosts.filter((_, j) => j !== i) })} className="h-9 w-9 grid place-items-center rounded-xl border border-line text-red hover:bg-red/5 shrink-0"><X className="h-4 w-4" /></button>
                            </div>
                          ))}
                          <button onClick={() => updateCopy({ valueCosts: [...pc.valueCosts, { emoji: "🏪", text: "" }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف تكلفة</button>
                        </div>
                      </div>
                      <div><label className="label text-xs">الخلاصة</label><input className={inp} value={pc.valueConclusion} onChange={(e) => updateCopy({ valueConclusion: e.target.value })} /></div>
                    </div>
                  )}

                  {/* Reviews */}
                  <PSub id="reviews" label="💬 التقييمات" toggleKey="reviews" />
                  {openPageSub === "reviews" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-3 -mt-2">
                      {pc.reviews.map((r, i) => (
                        <div key={i} className="rounded-xl border border-line bg-white p-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input className="input text-sm" placeholder="الاسم" value={r.name} onChange={(e) => { const a = [...pc.reviews]; a[i] = { ...a[i], name: e.target.value }; updateCopy({ reviews: a }); }} />
                            <input className="input text-sm" placeholder="المدينة" value={r.city} onChange={(e) => { const a = [...pc.reviews]; a[i] = { ...a[i], city: e.target.value }; updateCopy({ reviews: a }); }} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <select className="input text-sm" value={r.rating} onChange={(e) => { const a = [...pc.reviews]; a[i] = { ...a[i], rating: Number(e.target.value) }; updateCopy({ reviews: a }); }}>
                              {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
                            </select>
                            <input className="input text-sm" placeholder="التاريخ" value={r.date} onChange={(e) => { const a = [...pc.reviews]; a[i] = { ...a[i], date: e.target.value }; updateCopy({ reviews: a }); }} />
                          </div>
                          <textarea className="input min-h-[60px] text-sm" placeholder="نص التقييم..." value={r.text} onChange={(e) => { const a = [...pc.reviews]; a[i] = { ...a[i], text: e.target.value }; updateCopy({ reviews: a }); }} />
                          <button onClick={() => updateCopy({ reviews: pc.reviews.filter((_, j) => j !== i) })} className="flex items-center gap-1.5 text-xs text-red hover:underline"><Trash2 className="h-3.5 w-3.5" />حذف التقييم</button>
                        </div>
                      ))}
                      <button onClick={() => updateCopy({ reviews: [...pc.reviews, { name: "", city: "", rating: 5, text: "", date: "منذ أسبوع" }] })} className="flex items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-body hover:border-ink hover:text-ink transition-colors"><Plus className="h-4 w-4" />أضف تقييم</button>
                    </div>
                  )}

                  {/* Final CTA */}
                  <PSub id="finalcta" label="🚀 آخر قسم (Final CTA)" toggleKey="finalCta" />
                  {openPageSub === "finalcta" && (
                    <div className="rounded-xl border border-line bg-bg px-4 pb-4 pt-3 space-y-3 -mt-2">
                      <div><label className="label text-xs">العنوان</label><input className={inp} value={pc.finalHeadline} onChange={(e) => updateCopy({ finalHeadline: e.target.value })} /></div>
                      <div><label className="label text-xs">النص التحتي</label><textarea className="input min-h-[60px] text-sm" value={pc.finalSub} onChange={(e) => updateCopy({ finalSub: e.target.value })} /></div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </SplitEditor>
      ) : (
        <div className="flex-1 grid place-items-center">
          <p className="text-sm text-body" dir="rtl">اختر منتجاً من القائمة أو أضف منتجاً جديداً</p>
        </div>
      )}
    </div>
  );
}
