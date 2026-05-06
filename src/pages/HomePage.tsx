import { useMemo } from "react";
import { useCms } from "../cms/store";
import StorefrontRenderer from "../admin/theme-editor/StorefrontRenderer";
import { normalizeThemeConfig } from "../admin/theme-editor/themeConfig";

export default function HomePage() {
  const cms = useCms();
  const config = useMemo(() => normalizeThemeConfig(cms), [cms]);

  return <StorefrontRenderer sections={config.templates?.home?.sections ?? config.sections} mode="public" />;
}
