import { AlertCircle, CheckCircle2, CircleDotDashed, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SaveStatus } from "./types";

const statusCopy: Record<SaveStatus, { label: string; className: string; icon: LucideIcon }> = {
  idle: {
    label: "Live",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    icon: CircleDotDashed,
  },
  dirty: {
    label: "تغييرات غير محفوظة",
    className: "bg-amber-50 text-amber-700 ring-amber-100",
    icon: CircleDotDashed,
  },
  saving: {
    label: "كيحفظ...",
    className: "bg-blue-50 text-blue-700 ring-blue-100",
    icon: Loader2,
  },
  saved: {
    label: "محفوظ",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    icon: CheckCircle2,
  },
  error: {
    label: "خطأ فالحفظ",
    className: "bg-red-50 text-red-700 ring-red-100",
    icon: AlertCircle,
  },
};

export default function SaveStatusBadge({ status }: { status: SaveStatus }) {
  const current = statusCopy[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${current.className}`}
    >
      <Icon className={`h-3.5 w-3.5 ${status === "saving" ? "animate-spin" : ""}`} />
      {current.label}
    </span>
  );
}
