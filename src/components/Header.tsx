import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, ShoppingBag } from "lucide-react";
import { useCms } from "../cms/store";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../store/cart";

import AnnouncementBar from "./AnnouncementBar";

export default function Header({
  showAnnouncement = true,
  fixed = true,
}: {
  showAnnouncement?: boolean;
  fixed?: boolean;
} = {}) {
  const { brand, nav } = useCms();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const onHero = pathname === "/";
  const overPhoto = onHero && !scrolled;

  const links = [
    { to: "/", label: nav.labels.home, end: true },
    { to: "/products", label: nav.labels.products },
    { to: "/notre-histoire", label: nav.labels.story },
    { to: "/faq", label: nav.labels.faq },
    { to: "/contact", label: nav.labels.contact },
  ];

  return (
    <>
      {showAnnouncement && <AnnouncementBar />}
      <header
        className={`${fixed ? "fixed inset-x-0" : "relative w-full"} z-50 transition-all duration-500 ${
          fixed ? (scrolled ? "top-0" : "top-[36px]") : "top-0"
        } ${
          overPhoto
            ? "bg-transparent border-b border-transparent"
            : "bg-bg/85 backdrop-blur-xl border-b border-line/70"
        }`}
      >
        <div className="container-x flex h-14 md:h-[68px] items-center justify-between">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <span
              className={`relative h-[34px] w-[34px] grid place-items-center rounded-full transition-colors duration-300 ${
                overPhoto ? "bg-white text-ink" : "bg-ink text-bg"
              }`}
            >
              <span className="display text-[17px] leading-none italic">T</span>
              <span className="absolute -top-[3px] -right-[3px] h-[9px] w-[9px] rounded-full bg-red ring-2 ring-white/20" />
            </span>
            <div className="flex flex-col leading-none">
              <span
                className={`display text-[19px] tracking-[-0.02em] ${
                  overPhoto ? "text-white" : "text-ink"
                }`}
              >
                {brand.logoText}
              </span>
              <span
                className={`text-[9px] font-medium tracking-[0.12em] uppercase mt-0.5 ${
                  overPhoto ? "text-white/50" : "text-body/60"
                }`}
              >
                {brand.logoTagline || "Tech & Style"}
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-full transition-colors ${
                    overPhoto
                      ? isActive
                        ? "text-white bg-white/15"
                        : "text-white/75 hover:text-white hover:bg-white/10"
                      : isActive
                      ? "text-ink bg-ink/6"
                      : "text-ink/60 hover:text-ink hover:bg-ink/5"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop CTA + Cart ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={openCart}
              aria-label="السلة"
              className={`relative grid place-items-center h-10 w-10 rounded-full border transition-colors ${
                overPhoto
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-line bg-white/70 text-ink hover:bg-ink/5"
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 grid place-items-center rounded-full bg-red text-white text-[10px] font-bold">
                  {count}
                </span>
              )}
            </button>
            <Link
              to="/products"
              className={
                overPhoto
                  ? "inline-flex items-center gap-2 rounded-full bg-white text-ink px-5 py-2.5 text-sm font-semibold tracking-wide shadow-lift hover:bg-white/95 transition-all duration-200 hover:-translate-y-px"
                  : "inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-black/85 transition-all duration-200 hover:-translate-y-px ring-1 ring-ink/10"
              }
            >
              {nav.primaryCta}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* ── Mobile: Cart + Hamburger ── */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={openCart}
              aria-label="السلة"
              className={`relative grid place-items-center h-9 w-9 rounded-full border transition-colors ${
                overPhoto
                  ? "border-white/30 bg-white/10 backdrop-blur text-white"
                  : "border-line bg-white/70 backdrop-blur text-ink"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 grid place-items-center rounded-full bg-red text-white text-[10px] font-bold">
                  {count}
                </span>
              )}
            </button>
            <button
              aria-label="Open menu"
              className={`grid place-items-center h-9 w-9 rounded-full border transition-colors ${
                overPhoto
                  ? "border-white/30 bg-white/10 backdrop-blur text-white"
                  : "border-line bg-white/70 backdrop-blur text-ink"
              }`}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden bg-bg/97 backdrop-blur-2xl border-b border-line/60"
            >
              <div className="container-x pt-3 pb-6 flex flex-col gap-0.5">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                        isActive
                          ? "bg-ink text-bg"
                          : "text-ink/80 hover:text-ink hover:bg-ink/5"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className="h-px bg-line/60 my-3" />
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-black/85 transition-colors"
                >
                  {nav.primaryCta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
    </>
  );
}
