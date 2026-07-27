/**
 * Supabase connection details. Both values are public by design — the anon key
 * is meant to ship to the browser, and every table is guarded by row-level
 * security rather than by hiding this key.
 *
 * They are read through here rather than inline so the whole app has one
 * answer to "is Supabase set up yet?", and the site can fall back to its
 * bundled content when it isn't.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False until both env vars are set, which keeps the site rendering its
 *  bundled copy instead of erroring during setup. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** The single row that holds the whole site document. */
export const CONTENT_ROW_ID = "site";

/** Storage bucket for uploaded photos, clips and cover art. */
export const MEDIA_BUCKET = "media";
