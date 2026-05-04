import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag, TrendingUp, Package, Users,
  ArrowUpRight, Circle, Boxes, FileText,
} from "lucide-react";
import { useCms } from "../cms/store";
import { loadOrders } from "../lib/db";
import type { StoredOrder } from "../cms/types";

const STATUS_COLOR: Record<string, string> = {
  "جديد": "text-blue-500",
  "مؤكد": "text-yellow-500",
  "مشحون": "text-purple-500",
  "مسلم": "text-green-500",
  "ملغي": "text-red-500",
};

export default function AdminDashboard() {
  const { categories, products, brand } = useCms();
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    loadOrders().then((rows) => setOrders(rows as StoredOrder[]));
  }, []);

  const revenue = orders.filter(o => o.status !== "ملغي").reduce((s, o) => s + o.price, 0);
  const todayStr = new Date().toLocaleDateString("fr-MA");
  const todayOrders = orders.filter(o => o.date === todayStr).length;
  const cities = new Set(orders.map(o => o.city)).size;
  const recent = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="display text-4xl text-ink leading-tight">لوحة التحكم</h1>
        <p className="text-body mt-2">مرحباً بك في {brand.brandName} Admin.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingBag, label: "إجمالي الطلبات", value: orders.length, sub: `${todayOrders} اليوم`, to: "/tara-admin/orders", color: "bg-blue-50 text-blue-600" },
          { icon: TrendingUp, label: "رقم المعاملات", value: `${revenue}`, sub: "درهم", to: "/tara-admin/orders", color: "bg-green-50 text-green-600" },
          { icon: Package, label: "المنتجات", value: products.filter(p => !p.hidden).length, sub: `${products.length} إجمالي`, to: "/tara-admin/products", color: "bg-purple-50 text-purple-600" },
          { icon: Users, label: "المدن", value: cities, sub: "مدينة مختلفة", to: "/tara-admin/orders", color: "bg-orange-50 text-orange-600" },
        ].map(({ icon: Icon, label, value, sub, to, color }) => (
          <Link key={label} to={to} className="card p-5 hover:shadow-lift transition-shadow group">
            <div className="flex items-center justify-between">
              <span className={`h-9 w-9 rounded-xl grid place-items-center ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-body group-hover:text-ink transition-colors" />
            </div>
            <div className="mt-4 display text-3xl text-ink leading-none">{value}</div>
            <div className="text-sm text-body mt-1">{label}</div>
            <div className="text-xs text-body/50 mt-0.5">{sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-ink text-lg" dir="rtl">آخر الطلبات</h2>
            <Link to="/tara-admin/orders" className="text-sm text-body hover:text-ink flex items-center gap-1">
              الكل <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-body text-sm text-center py-8" dir="rtl">لا توجد طلبات بعد.</p>
          ) : (
            <div className="space-y-3" dir="rtl">
              {recent.map(o => (
                <div key={o.id} className="flex items-center gap-3 py-2.5 border-b border-line last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{o.full_name}</p>
                    <p className="text-xs text-body truncate">{o.product_name}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-sm font-bold text-ink">{o.price} درهم</p>
                    <p className="text-xs text-body">{o.city}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium shrink-0 ${STATUS_COLOR[o.status]}`}>
                    <Circle className="h-2 w-2 fill-current" />
                    {o.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-ink mb-4" dir="rtl">وصول سريع</h2>
            <div className="space-y-2" dir="rtl">
              {[
                { to: "/tara-admin/orders", icon: ShoppingBag, label: "الطلبات" },
                { to: "/tara-admin/landing-pages", icon: FileText, label: "صفحات المنتجات" },
                { to: "/tara-admin/products", icon: Package, label: "المنتجات" },
                { to: "/tara-admin/categories", icon: Boxes, label: "الفئات" },
              ].map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-line bg-bg hover:border-ink/30 transition-colors text-sm text-ink">
                  <Icon className="h-4 w-4 text-body" />
                  {label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-body mr-auto" />
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5" dir="rtl">
            <h2 className="font-bold text-ink mb-3">الموقع</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-body">المنتجات المنشورة</span>
                <span className="font-semibold text-ink">{products.filter(p => !p.hidden).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body">الفئات</span>
                <span className="font-semibold text-ink">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body">صفحات المنتجات</span>
                <span className="font-semibold text-ink">{useCms.getState().landingPages.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
