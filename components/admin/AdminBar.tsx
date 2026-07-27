"use client";

import { useState } from "react";
import { LogIn, LogOut, Lock, Pencil, Eye } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { Field, Modal, SaveButton } from "./Modal";

/**
 * The ADMIN entry point and, once signed in, the edit-mode bar. Fixed to the
 * top-right so it is reachable from any section without scrolling back up.
 *
 * Nothing here is a security boundary — hiding a button stops nobody. Every
 * write is re-checked in the server action and again by row-level security;
 * this is only about not showing chrome to visitors.
 */
export function AdminBar() {
  const { configured, signedIn, editing, email, loading, setEditing, signIn, signOut } =
    useAdmin();
  const [open, setOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const message = await signIn(emailValue, password);
    setBusy(false);
    if (message) {
      setError(message);
      return;
    }
    setPassword("");
    setOpen(false);
  }

  // Don't flash an ADMIN link before we know whether there's a session.
  if (loading) return null;

  return (
    <>
      {/* Inline in the footer. Once edit mode is on the chips stay pinned to
          the viewport instead, so the artist can flip back out without
          scrolling to the bottom of the page again. */}
      <div
        className={
          editing
            ? "fixed bottom-4 right-4 z-[70] flex items-center gap-2 sm:bottom-6 sm:right-6"
            : "flex items-center gap-2"
        }
      >
        {signedIn ? (
          <>
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="admin-chip"
              title={email ?? undefined}
            >
              {editing ? (
                <>
                  <Eye className="size-3.5" />
                  Preview
                </>
              ) : (
                <>
                  <Pencil className="size-3.5" />
                  Edit mode
                </>
              )}
            </button>
            <button type="button" onClick={signOut} className="admin-chip">
              <LogOut className="size-3.5" />
              Exit
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="admin-chip"
          >
            <LogIn className="size-3.5" />
            Admin
          </button>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Admin access"
        title="Edit mode"
      >
        {configured ? (
          <form onSubmit={submit}>
            <p className="m-0 mb-6 -mt-4 text-[14px] leading-[1.5] text-[#000500]/60">
              Sign in to update text, photos and gigs.
            </p>

            <Field
              label="Email"
              type="email"
              autoComplete="username"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <Field
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p
                role="alert"
                className="m-0 mb-4 text-[13px] font-medium text-[#cb1531]"
              >
                {error}
              </p>
            )}

            <SaveButton busy={busy}>Enter edit mode →</SaveButton>
          </form>
        ) : (
          <div className="flex items-start gap-3 rounded-lg bg-[#000500]/4 p-4">
            <Lock className="mt-0.5 size-4 shrink-0 text-[#000500]/45" />
            <p className="m-0 text-[14px] leading-[1.5] text-[#000500]/70">
              Supabase isn&apos;t connected yet. Add{" "}
              <code className="rounded bg-[#000500]/8 px-1">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              and{" "}
              <code className="rounded bg-[#000500]/8 px-1">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              to the environment, then reload.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
