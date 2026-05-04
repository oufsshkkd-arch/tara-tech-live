import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../store/cart";

const CITIES = [
  "الدار البيضاء", "الرباط", "فاس", "مراكش", "طنجة", "أكادير", "مكناس",
  "وجدة", "القنيطرة", "الجديدة", "سلا", "تمارة", "بنسليمان", "برشيد",
  "خريبكة", "سطات", "الخميسات", "العرائش", "الناظور", "الحسيمة", "تازة",
  "بني ملال", "ورزازات", "آسفي", "تطوان", "المحمدية", "قلعة السراغنة",
];

function isValidPhone(phone: string) {
  return /^(\+212|00212|0)(6|7)\d{8}$/.test(phone.replace(/[\s\-\(\)\.]/g, ""));
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, count, clearCart } = useCart();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items.length === 0) navigate("/products");
    setTimeout(() => firstRef.current?.focus(), 100);
  }, []);

  function setField(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = "دخل الاسم الكامل";
    if (!form.phone.trim()) e.phone = "دخل رقم الهاتف";
    else if (!isValidPhone(form.phone)) e.phone = "تأكد من رقم الهاتف (06 أو 07)";
    if (!form.city.trim()) e.city = "دخل المدينة";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const now = new Date();
    const payload = {
      date: now.toLocaleDateString("fr-MA"),
      time: now.toLocaleTimeString("fr-MA"),
      product_name: items.map(i => `${i.title} x${i.quantity}`).join(" | "),
      price: String(total),
      quantity: String(count),
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      note: form.note.trim(),
      page_url: window.location.href,
      source: document.referrer || "direct",
      status: "جديد",
    };

    sessionStorage.setItem("tara_order", JSON.stringify(payload));
    sessionStorage.setItem("tara_pending_send", "true");
    clearCart();
    navigate("/thank-you");
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-bold text-2xl text-ink mb-8 text-center" dir="rtl">
            إتمام الطلب
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order summary */}
            <div className="space-y-4" dir="rtl">
              <h2 className="font-semibold text-ink">ملخص الطلب</h2>
              <div className="rounded-2xl border border-line bg-white p-4 space-y-3 shadow-soft">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-14 rounded-xl border border-line object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink line-clamp-1">{item.title}</p>
                      <p className="text-xs text-body">الكمية: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-ink shrink-0">{item.price * item.quantity} درهم</p>
                  </div>
                ))}
                <div className="border-t border-line pt-3 flex justify-between">
                  <span className="font-bold text-ink">المجموع</span>
                  <span className="font-bold text-xl text-ink">{total} درهم</span>
                </div>
              </div>
              <div className="rounded-xl border border-line bg-white p-3 flex items-center gap-2" dir="rtl">
                <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
                <p className="text-xs text-body">الدفع عند الاستلام · تأكيد قبل الشحن</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate dir="rtl" className="space-y-4">
              <h2 className="font-semibold text-ink">معلوماتك</h2>

              {[
                { key: "full_name", label: "الاسم الكامل", type: "text", placeholder: "محمد الحسني", auto: "name" },
                { key: "phone", label: "رقم الهاتف", type: "tel", placeholder: "06XXXXXXXX", auto: "tel" },
                { key: "city", label: "المدينة", type: "text", placeholder: "الدار البيضاء", auto: "off" },
              ].map(({ key, label, type, placeholder, auto }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    {label} <span className="text-red">*</span>
                  </label>
                  <input
                    ref={key === "full_name" ? firstRef : undefined}
                    type={type}
                    autoComplete={auto}
                    list={key === "city" ? "checkout-cities" : undefined}
                    value={form[key as keyof typeof form]}
                    onChange={e => setField(key, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm text-ink placeholder:text-ink/25 outline-none transition-all focus:ring-2 focus:ring-ink/10 ${
                      errors[key]
                        ? "border-red bg-red/4 focus:border-red"
                        : "border-line bg-bg focus:border-ink focus:bg-white"
                    }`}
                  />
                  {key === "city" && <datalist id="checkout-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>}
                  {errors[key] && <p className="mt-1 text-xs text-red">{errors[key]}</p>}
                </div>
              ))}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  ملاحظة <span className="font-normal text-body/50">(اختياري)</span>
                </label>
                <textarea
                  value={form.note}
                  onChange={e => setField("note", e.target.value)}
                  placeholder="أي معلومة إضافية..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-line bg-bg px-4 py-3.5 text-sm text-ink placeholder:text-ink/25 outline-none transition-all focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" />كيتم إرسال الطلب...</> : "أكد الطلب"}
              </button>
              <p className="text-center text-[11px] text-body/45">
                الدفع عند الاستلام · معلوماتك آمنة · تأكيد قبل الشحن
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
