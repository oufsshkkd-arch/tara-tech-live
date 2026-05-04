import { useCallback } from "react";
import { useCms } from "../cms/store";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

function fire(event: string, key?: string, value?: string) {
  try {
    window.clarity?.("event", event);
    if (key && value) window.clarity?.("set", key, value);
  } catch { /* ignore if Clarity not loaded */ }
}

export function useAnalytics() {
  const incrementStat = useCms((s) => s.incrementStat);

  const trackWhatsAppClick = useCallback(() => {
    fire("wa_click");
    incrementStat("whatsappClicks");
  }, [incrementStat]);

  const trackFormStart = useCallback(() => {
    fire("form_start");
    incrementStat("formStarts");
  }, [incrementStat]);

  const trackFormAbandon = useCallback(() => {
    fire("form_abandon");
  }, []);

  const trackOrderSuccess = useCallback((product: string) => {
    fire("order_success", "product", product);
    incrementStat("formSubmissions");
  }, [incrementStat]);

  const trackPageView = useCallback(() => {
    fire("page_view");
    incrementStat("pageViews");
  }, [incrementStat]);

  return { trackWhatsAppClick, trackFormStart, trackFormAbandon, trackOrderSuccess, trackPageView };
}
