"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AdminState = {
  /** Supabase is wired up. False during setup, which disables the whole panel. */
  configured: boolean;
  /** Someone is signed in. */
  signedIn: boolean;
  /** Signed in *and* has flipped edit mode on — what reveals the EDIT buttons. */
  editing: boolean;
  email: string | null;
  supabase: SupabaseClient | null;
  loading: boolean;
  setEditing: (on: boolean) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AdminState | null>(null);

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}

/**
 * Holds the admin session for the page. Signing in does not immediately show
 * the editing chrome — edit mode is a second, explicit switch, so the artist
 * can stay signed in and still look at the site the way a visitor does.
 */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  // One client for the lifetime of the page; a new one per render would drop
  // the auth subscription every time.
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [editing, setEditingState] = useState(false);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // Losing the session must also drop the editing chrome, or the UI would
      // offer buttons whose saves are all going to be rejected.
      if (!next) setEditingState(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return "Supabase isn't configured yet.";
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return error.message;
      setEditingState(true);
      return null;
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setEditingState(false);
  }, [supabase]);

  const value = useMemo<AdminState>(
    () => ({
      configured: isSupabaseConfigured,
      signedIn: Boolean(session),
      editing: Boolean(session) && editing,
      email: session?.user.email ?? null,
      supabase,
      loading,
      setEditing: setEditingState,
      signIn,
      signOut,
    }),
    [session, editing, supabase, loading, signIn, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
