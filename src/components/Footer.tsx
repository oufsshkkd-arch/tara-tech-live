import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Mail } from "lucide-react";
import { useCms } from "../cms/store";
import type { BrandSettings, FooterContent, Nav } from "../cms/types";

export default function Footer({
  brand: brandProp,
  nav: navProp,
  footer: footerProp,
}: {
  brand?: BrandSettings;
  nav?: Nav;
  footer?: FooterContent;
} = {}) {
  const cms = useCms();
  const brand = brandProp ?? cms.brand;
  const nav = navProp ?? cms.nav;
  const footer = footerProp ?? cms.footer;
  return (
    <footer className="mt-24 border-t border-line bg-white/60">
      <div className="container-x py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2 space-y-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative h-9 w-9 grid place-items-center rounded-full bg-ink text-bg">
              <span className="display text-lg italic leading-none">T</span>
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red" />
            </span>
            <span className="display text-2xl text-ink">{brand.logoText}</span>
          </Link>
          <p className="text-body max-w-md" dir="auto">
            {footer.tagline}
          </p>
          <div className="flex items-center gap-3 pt-2">
            {brand.socials.instagram && (
              <a
                href={brand.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 grid place-items-center rounded-full border border-line bg-white hover:bg-ink hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            <a
              href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="h-10 w-10 grid place-items-center rounded-full border border-line bg-white hover:bg-ink hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="h-10 w-10 grid place-items-center rounded-full border border-line bg-white hover:bg-ink hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-body mb-4">
            {footer.navLabel || "التنقل"}
          </div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-ink text-body">{nav.labels.home}</Link></li>
            <li><Link to="/products" className="hover:text-ink text-body">{nav.labels.products}</Link></li>
            <li><Link to="/notre-histoire" className="hover:text-ink text-body">{nav.labels.story}</Link></li>
            <li><Link to="/faq" className="hover:text-ink text-body">{nav.labels.faq}</Link></li>
            <li><Link to="/contact" className="hover:text-ink text-body">{nav.labels.contact}</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-body mb-4">
            {footer.contactLabel || "تواصل"}
          </div>
          <ul className="space-y-2.5 text-sm text-body">
            <li>WhatsApp: {brand.whatsapp}</li>
            <li>Email: {brand.email}</li>
          </ul>
          <div className="text-xs uppercase tracking-wider text-body mt-6 mb-3">
            {footer.legalLabel || "قانوني"}
          </div>
          <ul className="space-y-2 text-sm">
            {brand.legalLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-body hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-body">
          <span>{footer.bottomLeft}</span>
          <span>{footer.bottomRight}</span>
        </div>
      </div>
    </footer>
  );
}
