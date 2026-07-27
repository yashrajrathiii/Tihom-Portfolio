import { createClient } from "@supabase/supabase-js";
import type { SiteContent } from "@/content/schema";
import { defaultContent } from "@/content/site";
import {
  CONTENT_ROW_ID,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./supabase/config";

/**
 * Merge a stored document over the defaults, one section deep.
 *
 * Shallow-per-section rather than a blind spread: it means a section added to
 * the schema after the row was written still renders (it falls through to its
 * default) instead of arriving as undefined and crashing the page.
 */
function withDefaults(stored: Partial<SiteContent> | null): SiteContent {
  if (!stored) return defaultContent;
  const merged: SiteContent = { ...defaultContent };
  for (const key of Object.keys(defaultContent) as (keyof SiteContent)[]) {
    const value = stored[key];
    if (value !== undefined && value !== null) {
      // Each section is replaced wholesale — the editor always submits a
      // complete section, so a partial merge would only mask a bad write.
      // Object.assign rather than merged[key] = …: with a union key,
      // TypeScript widens the target and the value independently and can't
      // see that the two are correlated.
      Object.assign(merged, { [key]: value });
    }
  }
  return merged;
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

    if (error || !data) return defaultContent;
    return withDefaults(data.doc as Partial<SiteContent>);
  } catch {
    return defaultContent;
  }
}
