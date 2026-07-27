"use server";

import { revalidatePath } from "next/cache";
import type { SectionKey, SiteContent } from "@/content/schema";
import { SECTIONS } from "@/content/schema";
import { defaultContent } from "@/content/site";
import { CONTENT_ROW_ID } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Write one section of the site document.
 *
 * Read-modify-write on a single JSON column: the row is read, the one section
 * is replaced, and the whole document goes back. With a single author that is
 * safe, and it keeps the stored tree identical to the shape the page renders.
 *
 * The session is re-checked here rather than trusted from the client — a
 * server action is a public endpoint, so the caller's cookie is the only thing
 * that counts. RLS is the second lock behind this one.
 */
export async function saveSection<K extends SectionKey>(
  section: K,
  value: SiteContent[K],
): Promise<ActionResult> {
  if (!SECTIONS.includes(section)) {
    return { ok: false, error: "Unknown section." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Supabase isn't configured yet." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You're signed out — sign in and try again." };
  }

  const { data: existing, error: readError } = await supabase
    .from("site_content")
    .select("doc")
    .eq("id", CONTENT_ROW_ID)
    .maybeSingle();

  if (readError) return { ok: false, error: readError.message };

  // No row yet: start from what the site currently ships so the first save
  // stores a complete document rather than a lone section.
  const base = (existing?.doc as SiteContent | undefined) ?? defaultContent;
  const doc: SiteContent = { ...base, [section]: value };

  const { error: writeError } = await supabase
    .from("site_content")
    .upsert({ id: CONTENT_ROW_ID, doc }, { onConflict: "id" });

  if (writeError) return { ok: false, error: writeError.message };

  revalidatePath("/");
  return { ok: true };
}

/** Drop an uploaded file once nothing references it any more. */
export async function deleteMedia(paths: string[]): Promise<ActionResult> {
  if (!paths.length) return { ok: true };

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase isn't configured yet." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're signed out." };

  const { error } = await supabase.storage.from("media").remove(paths);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
