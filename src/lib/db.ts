import { supabase } from "./supabase";

/* ── CMS State ──────────────────────────────────────────────────── */

export async function loadCmsState(): Promise<unknown> {
  try {
    const { data, error } = await supabase
      .from("cms_state")
      .select("state")
      .eq("id", "singleton")
      .maybeSingle();
    if (error) throw error;
    return data?.state ?? null;
  } catch {
    return null;
  }
}

export async function saveCmsState(state: unknown): Promise<void> {
  await supabase.from("cms_state").upsert({
    id: "singleton",
    state,
    updated_at: new Date().toISOString(),
  });
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
