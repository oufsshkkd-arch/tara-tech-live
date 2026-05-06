import type {
  StorefrontThemeConfig,
  ThemeEditorSection,
  ThemeEditorSectionType,
} from "../../cms/types";

export type DeviceMode = "desktop" | "tablet" | "mobile";

export type PreviewPage = "home" | "product" | "collection" | "cart" | "faq";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export type EditorSection = ThemeEditorSection;

export type SectionId = string;

export type SectionType = ThemeEditorSectionType;

export type ThemeConfig = StorefrontThemeConfig;
