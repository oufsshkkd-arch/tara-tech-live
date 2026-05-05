import { createClient } from "@supabase/supabase-js";

export const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    cache: "no-store",
  });

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string,
  {
    global: {
      fetch: noStoreFetch,
    },
  },
);
