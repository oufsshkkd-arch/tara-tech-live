import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Package,
  HelpCircle,
  BookOpen,
  Settings2,
  KeyRound,
  LogOut,
  ExternalLink,
  RotateCcw,
  Megaphone,
  PanelBottom,
  ShoppingBag,
  FileText,
  BarChart2,
  Palette,
} from "lucide-react";
import { useAuth } from "../cms/auth";
import { useCms } from "../cms/store";
import SaveBar from "./SaveBar";

const links = [
  { group: "عام" },
  { to: "/tara-admin", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { to: "/tara-admin/orders", label: "الطلبات", icon: ShoppingBag },
  { group: "المنتجات" },
  { to: "/tara-admin/products", label: "المنتجات", icon: Package },
  { to: "/tara-admin/categories", label: "الفئات", icon: Boxes },
  { to: "/tara-admin/landing-pages", label: "صفحات المنتجات", icon: FileText },
  { group: "الموقع" },
  { to: "/tara-admin/announcement", label: "شريط الإعلان", icon: Megaphone },
  { to: "/tara-admin/story", label: "قصتنا & CTA", icon: BookOpen },
  { to: "/tara-admin/faq", label: "FAQ", icon: HelpCircle },
  { to: "/tara-admin/footer", label: "Footer", icon: PanelBottom },
  { group: "التخصيص" },
  { to: "/tara-admin/theme", label: "Theme Editor", icon: Palette },
  { group: "التحليلات" },
  { to: "/tara-admin/insights", label: "Customer Insights", icon: BarChart2 },
  { group: "الإعدادات" },
  { to: "/tara-admin/brand", label: "العلامة & SEO", icon: Settings2 },
  { to: "/tara-admin/account", label: "الحساب", icon: KeyRound },
];

const FULLWIDTH_ROUTES = ["/tara-admin/hero", "/tara-admin/products", "/tara-admin/theme"];

export default function AdminLayout() {
  const logout = useAuth((s) => s.logout);
  const reset = useCms((s) => s.reset);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const isFullWidth = FULLWIDTH_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-72 shrink-0 border-r border-line bg-white sticky top-0 h-screen flex flex-col">
        <Link to="/tara-admin" className="flex items-center gap-2 px-5 py-5 border-b border-line">
          <span className="relative h-8 w-8 grid place-items-center rounded-full bg-ink text-bg">
            <span className="display italic text-base leading-none">T</span>
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red" />
          </span>
          <div>
            <div className="display text-base text-ink leading-none">Tara Tech</div>
            <div className="text-[11px] text-body mt-0.5">Admin Console</div>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {links.map((l, i) => {
            if ("group" in l) {
              return (
                <p key={i} className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-body/40">
                  {l.group}
                </p>
              );
            }
            const Icon = l.icon!;
            return (
              <NavLink
                key={l.to}
                to={l.to!}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive ? "bg-ink text-white" : "text-ink/80 hover:bg-ink/5"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-3 border-t border-line space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/80 hover:bg-ink/5"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </Link>
          <button
            onClick={() => {
              if (confirm("Réinitialiser tout le contenu aux valeurs par défaut ?")) {
                reset();
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/80 hover:bg-ink/5"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </button>
          <button
            onClick={() => {
              logout();
              nav("/tara-admin/login", { replace: true });
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red hover:bg-red/5"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className={isFullWidth ? "flex-1 flex flex-col overflow-hidden" : "flex-1 p-8 sm:p-10 max-w-5xl"}>
          <Outlet />
        </div>
        {!isFullWidth && <SaveBar />}
      </div>
    </div>
  );
}
