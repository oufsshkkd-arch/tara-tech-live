import { useCallback } from "react";
import { useCms } from "../cms/store";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      identify?: (params: Record<string, string>) => void;
      [key: string]: unknown;
    };
  }
}

export type ProductPixelData = {
  contentId?: string | number;
  contentName?: string;
  value?: number;
  // Advanced Matching — raw values, hashed (SHA-256) before sending
  phone?: string;
  email?: string;
};

const CURRENCY = "MAD";

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
  // Async: hashes phone/email for Advanced Matching, then identifies + tracks.
  // Caller does NOT need to await (fire-and-forget is fine).
  const trackOrderSuccess = useCallback(
    async (productName: string, product?: ProductPixelData) => {
      fire("order_success", "product", productName);
      incrementStat("formSubmissions");
      const merged: ProductPixelData = { contentName: productName, ...product };
      // 1. Identify (advanced matching) BEFORE the event
      await ttIdentify(merged.phone, merged.email);
      // 2. Build payload with hashed identifiers + dispatch track
      const payload = await pixelPayloadWithIdentity(merged);
      tt("CompletePayment", payload);
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
