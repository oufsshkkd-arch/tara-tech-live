import { useRef } from "react";
import { Upload, X, Link } from "lucide-react";

export default function ImageUpload({
  value,
  onChange,
  placeholder = "https://...",
  aspectRatio = "aspect-video",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  aspectRatio?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const isBase64 = value.startsWith("data:");

  return (
    <div className="space-y-2">
      {value && (
        <div className={`relative rounded-xl overflow-hidden border border-line ${aspectRatio} bg-gray-100`}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full shadow border border-line grid place-items-center text-body hover:text-red transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          {isBase64 && (
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
              Fichier local
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-body/40 pointer-events-none" />
          <input
            className="input pl-7 text-sm w-full"
            placeholder={placeholder}
            value={isBase64 ? "" : value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line text-xs font-medium text-body hover:bg-ink hover:text-white hover:border-ink transition-colors"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
