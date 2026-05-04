import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../store/cart";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count, clearCart } = useCart();
  const navigate = useNavigate();

  function handleCheckout() {
    if (items.length === 0) return;
    closeCart();

    const now = new Date();
    const payload = {
      date: now.toLocaleDateString("fr-MA"),
      time: now.toLocaleTimeString("fr-MA"),
      product_name: items.map((i) => `${i.title} x${i.quantity}`).join(" | "),
      price: String(total),
      quantity: String(count),
      page_url: window.location.href,
      source: document.referrer || "direct",
      status: "جديد",
      full_name: "",
      phone: "",
      city: "",
      note: "",
    };

    sessionStorage.setItem("tara_order", JSON.stringify(payload));
    sessionStorage.setItem("tara_pending_checkout", "true");
    navigate("/checkout");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[71] w-full max-w-[420px] bg-white shadow-lift flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div className="flex items-center gap-2" dir="rtl">
                <ShoppingBag className="h-5 w-5 text-ink" />
                <h2 className="font-bold text-lg text-ink">السلة</h2>
                {count > 0 && (
                  <span className="h-5 w-5 grid place-items-center rounded-full bg-ink text-white text-[11px] font-bold">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink/40 hover:text-ink transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3" dir="rtl">
                  <ShoppingBag className="h-12 w-12 text-ink/20" />
                  <p className="text-body text-sm">السلة فارغة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3" dir="rtl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 shrink-0 rounded-xl border border-line object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-sm font-bold text-ink mt-1">
                          {item.price * item.quantity} درهم
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="h-7 w-7 grid place-items-center rounded-lg border border-line bg-bg hover:border-ink transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="h-7 w-7 grid place-items-center rounded-lg border border-line bg-bg hover:border-ink transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="mr-auto h-7 w-7 grid place-items-center rounded-lg text-ink/30 hover:text-red transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-line px-5 py-5 space-y-3">
                <div className="flex items-center justify-between" dir="rtl">
                  <span className="text-sm text-body">المجموع</span>
                  <span className="text-xl font-bold text-ink">{total} درهم</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full justify-center py-4 text-base"
                >
                  أكمل الطلب
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-body/50 hover:text-red transition-colors py-1"
                  dir="rtl"
                >
                  إفراغ السلة
                </button>
                <p className="text-center text-[11px] text-body/40" dir="rtl">
                  الدفع عند الاستلام · تأكيد قبل الشحن
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
