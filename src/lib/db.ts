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
  const { error } = await supabase.from("orders").upsert({ id, data: order });
  if (error) throw error;
}

/* ── Analytics events (server-side counters) ────────────────────── */

// Fire-and-forget: never blocks the UX, swallows errors silently.
// Requires the `track_events` table to exist in Supabase. If missing,
// the insert fails and is ignored — funnel counts simply stay at 0.
export async function logEvent(
  event: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await supabase.from("track_events").insert({ event, metadata });
  } catch {
    /* ignore — analytics must never break the app */
  }
}

export type InsightsTotals = {
  pageViews: number;
  formStarts: number;
  formSubmissions: number;   // total order rows in Supabase
  whatsappClicks: number;
  ordersConfirmed: number;   // status === "مؤكد" or similar successful state
  tableExists: boolean;      // false if `track_events` is missing → guidance UI
};

async function countEvents(event: string): Promise<{ count: number; exists: boolean }> {
  const { count, error } = await supabase
    .from("track_events")
    .select("id", { count: "exact", head: true })
    .eq("event", event);
  if (error) {
    // Most common: relation "track_events" does not exist
    return { count: 0, exists: false };
  }
  return { count: count ?? 0, exists: true };
}

async function countOrders(): Promise<{ total: number; confirmed: number }> {
  try {
    // Pull data column to inspect status; orders table is typically small
    const { data, error } = await supabase.from("orders").select("data");
    if (error) throw error;
    const rows = data ?? [];
    let confirmed = 0;
    for (const r of rows) {
      const status = (r as { data?: { status?: string } }).data?.status;
      // Successful = any non-cancelled state. Adjust here if you want strict "مؤكد" only.
      if (status && status !== "ملغي") confirmed++;
    }
    return { total: rows.length, confirmed };
  } catch {
    return { total: 0, confirmed: 0 };
  }
}

export async function fetchInsights(): Promise<InsightsTotals> {
  const [pv, fs, wc, orders] = await Promise.all([
    countEvents("page_view"),
    countEvents("form_start"),
    countEvents("wa_click"),
    countOrders(),
  ]);
  // If any track_events query reports the table missing, surface that to UI
  const tableExists = pv.exists && fs.exists && wc.exists;
  return {
    pageViews:       pv.count,
    formStarts:      fs.count,
    whatsappClicks:  wc.count,
    formSubmissions: orders.total,
    ordersConfirmed: orders.confirmed,
    tableExists,
  };
}
