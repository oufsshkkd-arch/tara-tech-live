import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useAnalytics } from "./hooks/useAnalytics";

// Lazy-loaded public pages
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const StoryPage = lazy(() => import("./pages/StoryPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const JumpStarterPage = lazy(() => import("./pages/JumpStarterPage"));
const BathroomOrganizerPage = lazy(() => import("./pages/BathroomOrganizerPage"));
const WaterFilterPage = lazy(() => import("./pages/WaterFilterPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

// Lazy-loaded Admin pages
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminBrand = lazy(() => import("./admin/sections/AdminBrand"));
const AdminCategories = lazy(() => import("./admin/sections/AdminCategories"));
const AdminProducts = lazy(() => import("./admin/sections/AdminProducts"));
const AdminFaq = lazy(() => import("./admin/sections/AdminFaq"));
const AdminStory = lazy(() => import("./admin/sections/AdminStory"));
const AdminAccount = lazy(() => import("./admin/sections/AdminAccount"));
const AdminAnnouncementBar = lazy(() => import("./admin/sections/AdminAnnouncementBar"));
const AdminFooter = lazy(() => import("./admin/sections/AdminFooter"));
const AdminOrders = lazy(() => import("./admin/sections/AdminOrders"));
const AdminLandingPages = lazy(() => import("./admin/sections/AdminLandingPages"));
const AdminInsights = lazy(() => import("./admin/sections/AdminInsights"));
const AdminTheme = lazy(() => import("./admin/sections/AdminTheme"));
import { useAuth } from "./cms/auth";
import { useCms } from "./cms/store";
import { subscribeCmsState } from "./lib/db";
import SiteLayout from "./components/SiteLayout";
import ClarityTracker from "./components/ClarityTracker";

function ScrollToTop() {
  const { pathname } = useLocation();
  const { trackPageView } = useAnalytics();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    trackPageView();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthed = useAuth((s) => s.isAuthed);
  if (!isAuthed) return <Navigate to="/tara-admin/login" replace />;
  return children;
}

function CmsSyncGate({ children }: { children: JSX.Element }) {
  const loadFromDb = useCms((s) => s.loadFromDb);
  const applyRemoteState = useCms((s) => s.applyRemoteState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    void loadFromDb().finally(() => {
      if (active) setIsReady(true);
    });

    const unsubscribe = subscribeCmsState((state) => {
      applyRemoteState(state);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [applyRemoteState, loadFromDb]);

  useEffect(() => {
    if (isReady) {
      document.getElementById("init-loader")?.remove();
    }
  }, [isReady]);

  if (!isReady) return null;
  return children;
}

export default function App() {
  return (
    <CmsSyncGate>
      <>

        <ClarityTracker />

        <ScrollToTop />
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-bg"><div className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink border-t-transparent" /></div>}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/jump-starter-air-pump" element={<JumpStarterPage />} />
              <Route path="/products/bathroom-organizer" element={<BathroomOrganizerPage />} />
              <Route path="/products/tap-water-filter" element={<WaterFilterPage />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/notre-histoire" element={<StoryPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            <Route path="/tara-admin/login" element={<AdminLogin />} />
            <Route
              path="/tara-admin"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="brand" element={<AdminBrand />} />
              <Route path="hero" element={<Navigate to="/tara-admin/theme" replace />} />
              <Route path="sections" element={<Navigate to="/tara-admin/theme" replace />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="faq" element={<AdminFaq />} />
              <Route path="story" element={<AdminStory />} />
              <Route path="announcement" element={<AdminAnnouncementBar />} />
              <Route path="footer" element={<AdminFooter />} />
              <Route path="account" element={<AdminAccount />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="landing-pages" element={<AdminLandingPages />} />
              <Route path="insights" element={<AdminInsights />} />
              <Route path="theme" element={<AdminTheme />} />
            </Route>

            {/* Legacy /admin redirect */}
            <Route path="/admin/*" element={<Navigate to="/tara-admin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </>
    </CmsSyncGate>
  );
}
