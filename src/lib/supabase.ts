import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cxsrhqtwdlgrtgwdugcl.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_Xs21ictpjjI-GVij4LPEWA_iWoRJFiU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
