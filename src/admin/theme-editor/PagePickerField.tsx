const pages = [
  { label: "Home", value: "/" },
  { label: "Products", value: "/products" },
  { label: "FAQ", value: "/faq" },
  { label: "Contact", value: "/contact" },
  { label: "Story", value: "/notre-histoire" },
];

export default function PagePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      >
        {pages.map((page) => (
          <option key={page.value} value={page.value}>
            {page.label}
          </option>
        ))}
      </select>
    </label>
  );
}
