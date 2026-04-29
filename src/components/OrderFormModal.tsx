import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CITIES = [
  "الدار البيضاء", "الرباط", "فاس", "مراكش", "طنجة", "أكادير", "مكناس",
  "وجدة", "القنيطرة", "الجديدة", "سلا", "تمارة", "بنسليمان", "برشيد",
  "خريبكة", "سطات", "الخميسات", "العرائش", "الناظور", "الحسيمة", "تازة",
  "بني ملال", "ورزازات", "آسفي", "تطوان", "المحمدية", "قلعة السراغنة",
  "الفقيه بن صالح", "تيفلت", "الصويرة", "إفران", "الرشيدية", "طاطا",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  full_name: string;
  phone: string;
  city: string;
  quantity: number;
  note: string;
}

interface Errors {
  full_name?: string;
  phone?: string;
  city?: string;
}

function isValidPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  return /^(\+212|00212|0)(6|7)\d{8}$/.test(cleaned);
}

export default function OrderFormModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    full_name: "", phone: "", city: "", quantity: 1, note: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 350);
    } else {
      document.body.style.overflow = "";
      setErrors({});
      setSubmitError("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function setField(field: keyof FormState, value: string | number) {
    setForm(f => ({ ...f, [field]: value }));
    if (field in errors) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.full_name.trim()) e.full_name = "دخل الاسم الكامل";
    if (!form.phone.trim()) e.phone = "دخل رقم الهاتف";
    else if (!isValidPhone(form.phone)) e.phone = "تأكد من رقم الهاتف (06 أو 07)";
    if (!form.city.trim()) e.city = "دخل المدينة";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    const now = new Date();
    const payload = {
      date: now.toLocaleDateString("fr-MA"),
      time: now.toLocaleTimeString("fr-MA"),
      product_name: "Jump Starter + Air Pump",
      price: "699",
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      quantity: String(form.quantity),
      note: form.note.trim(),
      page_url: window.location.href,
      source: document.referrer || "direct",
      status: "جديد",
    };

    try {
      // Save order + webhook URL to sessionStorage — ThankYouPage sends the actual request
      // This avoids the fetch being cancelled when the page navigates away
      sessionStorage.setItem("tara_order", JSON.stringify(payload));
      sessionStorage.setItem("tara_pending_send", "true");
      navigate("/thank-you");
    } catch {
      setSubmitError("وقع مشكل فإرسال الطلب، حاول مرة أخرى أو تواصل معنا فواتساب.");
      setLoading(false);
    }
  }

  const total = form.quantity * 699;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet — bottom on mobile, centered on desktop */}
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[61] rounded-t-[28px] bg-white shadow-lift md:bottom-auto md:left-1/2 md:top-1/2 md:right-auto md:w-full md:max-w-[440px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[28px]"
          >
            {/* Drag handle — mobile only */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-ink/10 md:hidden" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-line bg-bg text-ink/40 transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="max-h-[92dvh] overflow-y-auto px-6 pb-8 pt-5 md:max-h-[88vh]">

              {/* Product summary */}
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-line bg-bg p-3.5" dir="rtl">
                <img
                  src="/images/jump-starter/product-hero.jpg"
                  alt="ديمارور وبومبة"
                  className="h-14 w-14 shrink-0 rounded-xl border border-line object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = "/images/jump-starter/trunk.jpg"; }}
                />
                <div className="min-w-0">
                  <p className="text-xs text-body truncate">ديمارور وبومبة 2 فـ 1</p>
                  <p className="font-bold text-xl text-ink leading-none mt-0.5">699 درهم</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-body/60">
                    <ShieldCheck className="h-3 w-3 shrink-0 text-red/60" />
                    الدفع عند الاستلام · تأكيد قبل الشحن
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-5 text-center" dir="rtl">
                <h2 className="font-bold text-lg text-ink">كمل الطلب ديالك</h2>
                <p className="mt-1 text-sm text-body">عمر المعلومات ديالك وغادي نتاصلو بك باش نأكدو الطلب.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate dir="rtl" className="space-y-4">

                {/* Full name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    الاسم الكامل <span className="text-red">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    autoComplete="name"
                    value={form.full_name}
                    onChange={e => setField("full_name", e.target.value)}
                    placeholder="محمد الحسني"
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm text-ink placeholder:text-ink/25 outline-none transition-all focus:ring-2 focus:ring-ink/10 ${
                      errors.full_name
                        ? "border-red bg-red/4 focus:border-red"
                        : "border-line bg-bg focus:border-ink focus:bg-white"
                    }`}
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-xs text-red">{errors.full_name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    رقم الهاتف <span className="text-red">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={e => setField("phone", e.target.value)}
                    placeholder="06XXXXXXXX"
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm text-ink placeholder:text-ink/25 outline-none transition-all focus:ring-2 focus:ring-ink/10 ${
                      errors.phone
                        ? "border-red bg-red/4 focus:border-red"
                        : "border-line bg-bg focus:border-ink focus:bg-white"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red">{errors.phone}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    المدينة <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    list="tara-cities"
                    autoComplete="off"
                    value={form.city}
                    onChange={e => setField("city", e.target.value)}
                    placeholder="الدار البيضاء"
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm text-ink placeholder:text-ink/25 outline-none transition-all focus:ring-2 focus:ring-ink/10 ${
                      errors.city
                        ? "border-red bg-red/4 focus:border-red"
                        : "border-line bg-bg focus:border-ink focus:bg-white"
                    }`}
                  />
                  <datalist id="tara-cities">
                    {CITIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                  {errors.city && (
                    <p className="mt-1 text-xs text-red">{errors.city}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">الكمية</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setField("quantity", Math.max(1, form.quantity - 1))}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-bg text-ink transition-colors hover:border-ink"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-xl text-ink">{form.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setField("quantity", Math.min(10, form.quantity + 1))}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-bg text-ink transition-colors hover:border-ink"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-body">
                      المجموع:{" "}
                      <strong className="text-ink">{total} درهم</strong>
                    </span>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    ملاحظة{" "}
                    <span className="font-normal text-body/50">(اختياري)</span>
                  </label>
                  <textarea
                    value={form.note}
                    onChange={e => setField("note", e.target.value)}
                    placeholder="أي معلومة إضافية..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-line bg-bg px-4 py-3.5 text-sm text-ink placeholder:text-ink/25 outline-none transition-all focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
                  />
                </div>

                {/* Submit error */}
                {submitError && (
                  <div className="rounded-xl bg-red/6 px-4 py-3 text-center text-sm text-red">
                    {submitError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      كيتم إرسال الطلب...
                    </>
                  ) : (
                    "أكد الطلب"
                  )}
                </button>

                <p className="text-center text-[11px] text-body/45" dir="rtl">
                  الدفع عند الاستلام &nbsp;·&nbsp; معلوماتك آمنة &nbsp;·&nbsp; تأكيد قبل الشحن
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
