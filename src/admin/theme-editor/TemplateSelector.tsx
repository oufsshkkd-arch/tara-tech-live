import type { PreviewPage } from "./types";

const templates: { value: PreviewPage; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "product", label: "Product page" },
  { value: "collection", label: "Collection page" },
  { value: "cart", label: "Cart" },
  { value: "faq", label: "FAQ" },
];

export default function TemplateSelector({
  value,
  onChange,
}: {
  value: PreviewPage;
  onChange: (page: PreviewPage) => void;
}) {
  return (
    <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm lg:inline-flex">
      <span>Template</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as PreviewPage)}
        className="bg-transparent text-xs font-black text-slate-950 outline-none"
      >
        {templates.map((template) => (
          <option key={template.value} value={template.value}>
            {template.label}
          </option>
        ))}
      </select>
    </label>
  );
}
