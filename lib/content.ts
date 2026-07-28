import { createClient } from "@supabase/supabase-js";
import type { SiteContent } from "@/content/schema";
import { defaultContent } from "@/content/site";
import {
  CONTENT_ROW_ID,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./supabase/config";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Merge a stored document over the defaults, recursively.
 *
 * Objects merge key by key so a field added to the schema *after* a row was
 * written still renders — it falls through to its default instead of arriving
 * undefined and blanking part of the page. Without this, every schema change
 * would need a migration of the stored JSON.
 *
 * Arrays are replaced wholesale, never merged: the lists are the artist's, and
 * merging would make a deleted gig reappear from the defaults.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override as T;

  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = key in base ? deepMerge(base[key], value) : value;
  }
  return out as T;
}

function withDefaults(stored: Partial<SiteContent> | null): SiteContent {
  if (!stored) return defaultContent;
  return deepMerge(defaultContent, stored);
}

/**
 * The live site content. Falls back to the bundled copy whenever Supabase is
 * unconfigured, unreachable, or has no row yet — so the site never renders
 * blank because of the database.
 *
 * Deliberately a plain anon client rather than the cookie-bound one: the
 * document is world-readable, and reading cookies here would opt the whole
 * page out of static rendering and make every visitor pay for a server render
 * plus a round trip. Writes still go through the session-aware client in the
 * server action, where the identity actually matters.
 */
export async function getContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return defaultContent;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("doc")
      .eq("id", CONTENT_ROW_ID)
      .maybeSingle();

    if (error) {
      // Loud in the server log, quiet on the page. Falling back silently once
      // hid a bad SUPABASE_URL for a whole deploy — the site looked fine while
      // none of the artist's edits were reaching it.
      console.warn("[content] Supabase read failed, using bundled copy:", error.message);
      return defaultContent;
    }
    if (!data) return defaultContent;
    return withDefaults(data.doc as Partial<SiteContent>);
  } catch (err) {
    console.warn("[content] Supabase unreachable, using bundled copy:", err);
    return defaultContent;
  }
}
