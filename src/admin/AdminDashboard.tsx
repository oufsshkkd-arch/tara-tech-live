import { Link } from "react-router-dom";
import { Boxes, Package, HelpCircle, Sparkles, Megaphone, ArrowUpRight } from "lucide-react";
import { useCms } from "../cms/store";

export default function AdminDashboard() {
  const { categories, products, faq, brand, visibility, announcementBar } = useCms();
  const visibleCount = (Object.values(visibility) as boolean[]).filter(Boolean).length;

  const stats = [
    { label: "Catégories", value: categories.length, icon: Boxes, to: "/tara-admin/categories" },
    { label: "Produits", value: products.length, icon: Package, to: "/tara-admin/products" },
    { label: "FAQ", value: faq.length, icon: HelpCircle, to: "/tara-admin/faq" },
    { label: "Sections actives", value: `${visibleCount}/8`, icon: Sparkles, to: "/tara-admin/sections" },
    { label: "Messages bandeau", value: announcementBar.messages.length, icon: Megaphone, to: "/tara-admin/announcement" },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="display text-4xl text-ink leading-tight">Tableau de bord</h1>
          <p className="text-body mt-2">
            Bienvenue sur la console de {brand.brandName}.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="card p-5 hover:shadow-lift transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <span className="h-9 w-9 rounded-xl bg-ink/5 grid place-items-center">
                  <Icon className="h-4 w-4 text-ink" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-body group-hover:text-ink transition-colors" />
              </div>
              <div className="mt-5 display text-3xl text-ink leading-none">{s.value}</div>
              <div className="text-sm text-body mt-1">{s.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-8">
        <div className="card p-6">
          <h2 className="display text-2xl text-ink mb-1">Démarrage rapide</h2>
          <p className="text-sm text-body mb-4">
            Tout est éditable depuis cette console. Les modifications sont sauvegardées localement.
          </p>
          <ul className="space-y-2.5 text-sm">
            <Step to="/tara-admin/brand" label="Définir la marque, logo et SEO" />
            <Step to="/tara-admin/hero" label="Personnaliser la section Hero" />
            <Step to="/tara-admin/announcement" label="Gérer le bandeau d'annonce" />
            <Step to="/tara-admin/categories" label="Gérer les catégories" />
            <Step to="/tara-admin/products" label="Ajouter / modifier des produits" />
            <Step to="/tara-admin/faq" label="Compléter la FAQ" />
            <Step to="/tara-admin/footer" label="Personnaliser le footer" />
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="display text-2xl text-ink mb-1">Bonnes pratiques</h2>
          <ul className="space-y-2.5 text-sm text-body list-disc pl-5">
            <li>Gardez les titres courts pour rester premium.</li>
            <li>Le rouge est utilisé uniquement pour les actions clés.</li>
            <li>Confirmez chaque commande avant l'envoi.</li>
            <li>Conservez 3 à 6 produits "featured" maximum.</li>
            <li>Mettez à jour la FAQ régulièrement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Step({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 hover:border-ink/30 transition-colors">
        <span className="text-ink">{label}</span>
        <ArrowUpRight className="h-4 w-4 text-body" />
      </Link>
    </li>
  );
}
