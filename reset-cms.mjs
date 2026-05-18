import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Read the .env file to get Supabase credentials
const envContent = readFileSync(".env", "utf8");
const env = Object.fromEntries(
  envContent.split("\n").filter(l => l.includes("=")).map(l => {
    const [k, ...v] = l.split("=");
    return [k.trim(), v.join("=").trim()];
  })
);

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

// Delete the CMS state so it falls back to seed
const { error } = await supabase
  .from("cms_state")
  .delete()
  .eq("id", "storefront");

if (error) {
  console.error("Failed to delete CMS state:", error);
  process.exit(1);
}

console.log("✅ CMS state deleted successfully. The app will now use seed.ts defaults.");
console.log("   Reload the admin panel to see the changes.");
