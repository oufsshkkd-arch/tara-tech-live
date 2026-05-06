import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { DeviceMode } from "./types";

const devices = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
] as const;

export default function DevicePreviewToggle({
  value,
  onChange,
}: {
  value: DeviceMode;
  onChange: (mode: DeviceMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
      {devices.map((device) => {
        const Icon = device.icon;
        const active = value === device.id;
        return (
          <button
            key={device.id}
            type="button"
            onClick={() => onChange(device.id)}
            className={`inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition ${
              active
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
            }`}
            title={device.label}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden xl:inline">{device.label}</span>
          </button>
        );
      })}
    </div>
  );
}
