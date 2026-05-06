import { supabase } from "./supabase";

export type StorefrontEventName =
  | "hero_cta_click"
  | "secondary_cta_click"
  | "hero_product_click"
  | "product_card_click"
  | "add_to_cart"
  | "checkout_start"
  | "order_created"
  | "whatsapp_click"
  | "section_view"
  | "scroll_depth"
  | "image_load_error"
  | "video_load_error";

export type StorefrontEventPayload = Record<string, string | number | boolean | null | undefined>;

export async function trackEvent(name: StorefrontEventName, payload: StorefrontEventPayload = {}) {
  try {
    await supabase.from("analytics_events").insert({
      name,
      payload,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    if (import.meta.env.DEV) console.warn("trackEvent failed", error);
  }
}

export const adminMetricsPlan = {
  sales: [
    "total_orders",
    "revenue",
    "average_order_value",
    "conversion_rate",
    "cod_confirmation_rate",
    "cod_refusal_rate",
    "return_refund_rate",
    "delivered_orders_rate",
  ],
  funnel: [
    "sessions",
    "product_views",
    "add_to_cart_rate",
    "checkout_started",
    "order_placed",
    "confirmed_order",
    "delivered_order",
    "drop_off_by_step",
  ],
  product: [
    "top_viewed_products",
    "top_added_to_cart_products",
    "top_converting_products",
    "low_conversion_products",
    "out_of_stock_products",
  ],
  marketing: [
    "traffic_source",
    "cta_click_through_rate",
    "whatsapp_click_rate",
    "best_hero_variation",
    "best_section_clicks",
    "campaign_performance",
  ],
  ux: [
    "mobile_vs_desktop_conversion",
    "scroll_depth",
    "section_engagement",
    "hero_video_load_success",
    "broken_image_detection",
    "page_speed_indicators",
  ],
};
