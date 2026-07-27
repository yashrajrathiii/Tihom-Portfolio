"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Browser-side Supabase client, used by the admin panel for sign-in, sign-out
 * and media uploads. Returns null when Supabase isn't configured, so the admin
 * UI can say so plainly instead of throwing.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
