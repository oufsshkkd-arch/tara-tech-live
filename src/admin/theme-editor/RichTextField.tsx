import { Bold, Italic, Link2, List } from "lucide-react";

export default function RichTextField({
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
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-1 border-b border-slate-100 px-2 py-1.5 text-slate-500">
          {[Bold, Italic, List, Link2].map((Icon, index) => (
            <span key={index} className="grid h-7 w-7 place-items-center rounded-lg bg-slate-50">
              <Icon className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          dir="auto"
          className="w-full resize-none rounded-b-xl bg-white px-3 py-2.5 text-sm leading-6 text-slate-950 outline-none"
        />
      </div>
    </label>
  );
}
