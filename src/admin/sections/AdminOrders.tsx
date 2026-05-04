import { useState, useEffect } from "react";
import { ShoppingBag, TrendingUp, Users, DollarSign, Trash2, Download } from "lucide-react";
import type { StoredOrder } from "../../cms/types";

const STATUSES: StoredOrder["status"][] = ["جديد", "مؤكد", "مشحون", "مسلم", "ملغي"];
const STATUS_COLOR: Record<string, string> = {
  "جديد": "bg-blue-100 text-blue-700",
  "مؤكد": "bg-yellow-100 text-yellow-700",
  "مشحون": "bg-purple-100 text-purple-700",
  "مسلم": "bg-green-100 text-green-700",
  "ملغي": "bg-red-100 text-red-600",
};

function loadOrders(): StoredOrder[] {
  try {
    return JSON.parse(localStorage.getItem("tara_orders_log") || "[]");
  } catch { return []; }
}

function saveOrders(orders: StoredOrder[]) {
  localStorage.setItem("tara_orders_log", JSON.stringify(orders));
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => { setOrders(loadOrders()); }, []);

  const revenue = orders.filter(o => o.status !== "ملغي").reduce((s, o) => s + o.price, 0);
  const confirmed = orders.filter(o => o.status === "مؤكد" || o.status === "مشحون" || o.status === "مسلم").length;
  const cities = new Set(orders.map(o => o.city)).size;

  function updateStatus(id: string, status: StoredOrder["status"]) {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveOrders(updated);
  }

  function deleteOrder(id: string) {
    if (!confirm("حذف هذا الطلب؟")) return;
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    saveOrders(updated);
  }

  function clearAll() {
    if (!confirm("حذف جميع الطلبات؟")) return;
    setOrders([]);
    saveOrders([]);
  }

  function exportCsv() {
    const headers = ["التاريخ", "الوقت", "الاسم", "الهاتف", "المدينة", "المنتج", "المبلغ", "الكمية", "الحالة", "المصدر"];
    const rows = orders.map((o) => [
      o.date, o.time, o.full_name, o.phone, o.city,
      o.product_name, o.price, o.quantity, o.status, o.source,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div dir="rtl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="display text-4xl text-ink leading-tight">الطلبات</h1>
          <p className="text-body mt-2">جميع الطلبات المستلمة عبر الموقع.</p>
        </div>
        {orders.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 text-sm text-ink/70 hover:text-ink transition-colors border border-line rounded-lg px-3 py-1.5"
            >
              <Download className="h-4 w-4" />
              تصدير CSV
            </button>
            <button onClick={clearAll} className="flex items-center gap-2 text-sm text-red hover:text-red/80 transition-colors">
              <Trash2 className="h-4 w-4" />
              حذف الكل
            </button>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingBag, label: "إجمالي الطلبات", value: orders.length, color: "text-blue-600" },
          { icon: TrendingUp, label: "رقم المعاملات", value: `${revenue} درهم`, color: "text-green-600" },
          { icon: Users, label: "مؤكدة", value: confirmed, color: "text-purple-600" },
          { icon: DollarSign, label: "مدن مختلفة", value: cities, color: "text-orange-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5">
            <Icon className={`h-5 w-5 ${color} mb-3`} />
            <div className="display text-3xl text-ink leading-none">{value}</div>
            <div className="text-sm text-body mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="h-10 w-10 text-ink/20 mx-auto mb-3" />
          <p className="text-body text-sm">لا توجد طلبات بعد. الطلبات ستظهر هنا بعد أول عملية شراء.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-bg">
                  {["التاريخ", "الاسم", "الهاتف", "المدينة", "المنتج", "المبلغ", "الحالة", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-body uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-bg/50 transition-colors">
                    <td className="px-4 py-3 text-body text-xs whitespace-nowrap">{order.date}<br />{order.time}</td>
                    <td className="px-4 py-3 font-medium text-ink">{order.full_name}</td>
                    <td className="px-4 py-3 text-body">{order.phone}</td>
                    <td className="px-4 py-3 text-body">{order.city}</td>
                    <td className="px-4 py-3 text-body max-w-[160px] truncate">{order.product_name}</td>
                    <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">{order.price} درهم</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value as StoredOrder["status"])}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer ${STATUS_COLOR[order.status]}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteOrder(order.id)} className="text-ink/20 hover:text-red transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
