import { supabase } from "./supabase";

export const CMS_STATE_ID = "storefront";
const LEGACY_CMS_STATE_ID = "singleton";

/* ── CMS State ──────────────────────────────────────────────────── */

async function selectCmsState(id: string): Promise<{ found: boolean; state: unknown }> {
  const { data, error } = await supabase
    .from("cms_state")
    .select("state")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return { found: Boolean(data), state: data?.state ?? null };
}

export async function loadCmsState(): Promise<unknown> {
  try {
    const storefront = await selectCmsState(CMS_STATE_ID);
    if (storefront.found) return storefront.state;

    const legacy = await selectCmsState(LEGACY_CMS_STATE_ID);
    if (legacy.found) {
      await saveCmsState(legacy.state);
      return legacy.state;
    }

    return null;
  } catch {
    return null;
  }
}

export async function saveCmsState(state: unknown): Promise<void> {
  await supabase.from("cms_state").upsert({
    id: CMS_STATE_ID,
    state,
    updated_at: new Date().toISOString(),
  });
}

export function subscribeCmsState(onState: (state: unknown) => void) {
  const channel = supabase
    .channel(`cms_state:${CMS_STATE_ID}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cms_state",
        filter: `id=eq.${CMS_STATE_ID}`,
      },
      (payload) => {
        if (payload.eventType === "DELETE") return;
        onState((payload.new as { state?: unknown }).state ?? null);
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

/* ── Orders ─────────────────────────────────────────────────────── */

export async function loadOrders(): Promise<unknown[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data?.map((r) => r.data) ?? [];
  } catch {
    return [];
  }
}

export async function saveOrder(order: Record<string, unknown>): Promise<void> {
  const id = String(order.id ?? crypto.randomUUID());
  await supabase.from("orders").upsert({ id, data: order });
}
