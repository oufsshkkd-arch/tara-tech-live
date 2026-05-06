import { supabase } from "./supabase";
import type { MediaAsset } from "../cms/types";

export const THEME_ASSETS_BUCKET = "theme-assets";

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPublicAssetUrl(path: string, bucket = THEME_ASSETS_BUCKET) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadThemeAsset(file: File, folder = "media"): Promise<MediaAsset> {
  const extension = file.name.split(".").pop() || "asset";
  const baseName = safeFileName(file.name.replace(/\.[^.]+$/, "")) || "theme-asset";
  const path = `${folder}/${Date.now()}-${baseName}.${extension}`;

  const { data, error } = await supabase.storage
    .from(THEME_ASSETS_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) throw error;
  const publicPath = data.path;

  return {
    type: "upload",
    bucket: THEME_ASSETS_BUCKET,
    path: publicPath,
    url: getPublicAssetUrl(publicPath),
    alt: file.name.replace(/\.[^.]+$/, ""),
    mimeType: file.type,
    size: file.size,
  };
}

export async function listThemeAssets(folder = ""): Promise<MediaAsset[]> {
  const { data, error } = await supabase.storage
    .from(THEME_ASSETS_BUCKET)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) throw error;

  return (data ?? [])
    .filter((item) => item.name && !item.name.endsWith("/"))
    .map((item) => {
      const path = folder ? `${folder}/${item.name}` : item.name;
      return {
        type: "upload",
        bucket: THEME_ASSETS_BUCKET,
        path,
        url: getPublicAssetUrl(path),
        alt: item.name.replace(/\.[^.]+$/, ""),
        mimeType: item.metadata?.mimetype,
        size: item.metadata?.size,
      } satisfies MediaAsset;
    });
}

export async function deleteThemeAsset(asset: MediaAsset): Promise<void> {
  if (asset.type !== "upload" || !asset.path) return;
  const { error } = await supabase.storage.from(asset.bucket || THEME_ASSETS_BUCKET).remove([asset.path]);
  if (error) throw error;
}
