import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import CartDrawer from "./CartDrawer";

export default function SiteLayout() {
  const { pathname } = useLocation();
  const rendererOwnsChrome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {!rendererOwnsChrome && <Header />}
      <main className={`flex-1 ${rendererOwnsChrome ? "" : "pt-[88px] md:pt-[104px]"}`}>
        <Outlet />
      </main>
      {!rendererOwnsChrome && <Footer />}
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}
