import { Palette, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import type { StorefrontThemeConfig } from "../../cms/types";

type ThemeSettings = StorefrontThemeConfig["theme"];

const presets: Record<
  NonNullable<ThemeSettings["colorPreset"]>,
  Pick<ThemeSettings, "primaryColor" | "secondaryColor" | "backgroundColor" | "textColor" | "colorPreset">
> = {
  default: {
    colorPreset: "default",
    primaryColor: "#111111",
    secondaryColor: "#B42318",
    backgroundColor: "#FAF8F5",
    textColor: "#111111",
  },
  minimal: {
    colorPreset: "minimal",
    primaryColor: "#171717",
    secondaryColor: "#525252",
    backgroundColor: "#FAFAFA",
    textColor: "#171717",
  },
  dark: {
    colorPreset: "dark",
    primaryColor: "#F8FAFC",
    secondaryColor: "#3B82F6",
    backgroundColor: "#0F172A",
    textColor: "#F8FAFC",
  },
  warm: {
    colorPreset: "warm",
    primaryColor: "#1A1209",
    secondaryColor: "#EA580C",
    backgroundColor: "#FFFBF5",
    textColor: "#1A1209",
  },
  sage: {
    colorPreset: "sage",
    primaryColor: "#14291A",
    secondaryColor: "#166534",
    backgroundColor: "#F4FAF6",
    textColor: "#14291A",
  },
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-black text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  dir = "auto",
}: {
  value: string;
  onChange: (value: string) => void;
  dir?: "auto" | "ltr" | "rtl";
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      dir={dir}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    />
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-11 rounded-xl border border-slate-200 bg-white p-1"
        />
        <Input value={value} onChange={onChange} dir="ltr" />
      </div>
    </Field>
  );
}

export default function GlobalThemeSettings({
  theme,
  onChange,
}: {
  theme: ThemeSettings;
  onChange: (patch: Partial<ThemeSettings>) => void;
}) {
  return (
    <details className="group rounded-3xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <Palette className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-slate-950">Global theme settings</span>
          <span className="block text-[11px] text-slate-500">Colors, typography, cards, cart, WhatsApp</span>
        </span>
        <SlidersHorizontal className="h-4 w-4 text-slate-400" />
      </summary>

      <div className="space-y-4 border-t border-slate-100 p-4">
        <div>
          <div className="mb-2 text-[11px] font-black uppercase tracking-wide text-slate-500">
            Color presets
          </div>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(presets) as NonNullable<ThemeSettings["colorPreset"]>[]).map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => onChange(presets[preset])}
                className={`rounded-2xl border p-2 text-[10px] font-black capitalize transition ${
                  theme.colorPreset === preset
                    ? "border-slate-950 ring-2 ring-slate-950/10"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <span
                  className="mx-auto mb-1 block h-6 w-6 rounded-full"
                  style={{ backgroundColor: presets[preset].backgroundColor, border: `4px solid ${presets[preset].secondaryColor}` }}
                />
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ColorField label="Primary" value={theme.primaryColor} onChange={(primaryColor) => onChange({ primaryColor })} />
          <ColorField label="Accent" value={theme.secondaryColor || ""} onChange={(secondaryColor) => onChange({ secondaryColor })} />
          <ColorField label="Background" value={theme.backgroundColor || ""} onChange={(backgroundColor) => onChange({ backgroundColor })} />
          <ColorField label="Text" value={theme.textColor || ""} onChange={(textColor) => onChange({ textColor })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Heading font">
            <Select
              value={theme.headingFontFamily || "Cairo"}
              onChange={(headingFontFamily) => onChange({ headingFontFamily, fontFamily: headingFontFamily })}
              options={[
                { label: "Cairo", value: "Cairo" },
                { label: "Tajawal", value: "Tajawal" },
                { label: "Inter", value: "Inter" },
              ]}
            />
          </Field>
          <Field label="Body font">
            <Select
              value={theme.bodyFontFamily || "Cairo"}
              onChange={(bodyFontFamily) => onChange({ bodyFontFamily })}
              options={[
                { label: "Cairo", value: "Cairo" },
                { label: "Tajawal", value: "Tajawal" },
                { label: "Inter", value: "Inter" },
              ]}
            />
          </Field>
          <Field label="Layout width">
            <Select
              value={theme.layoutWidth || "contained"}
              onChange={(layoutWidth) => onChange({ layoutWidth: layoutWidth as ThemeSettings["layoutWidth"] })}
              options={[
                { label: "Contained", value: "contained" },
                { label: "Wide", value: "wide" },
                { label: "Full", value: "full" },
              ]}
            />
          </Field>
          <Field label="Border radius">
            <Select
              value={theme.radius}
              onChange={(radius) => onChange({ radius: radius as ThemeSettings["radius"] })}
              options={[
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" },
              ]}
            />
          </Field>
          <Field label="Shadows">
            <Select
              value={theme.shadowStyle || "soft"}
              onChange={(shadowStyle) => onChange({ shadowStyle: shadowStyle as ThemeSettings["shadowStyle"] })}
              options={[
                { label: "None", value: "none" },
                { label: "Soft", value: "soft" },
                { label: "Deep", value: "deep" },
              ]}
            />
          </Field>
          <Field label="Spacing">
            <Select
              value={theme.spacingScale || "normal"}
              onChange={(spacingScale) => onChange({ spacingScale: spacingScale as ThemeSettings["spacingScale"] })}
              options={[
                { label: "Compact", value: "compact" },
                { label: "Normal", value: "normal" },
                { label: "Airy", value: "airy" },
              ]}
            />
          </Field>
          <Field label="Buttons">
            <Select
              value={theme.buttonStyle || "pill"}
              onChange={(buttonStyle) => onChange({ buttonStyle: buttonStyle as ThemeSettings["buttonStyle"] })}
              options={[
                { label: "Rounded", value: "rounded" },
                { label: "Pill", value: "pill" },
                { label: "Sharp", value: "sharp" },
              ]}
            />
          </Field>
          <Field label="Product cards">
            <Select
              value={theme.productCardStyle || "elevated"}
              onChange={(productCardStyle) =>
                onChange({ productCardStyle: productCardStyle as ThemeSettings["productCardStyle"] })
              }
              options={[
                { label: "Minimal", value: "minimal" },
                { label: "Elevated", value: "elevated" },
                { label: "Bordered", value: "bordered" },
              ]}
            />
          </Field>
          <Field label="Header">
            <Select
              value={theme.headerStyle || "sticky"}
              onChange={(headerStyle) => onChange({ headerStyle: headerStyle as ThemeSettings["headerStyle"] })}
              options={[
                { label: "Clean", value: "clean" },
                { label: "Sticky", value: "sticky" },
                { label: "Transparent", value: "transparent" },
              ]}
            />
          </Field>
          <Field label="Cart drawer">
            <Select
              value={theme.cartDrawerStyle || "comfortable"}
              onChange={(cartDrawerStyle) =>
                onChange({ cartDrawerStyle: cartDrawerStyle as ThemeSettings["cartDrawerStyle"] })
              }
              options={[
                { label: "Compact", value: "compact" },
                { label: "Comfortable", value: "comfortable" },
              ]}
            />
          </Field>
        </div>

        <Field label="WhatsApp">
          <Input value={theme.whatsapp || ""} onChange={(whatsapp) => onChange({ whatsapp })} dir="ltr" />
        </Field>
        <div className="grid grid-cols-3 gap-2">
          <Field label="Instagram">
            <Input
              value={theme.socialLinks?.instagram || ""}
              onChange={(instagram) =>
                onChange({ socialLinks: { ...(theme.socialLinks ?? {}), instagram } })
              }
              dir="ltr"
            />
          </Field>
          <Field label="TikTok">
            <Input
              value={theme.socialLinks?.tiktok || ""}
              onChange={(tiktok) => onChange({ socialLinks: { ...(theme.socialLinks ?? {}), tiktok } })}
              dir="ltr"
            />
          </Field>
          <Field label="Facebook">
            <Input
              value={theme.socialLinks?.facebook || ""}
              onChange={(facebook) =>
                onChange({ socialLinks: { ...(theme.socialLinks ?? {}), facebook } })
              }
              dir="ltr"
            />
          </Field>
        </div>
      </div>
    </details>
  );
}
