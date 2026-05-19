import { useCallback } from "react";
import { useCms } from "../cms/store";
import { logEvent } from "../lib/db";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      identify?: (params: Record<string, string>) => void;
      [key: string]: unknown;
    };
    fbq?: (
      action: "track" | "trackCustom" | "init" | "consent",
      event: string,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export type ProductPixelData = {
  contentId?: string | number;
  contentName?: string;
  value?: number;
  // Advanced Matching — raw values, hashed (SHA-256) before sending
  phone?: string;
  email?: string;
  // GA4 ecommerce transaction id (purchase only)
  orderId?: string;
};

const CURRENCY = "MAD";

/**
 * Facebook Test Events code — leave EMPTY in production.
 *
 * Setting this to a non-empty string (e.g. "TEST90159") routes all
 * pixel events into Events Manager → Test Events instead of counting
 * them as real conversions. Use only for funnel validation.
 *
 * The base PageView in index.html must match this setting — if you
 * re-enable testing, also restore the { test_event_code } 2nd arg on
 * the fbq('track', 'PageView', ...) call there.
 */
const FB_TEST_EVENT_CODE = "";

// ── SHA-256 helper (Web Crypto) — used for TikTok Advanced Matching ─────────
async function sha256Hex(input: string): Promise<string> {
  if (!input || typeof crypto === "undefined" || !crypto.subtle) return "";
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// E.164 normalization — Moroccan numbers default to +212
function normalizePhone(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00212")) return `+${digits.slice(2)}`;
  if (digits.startsWith("212")) return `+${digits}`;
  if (digits.startsWith("0")) return `+212${digits.slice(1)}`;
  return `+${digits}`;
}

function normalizeEmail(raw: string): string {
  return (raw || "").trim().toLowerCase();
}

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
      try { console.debug(`[ttq] track ${event}`, params); } catch { /* ignore */ }
    } else {
      console.warn(`[ttq] not loaded — skipped ${event}`, params);
    }
  } catch (err) {
    console.error(`[ttq] threw on ${event}`, err);
  }
}

// Facebook Pixel safe-fire (mirrors tt() — the fbevents.js IIFE also
// installs fbq as a queue-stub immediately, so calls before SDK load
// are enqueued and processed once it arrives).
function fb(event: string, params?: Record<string, unknown>) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.fbq === "function") {
      // Inject test_event_code when the temporary validation flag is set
      const finalParams = FB_TEST_EVENT_CODE
        ? { ...(params ?? {}), test_event_code: FB_TEST_EVENT_CODE }
        : params;
      window.fbq("track", event, finalParams);
      try { console.debug(`[fbq] track ${event}`, finalParams); } catch { /* ignore */ }
    } else {
      console.warn(`[fbq] not loaded — skipped ${event}`, params);
    }
  } catch (err) {
    console.error(`[fbq] threw on ${event}`, err);
  }
}

// Build the Facebook Pixel payload from our shared ProductPixelData shape.
function fbProductPayload(p: ProductPixelData): Record<string, unknown> {
  return {
    content_type: "product",
    content_ids: p.contentId != null ? [String(p.contentId)] : [],
    content_name: p.contentName,
    value: p.value,
    currency: CURRENCY,
  };
}

// GTM dataLayer push — safe-fire, mirrors tt() / fb() pattern.
// GTM-KV3FNM3N container is loaded in index.html; the IIFE there creates
// window.dataLayer immediately, so pushes before tags hydrate are queued.
function gtm(payload: Record<string, unknown>) {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    try { console.debug("[gtm] push", payload); } catch { /* ignore */ }
  } catch (err) {
    console.error("[gtm] push threw", err);
  }
}

// GA4 ecommerce convention: clear ecommerce before each push so prior
// item data doesn't bleed into the next event.
function gtmEcommerce(event: string, ecommerce: Record<string, unknown>) {
  gtm({ ecommerce: null });
  gtm({ event, ecommerce });
}

// Build a single GA4 item from our shared ProductPixelData shape.
function gtmItem(p: ProductPixelData): Record<string, unknown> {
  return {
    item_id: p.contentId != null ? String(p.contentId) : undefined,
    item_name: p.contentName,
    price: p.value,
    quantity: 1,
  };
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

// Async variant: same as pixelPayload + hashed phone_number/email for
// TikTok Advanced Matching. Used by CompletePayment (purchase event).
async function pixelPayloadWithIdentity(p: ProductPixelData): Promise<Record<string, unknown>> {
  const base: Record<string, unknown> = {
    content_type: "product",
    content_id: p.contentId != null ? String(p.contentId) : undefined,
    content_name: p.contentName,
    value: p.value,
    currency: CURRENCY,
  };
  if (p.phone) {
    const norm = normalizePhone(p.phone);
    if (norm) base.phone_number = await sha256Hex(norm);
  }
  if (p.email) {
    const norm = normalizeEmail(p.email);
    if (norm) base.email = await sha256Hex(norm);
  }
  return base;
}

// Set TikTok user identifiers BEFORE the track call (best-practice Advanced
// Matching). All identifiers SHA-256 hashed client-side.
async function ttIdentify(phone?: string, email?: string) {
  if (!phone && !email) return;
  if (typeof window === "undefined" || typeof window.ttq?.identify !== "function") return;
  try {
    const id: Record<string, string> = {};
    if (phone) {
      const np = normalizePhone(phone);
      if (np) id.phone_number = await sha256Hex(np);
    }
    if (email) {
      const ne = normalizeEmail(email);
      if (ne) id.email = await sha256Hex(ne);
    }
    if (Object.keys(id).length === 0) return;
    window.ttq.identify(id);
    try { console.debug("[ttq] identify", id); } catch { /* ignore */ }
  } catch (err) {
    console.error("[ttq] identify threw", err);
  }
}

export function useAnalytics() {
  const incrementStat = useCms((s) => s.incrementStat);

  const trackWhatsAppClick = useCallback(() => {
    fire("wa_click");
    tt("ClickButton", { button_text: "whatsapp" });
    fb("Contact", { source: "whatsapp" });
    void logEvent("wa_click");
    incrementStat("whatsappClicks");
  }, [incrementStat]);

  // Funnel step 2: AddToCart — user starts the COD form
  const trackFormStart = useCallback((product?: ProductPixelData) => {
    fire("form_start");
    tt("AddToCart", pixelPayload(product));
    fb("AddToCart", product ? fbProductPayload(product) : undefined);
    if (product) {
      gtmEcommerce("add_to_cart", {
        currency: CURRENCY,
        value: product.value,
        items: [gtmItem(product)],
      });
    } else {
      gtm({ event: "add_to_cart" });
    }
    void logEvent("form_start", {
      content_id: product?.contentId ?? null,
      content_name: product?.contentName ?? null,
      value: product?.value ?? null,
    });
    incrementStat("formStarts");
  }, [incrementStat]);

  const trackFormAbandon = useCallback(() => {
    fire("form_abandon");
  }, []);

  // Funnel step 3: Purchase — order successfully sent (TikTok CompletePayment
  // + Facebook Purchase + GA4 purchase via GTM dataLayer). Async: hashes
  // phone/email for TikTok Advanced Matching, then identifies + tracks.
  // Caller does NOT need to await.
  const trackOrderSuccess = useCallback(
    async (productName: string, product?: ProductPixelData) => {
      fire("order_success", "product", productName);
      incrementStat("formSubmissions");
      const merged: ProductPixelData = { contentName: productName, ...product };
      // 1. TikTok identify (advanced matching) BEFORE the event
      await ttIdentify(merged.phone, merged.email);
      // 2. TikTok CompletePayment with hashed identifiers in payload
      const ttPayload = await pixelPayloadWithIdentity(merged);
      tt("CompletePayment", ttPayload);
      // 3. Facebook Purchase — fires in parallel with same conversion data
      fb("Purchase", fbProductPayload(merged));
      // 4. GA4 purchase via GTM dataLayer — same gating, same value/currency
      gtmEcommerce("purchase", {
        transaction_id: merged.orderId,
        value: merged.value,
        currency: CURRENCY,
        items: [gtmItem(merged)],
      });
    },
    [incrementStat]
  );

  // Funnel step 1: ViewContent / view_item — when product is provided. Plain page_view otherwise.
  const trackPageView = useCallback(
    (product?: ProductPixelData) => {
      fire("page_view");
      if (product?.contentId) {
        tt("ViewContent", pixelPayload(product));
        fb("ViewContent", fbProductPayload(product));
        gtmEcommerce("view_item", {
          currency: CURRENCY,
          value: product.value,
          items: [gtmItem(product)],
        });
      } else {
        // Generic page_view (non-product pages) — keeps GA4 page tracking active
        gtm({ event: "page_view", page_path: typeof window !== "undefined" ? window.location.pathname : "" });
      }
      void logEvent("page_view", {
        path: typeof window !== "undefined" ? window.location.pathname : null,
        content_id: product?.contentId ?? null,
      });
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
