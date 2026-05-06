import type { Category } from "../../cms/types";

export default function CollectionPickerField({
  label,
  value,
  collections,
  onChange,
}: {
  label: string;
  value: string;
  collections: Category[];
  onChange: (id: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      >
        <option value="">اختار collection</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.title}
          </option>
        ))}
      </select>
    </label>
  );
}
