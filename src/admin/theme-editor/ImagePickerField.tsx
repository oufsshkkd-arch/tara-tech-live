import { Image } from "lucide-react";

export default function ImagePickerField({
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
      <div className="flex items-center gap-2">
        <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-400">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <Image className="h-4 w-4" />}
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          dir="ltr"
          placeholder="https://..."
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </div>
    </label>
  );
}
