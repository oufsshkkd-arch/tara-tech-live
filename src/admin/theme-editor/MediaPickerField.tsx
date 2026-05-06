import { Image, Loader2, Trash2, Upload, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { MediaAsset } from "../../cms/types";
import { listThemeAssets, uploadThemeAsset } from "../../lib/storage";

function mediaUrl(asset: MediaAsset | null) {
  return asset?.url ?? "";
}

function accepts(kind: "image" | "video" | "all") {
  if (kind === "image") return "image/*";
  if (kind === "video") return "video/*";
  return "image/*,video/*";
}

export default function MediaPickerField({
  label,
  value,
  kind = "image",
  folder = "theme",
  onChange,
}: {
  label: string;
  value: MediaAsset | null;
  kind?: "image" | "video" | "all";
  folder?: string;
  onChange: (asset: MediaAsset | null) => void;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");

  async function refreshAssets() {
    setLoading(true);
    setError("");
    try {
      setAssets(await listThemeAssets(folder));
    } catch (storageError) {
      console.warn("Theme assets list failed", storageError);
      setError("تعذر تحميل مكتبة الميديا. تأكد من bucket theme-assets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const filteredAssets = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return assets
      .filter((asset) => {
        if (kind === "image") return asset.mimeType?.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(asset.url);
        if (kind === "video") return asset.mimeType?.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(asset.url);
        return true;
      })
      .filter((asset) => !cleanQuery || `${asset.alt ?? ""} ${asset.path ?? ""}`.toLowerCase().includes(cleanQuery))
      .slice(0, 12);
  }, [assets, kind, query]);

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-700">{label}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          disabled={!value}
          className="grid h-8 w-8 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
          title="Remove media"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white p-2">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
          {value?.mimeType?.startsWith("video/") ? (
            <Video className="h-5 w-5" />
          ) : mediaUrl(value) ? (
            <img src={mediaUrl(value)} alt={value?.alt ?? ""} className="h-full w-full object-cover" />
          ) : kind === "video" ? (
            <Video className="h-5 w-5" />
          ) : (
            <Image className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-black text-slate-800">{value?.alt || value?.path || "ماكاين حتى media مختارة"}</div>
          <div className="mt-1 truncate text-[11px] text-slate-400">{mediaUrl(value) || "Supabase Storage"}</div>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Upload {kind}
        <input
          type="file"
          accept={accepts(kind)}
          className="hidden"
          disabled={uploading}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setUploading(true);
            setError("");
            try {
              const asset = await uploadThemeAsset(file, folder);
              onChange(asset);
              setAssets((items) => [asset, ...items]);
            } catch (uploadError) {
              console.warn("Theme asset upload failed", uploadError);
              setError("فشل الرفع. تأكد من bucket وسياسات Supabase Storage.");
            } finally {
              setUploading(false);
              event.target.value = "";
            }
          }}
        />
      </label>

      <input
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && urlInput.trim()) {
            const url = urlInput.trim();
            onChange({ type: "upload", bucket: "", path: url, url, alt: url.split("/").pop() ?? "" });
            setUrlInput("");
          }
        }}
        onBlur={() => {
          if (urlInput.trim()) {
            const url = urlInput.trim();
            onChange({ type: "upload", bucket: "", path: url, url, alt: url.split("/").pop() ?? "" });
            setUrlInput("");
          }
        }}
        placeholder="أو الصق رابط الصورة مباشرة..."
        dir="ltr"
        className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="بحث فالميديا..."
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />

      {loading && <div className="text-[11px] font-bold text-slate-400">جاري تحميل مكتبة الميديا...</div>}
      {error && (
        <div className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700">
          {error}
          <span className="block mt-1 font-normal opacity-80">يمكنك استخدام رابط الصورة مباشرة بالحقل أعلاه.</span>
        </div>
      )}

      {filteredAssets.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {filteredAssets.map((asset) => (
            <button
              type="button"
              key={asset.path ?? asset.url}
              onClick={() => onChange(asset)}
              className={`aspect-square overflow-hidden rounded-2xl border bg-white transition hover:border-slate-950 ${
                value?.url === asset.url ? "border-slate-950 ring-2 ring-slate-950/10" : "border-slate-200"
              }`}
              title={asset.alt || asset.path}
            >
              {asset.mimeType?.startsWith("video/") ? (
                <span className="grid h-full w-full place-items-center text-slate-400">
                  <Video className="h-5 w-5" />
                </span>
              ) : (
                <img src={asset.url} alt={asset.alt ?? ""} className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
