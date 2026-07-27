import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Server-side Supabase client bound to the request's cookies, so a signed-in
 * admin's session reaches the database and RLS can tell them apart from a
 * visitor. Returns null when Supabase isn't configured.
 *
 * `cookies()` is only writable inside a Server Action or Route Handler; in a
 * Server Component the setter throws, which is expected and safe to swallow —
 * the session is refreshed on the next action instead.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const store = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — nothing to do.
        }
      },
    },
  });
}

/** The signed-in user, or null. Used to gate every write. */
export async function getAdminUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
