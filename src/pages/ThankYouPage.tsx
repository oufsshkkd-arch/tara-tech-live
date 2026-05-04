import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../cms/store";
import { useAnalytics } from "../hooks/useAnalytics";

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbytXQjDr40xi-zH-qkksarUW75xptpK_bp8-KBgbnl4U5IYV3gV64kAEU90s1AEQICX0g/exec";

interface Order {
  full_name: string;
  phone: string;
  city: string;
  quantity: string;
  price: string;
  product_name: string;
  note?: string;
  status?: string;
  date?: string;
  time?: string;
  source?: string;
  page_url?: string;
}

export default function ThankYouPage() {
  const { brand } = useCms();
  const { trackOrderSuccess } = useAnalytics();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("tara_order");
    const pending = sessionStorage.getItem("tara_pending_send");
    if (!raw) return;

    try {
      const data: Order = JSON.parse(raw);
      setOrder(data);

      // Send to Google Sheet once, from this fully-loaded page
      if (pending === "true") {
        sessionStorage.removeItem("tara_pending_send");
        const params = new URLSearchParams({
          full_name:    data.full_name    || "",
          phone:        data.phone        || "",
          city:         data.city         || "",
          quantity:     data.quantity     || "1",
          note:         data.note         || "",
          product_name: data.product_name || "Jump Starter + Air Pump",
          price:        data.price        || "699",
          status:       data.status       || "جديد",
          page_url:     data.page_url     || "",
          source:       data.source       || "direct",
          date:         data.date         || "",
          time:         data.time         || "",
        });
        new Image().src = `${WEBHOOK_URL}?${params.toString()}`;
        trackOrderSuccess(data.product_name || "unknown");

        // Save to local orders log for admin dashboard
        try {
          const log = JSON.parse(localStorage.getItem("tara_orders_log") || "[]");
          log.unshift({
            id: Date.now().toString(),
            date: data.date || "",
            time: data.time || "",
            full_name: data.full_name || "",
            phone: data.phone || "",
            city: data.city || "",
            product_name: data.product_name || "",
            price: parseInt(data.price || "699"),
            quantity: parseInt(data.quantity || "1"),
            status: "جديد",
            source: data.source || "direct",
          });
          localStorage.setItem("tara_orders_log", JSON.stringify(log.slice(0, 200)));
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
  }, []);

  const total = order
    ? parseInt(order.price || "699") * parseInt(order.quantity || "1")
    : 699;

  const waText = encodeURIComponent(
    "سلام Tara Tech، طلبت جهاز الديمارور والبومبة وبغيت نعرف وقت التوصيل 🙏"
  );
  const waLink = `https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}?text=${waText}`;

  return (
    <div className="min-h-screen bg-bg px-4 py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Success icon */}
        <div className="mb-7 flex justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", damping: 14 }}
            className="grid h-24 w-24 place-items-center rounded-full bg-white border border-line shadow-soft"
          >
            <CheckCircle className="h-12 w-12 text-green-500" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Heading */}
        <div className="mb-7 text-center" dir="rtl">
          <h1 className="font-sans font-extrabold text-2xl text-ink tracking-tight mb-3">
            شكراً على الطلب ديالك 🙌
          </h1>
          <p className="text-base leading-relaxed text-body">
            توصلنا بالطلب ديالك، وغادي نتاصلو بك قريب باش نأكدو المعلومات قبل الشحن.
          </p>
        </div>

        {/* Trust reminder */}
        <div className="mb-5 rounded-2xl border border-line bg-white p-5 text-center shadow-soft" dir="rtl">
          <p className="text-sm font-semibold text-ink mb-1">الدفع عند الاستلام بعد التأكيد.</p>
          <p className="text-sm text-body">خلي الهاتف ديالك قريب — غادي نتاصلو بك.</p>
        </div>

        {/* Order recap */}
        {order && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-white shadow-soft" dir="rtl">
            <div className="border-b border-line px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-body/50">تفاصيل الطلب</p>
            </div>
            <div className="divide-y divide-line px-5">
              {[
                { label: "المنتج", value: "Jump Starter + Air Pump" },
                { label: "الكمية", value: `${order.quantity} قطعة` },
                { label: "المجموع", value: `${total} درهم` },
                { label: "المدينة", value: order.city },
                { label: "رقم الهاتف", value: order.phone },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-body">{label}</span>
                  <span className="font-semibold text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="space-y-3">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full justify-center py-4 text-base"
          >
            <MessageCircle className="h-5 w-5" />
            تواصل معنا فواتساب
          </a>
          <Link
            to="/products/jump-starter-air-pump"
            className="btn-ghost w-full justify-center py-3"
          >
            <ArrowLeft className="h-4 w-4" />
            رجع لصفحة المنتج
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-body/40" dir="rtl">
          Tara Tech — تكنولوجيا مختارة بعناية
        </p>
      </motion.div>
    </div>
  );
}
