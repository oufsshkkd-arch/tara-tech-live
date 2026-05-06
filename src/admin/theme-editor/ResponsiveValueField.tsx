export type ResponsiveValue<T> = {
  desktop: T;
  tablet: T;
  mobile: T;
};

export default function ResponsiveValueField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ResponsiveValue<number>;
  onChange: (value: ResponsiveValue<number>) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-black text-slate-700">{label}</div>
      <div className="grid grid-cols-3 gap-2">
        {(["desktop", "tablet", "mobile"] as const).map((device) => (
          <label key={device} className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500">{device}</span>
            <input
              type="number"
              value={value[device]}
              onChange={(event) => onChange({ ...value, [device]: Number(event.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-2 py-2 text-xs font-black outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
