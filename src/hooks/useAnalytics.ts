import { useCallback } from "react";
import { useCms } from "../cms/store";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      [key: string]: unknown;
    };
  }
}

export type ProductPixelData = {
  contentId?: string | number;
  contentName?: string;
  value?: number;
};

const CURRENCY = "MAD";

function fire(event: string, key?: string, value?: string) {
  try {
    window.clarity?.("event", event);
    if (key && value) window.clarity?.("set", key, value);
  } catch { /* ignore if Clarity not loaded */ }
}

// TikTok Pixel safe-fire. The IIFE in index.html creates ttq.track as a
// queue-stub immediately, so calling it before the SDK finishes loading
// just enqueues the event. We log every fire to make Pixel-Helper
// debugging easy from DevTools.
function tt(event: string, params?: Record<string, unknown>) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.ttq?.track === "function") {
      window.ttq.track(event, params);
      // Debug breadcrumb (visible in DevTools console)
      try { console.debug(`[ttq] track ${event}`, params); } catch { /* ignore */ }
    } else {
      console.warn(`[ttq] not loaded — skipped ${event}`, params);
    }
  } catch (err) {
    console.error(`[ttq] threw on ${event}`, err);
  }
}

function pixelPayload(p?: ProductPixelData) {
  if (!p) return undefined;
  return {
    content_type: "product",
    content_id: p.contentId != null ? String(p.contentId) : undefined,
    content_name: p.contentName,
    value: p.value,
    currency: CURRENCY,
  };
}

export function useAnalytics() {
  const incrementStat = useCms((s) => s.incrementStat);

  const trackWhatsAppClick = useCallback(() => {
    fire("wa_click");
    tt("ClickButton", { button_text: "whatsapp" });
    incrementStat("whatsappClicks");
  }, [incrementStat]);

  // Funnel step 2: AddToCart — user starts the COD form
  const trackFormStart = useCallback((product?: ProductPixelData) => {
    fire("form_start");
    tt("AddToCart", pixelPayload(product));
    incrementStat("formStarts");
  }, [incrementStat]);

  const trackFormAbandon = useCallback(() => {
    fire("form_abandon");
  }, []);

  // Funnel step 3: CompletePayment — order successfully sent
  const trackOrderSuccess = useCallback(
    (productName: string, product?: ProductPixelData) => {
      fire("order_success", "product", productName);
      tt("CompletePayment", pixelPayload({ contentName: productName, ...product }));
      incrementStat("formSubmissions");
    },
    [incrementStat]
  );

  // Funnel step 1: ViewContent — when product is provided. Plain page_view otherwise.
  const trackPageView = useCallback(
    (product?: ProductPixelData) => {
      fire("page_view");
      if (product?.contentId) {
        tt("ViewContent", pixelPayload(product));
      }
      incrementStat("pageViews");
    },
    [incrementStat]
  );

  const trackHeroCtaClick = useCallback((label?: string) => {
    fire("hero_cta_click", "cta_label", label ?? "");
  }, []);

  return {
    trackWhatsAppClick,
    trackFormStart,
    trackFormAbandon,
    trackOrderSuccess,
    trackPageView,
    trackHeroCtaClick,
  };
}
