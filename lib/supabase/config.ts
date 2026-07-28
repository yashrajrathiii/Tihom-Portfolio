/**
 * Supabase connection details. Both values are public by design — the anon key
 * is meant to ship to the browser, and every table is guarded by row-level
 * security rather than by hiding this key.
 *
 * They are read through here rather than inline so the whole app has one
 * answer to "is Supabase set up yet?", and the site can fall back to its
 * bundled content when it isn't.
 */
/**
 * Reduce whatever was pasted into the env var to the bare project origin.
 *
 * The Supabase dashboard displays the URL as `https://<ref>.supabase.co/rest/v1/`
 * on its API page, so that suffix gets copied across constantly — and
 * supabase-js appends its own paths, turning it into `/rest/v1/auth/v1/token`
 * and every request fails with "Invalid path specified in request URL". The
 * failure is quiet on reads (the site falls back to bundled content) and loud
 * only at sign-in, which makes it a genuinely nasty one to trace.
 */
function projectOrigin(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    return new URL(trimmed).origin;
  } catch {
    // Not a parseable URL — hand it back and let the caller fail loudly.
    return trimmed.replace(/\/+$/, "");
  }
}

export const SUPABASE_URL = projectOrigin(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
);
export const SUPABASE_ANON_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
).trim();

/** False until both env vars are set, which keeps the site rendering its
 *  bundled copy instead of erroring during setup. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** The single row that holds the whole site document. */
export const CONTENT_ROW_ID = "site";

/** Storage bucket for uploaded photos, clips and cover art. */
export const MEDIA_BUCKET = "media";
