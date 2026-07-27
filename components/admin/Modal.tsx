"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * The shell every admin dialog sits in. A real <dialog> so the browser handles
 * focus trapping, Escape, and inertness of the page behind it rather than us
 * re-implementing all three badly.
 */
export function Modal({
  open,
  onClose,
  eyebrow,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clicking the backdrop closes; clicking the card must not, so the
      // handler checks the click actually landed on the dialog element.
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="admin-modal"
    >
      <div className="admin-modal-card">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#000500]/45 transition-colors hover:bg-[#000500]/6 hover:text-[#000500]"
        >
          <X className="size-4" />
        </button>

        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e3888]">
          {eyebrow}
        </p>
        <h2 className="m-0 mb-6 mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-[#000500]">
          {title}
        </h2>

        {children}
      </div>
    </dialog>
  );
}

/** Labelled text input, matching the admin panel's light-on-white look. */
export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mb-4 block">
      <span className="admin-label">{label}</span>
      <input {...props} className="admin-input" />
    </label>
  );
}

/** Multi-line variant, for prose and lists. */
export function Area({
  label,
  hint,
  rows = 5,
  ...props
}: {
  label: string;
  hint?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="mb-4 block">
      <span className="admin-label">
        {label}
        {hint && <span className="normal-case opacity-60"> — {hint}</span>}
      </span>
      <textarea {...props} rows={rows} className="admin-input resize-y" />
    </label>
  );
}

/** The primary blue submit bar at the foot of every dialog. */
export function SaveButton({
  children,
  busy,
  ...props
}: { busy?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} disabled={busy || props.disabled} className="admin-save">
      {busy ? "Saving…" : children}
    </button>
  );
}
