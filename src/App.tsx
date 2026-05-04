import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAnalytics } from "./hooks/useAnalytics";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import ContactPage from "./pages/ContactPage";
import StoryPage from "./pages/StoryPage";
import FaqPage from "./pages/FaqPage";
import ProductsPage from "./pages/ProductsPage";
import JumpStarterPage from "./pages/JumpStarterPage";
import ThankYouPage from "./pages/ThankYouPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBrand from "./admin/sections/AdminBrand";
import AdminHero from "./admin/sections/AdminHero";
import AdminCategories from "./admin/sections/AdminCategories";
import AdminProducts from "./admin/sections/AdminProducts";
import AdminFaq from "./admin/sections/AdminFaq";
import AdminStory from "./admin/sections/AdminStory";
import AdminSections from "./admin/sections/AdminSections";
import AdminAccount from "./admin/sections/AdminAccount";
import AdminAnnouncementBar from "./admin/sections/AdminAnnouncementBar";
import AdminFooter from "./admin/sections/AdminFooter";
import AdminOrders from "./admin/sections/AdminOrders";
import AdminLandingPages from "./admin/sections/AdminLandingPages";
import AdminInsights from "./admin/sections/AdminInsights";
import AdminTheme from "./admin/sections/AdminTheme";
import { useAuth } from "./cms/auth";
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

export default function App() {
  return (
    <>
      <ClarityTracker />
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/jump-starter-air-pump" element={<JumpStarterPage />} />
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
          <Route path="hero" element={<AdminHero />} />
          <Route path="sections" element={<AdminSections />} />
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
    </>
  );
}
