import type { HeroFeaturedProductsSettings, Product } from "./types";

export function resolveProducts(
  products: Product[],
  settings: Partial<HeroFeaturedProductsSettings>,
): Product[] {
  const limit = Math.min(settings.productLimit ?? 3, 3);
  let resolved: Product[] = [];

  if (settings.selectionMode !== "collection" && settings.selectedProductIds?.length) {
    resolved = settings.selectedProductIds
      .map((id) => products.find((product) => product.id === id && !product.hidden))
      .filter(Boolean) as Product[];
  }

  if (!resolved.length && settings.selectionMode === "collection" && settings.collectionId) {
    resolved = products.filter(
      (product) => product.categoryId === settings.collectionId && !product.hidden,
    );
  }

  if (!resolved.length) resolved = products.filter((product) => product.featured && !product.hidden);
  if (!resolved.length) resolved = products.filter((product) => !product.hidden);

  return resolved.slice(0, limit);
}

export function trackEvent(name: string, payload?: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent("tara:analytics", { detail: { name, payload } }));
}
