export default function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
    >
      <span>{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-slate-950" : "bg-slate-200"}`}>
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "right-6" : "right-1"
          }`}
        />
      </span>
    </button>
  );
}
