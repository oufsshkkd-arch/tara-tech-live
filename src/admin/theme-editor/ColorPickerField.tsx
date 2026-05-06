export default function ColorPickerField({
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
      <span className="text-[11px] font-black text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 rounded-xl border border-slate-200 bg-white p-1"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          dir="ltr"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-950 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </div>
    </label>
  );
}
