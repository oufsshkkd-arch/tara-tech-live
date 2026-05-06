import type { ThemeEditorSectionType } from "../../cms/types";

export type SettingFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "range"
  | "toggle"
  | "select"
  | "radio"
  | "color"
  | "color_scheme"
  | "image_picker"
  | "video_picker"
  | "media_picker"
  | "link"
  | "product_picker"
  | "collection_picker"
  | "page_picker"
  | "icon_picker"
  | "font_picker"
  | "alignment"
  | "spacing"
  | "border_radius"
  | "shadow"
  | "dynamic_source";

export type SettingSchema = {
  id: string;
  label: string;
  type: SettingFieldType;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
};

export type BlockSchema = {
  type: string;
  label: string;
  settingsSchema: SettingSchema[];
  defaultSettings: Record<string, unknown>;
};

export type SectionSchema = {
  type: ThemeEditorSectionType;
  label: string;
  icon: string;
  settingsSchema: SettingSchema[];
  blocksSchema: BlockSchema[];
  defaultSettings: Record<string, unknown>;
  defaultBlocks: { type: string; settings: Record<string, unknown> }[];
};

export const heroFeaturedProductsBlockSchema: BlockSchema = {
  type: "featured_products_strip",
  label: "Hero Featured Products Strip",
  settingsSchema: [
    { id: "selectionMode", label: "طريقة الاختيار", type: "select", options: [
      { label: "Manual", value: "manual" },
      { label: "Collection", value: "collection" },
    ] },
    { id: "selectedProductIds", label: "3 منتجات", type: "product_picker" },
    { id: "collectionId", label: "Collection", type: "collection_picker" },
    { id: "productLimit", label: "عدد المنتجات", type: "range", min: 1, max: 6, step: 1 },
    { id: "cardStyle", label: "ستايل الكارت", type: "select", options: [
      { label: "Minimal", value: "minimal" },
      { label: "Glass", value: "glass" },
      { label: "Premium", value: "premium" },
      { label: "Compact", value: "compact" },
    ] },
  ],
  defaultSettings: {
    selectionMode: "manual",
    selectedProductIds: [],
    collectionId: null,
    productLimit: 3,
    showImage: true,
    showTitle: true,
    showPrice: true,
    showOldPrice: true,
    showRating: true,
    showBadge: true,
    showCTA: true,
    cardStyle: "premium",
    revealOnScroll: true,
  },
};

export const SECTION_SCHEMAS: Partial<Record<ThemeEditorSectionType, SectionSchema>> = {
  hero_revolut: {
    type: "hero_revolut",
    label: "Hero Revolut",
    icon: "Sparkles",
    settingsSchema: [
      { id: "badgeText", label: "Badge", type: "text" },
      { id: "title", label: "العنوان", type: "richtext" },
      { id: "subtitle", label: "الوصف", type: "textarea" },
      { id: "primaryCtaText", label: "CTA الأساسي", type: "text" },
      { id: "primaryCtaLink", label: "رابط CTA", type: "link" },
      { id: "backgroundStyle", label: "الخلفية", type: "select", options: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
        { label: "Gradient", value: "gradient" },
        { label: "Glass", value: "glass" },
      ] },
      { id: "textAlign", label: "محاذاة النص", type: "alignment" },
      { id: "media", label: "Media", type: "media_picker" },
      { id: "enableHeroProducts", label: "3 Products strip", type: "toggle" },
    ],
    blocksSchema: [heroFeaturedProductsBlockSchema],
    defaultSettings: {},
    defaultBlocks: [{ type: "featured_products_strip", settings: heroFeaturedProductsBlockSchema.defaultSettings }],
  },
};

export const ADMIN_TOOLS_PLAN = {
  themeTools: [
    "revision_history",
    "duplicate_template",
    "preview_unpublished_changes",
    "schedule_publish",
    "theme_json_import_export",
    "reset_section_to_default",
    "section_presets",
  ],
  storeTools: [
    "product_manager",
    "collection_manager",
    "order_manager",
    "cod_status_manager",
    "stock_alerts",
    "customer_notes",
    "abandoned_carts",
    "whatsapp_follow_up",
  ],
  contentTools: [
    "media_library",
    "seo_fields_editor",
    "open_graph_image",
    "alt_text_manager",
    "slug_editor",
  ],
  testingTools: [
    "hero_ab_testing",
    "product_card_click_tracking",
    "section_click_tracking",
    "cta_performance_comparison",
  ],
};
