import { DatabaseZap } from "lucide-react";

export type DynamicSourceRef = {
  type: "dynamic";
  source: string;
  fallback: string;
};

const sources = [
  { label: "product.name", value: "product.title" },
  { label: "product.price", value: "product.price" },
  { label: "product.oldPrice", value: "product.compareAtPrice" },
  { label: "product.image", value: "product.image" },
  { label: "product.rating", value: "product.rating" },
  { label: "product.stock", value: "product.stock" },
  { label: "collection.title", value: "collection.title" },
  { label: "collection.image", value: "collection.image" },
  { label: "store.whatsapp", value: "shop.whatsapp" },
  { label: "custom.metafield", value: "custom.metafield" },
];

export default function DynamicSourceButton({
  fallback,
  onPick,
}: {
  fallback: string;
  onPick: (source: DynamicSourceRef, token: string) => void;
}) {
  return (
    <label className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-blue-700 transition hover:bg-blue-50">
      <DatabaseZap className="pointer-events-none h-4 w-4" />
      <select
        aria-label="Dynamic source"
        defaultValue=""
        onChange={(event) => {
          const source = event.target.value;
          if (!source) return;
          onPick({ type: "dynamic", source, fallback }, `{{ ${source} }}`);
          event.target.value = "";
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="">Dynamic source</option>
        {sources.map((source) => (
          <option key={source.value} value={source.value}>
            {source.label}
          </option>
        ))}
      </select>
    </label>
  );
}
