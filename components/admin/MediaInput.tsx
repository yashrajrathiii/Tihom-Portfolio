"use client";

import { useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { MEDIA_BUCKET } from "@/lib/supabase/config";

/** What the picker will take, by kind. */
const ACCEPT = {
  photo: "image/*",
  video: "video/*",
  both: "image/*,video/*",
} as const;

/** Refuse oversized files up front rather than after a long failed upload. */
const MAX_MB = { photo: 8, video: 50 } as const;

function isVideo(file: File) {
  return file.type.startsWith("video/");
}

/**
 * Uploads straight from the browser to Supabase Storage and hands back the
 * public URL. Going direct keeps large clips off the server action, which has
 * a request body limit far below a 50MB video.
 */
export function MediaInput({
  label,
  value,
  kind = "both",
  onChange,
}: {
  label: string;
  value?: string;
  /** Restricts the file picker and the size cap. */
  kind?: keyof typeof ACCEPT;
  onChange: (next: { url: string; isVideo: boolean } | null) => void;
}) {
  const { supabase } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file || !supabase) return;
    setError(null);

    const video = isVideo(file);
    const cap = video ? MAX_MB.video : MAX_MB.photo;
    if (file.size > cap * 1024 * 1024) {
      setError(`That file is over ${cap}MB. Try a smaller one.`);
      return;
    }

    setBusy(true);
    // Random prefix: two uploads of "photo.jpg" must not collide, and the
    // original name is kept on the end so the bucket stays readable.
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-40);
    const path = `${crypto.randomUUID().slice(0, 8)}-${safe}`;

    const { error: upErr } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (upErr) {
      setBusy(false);
      setError(upErr.message);
      return;
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    setBusy(false);
    onChange({ url: data.publicUrl, isVideo: video });
  }

  const looksVideo = value ? /\.(mp4|webm|mov|m4v)(\?|$)/i.test(value) : false;

  return (
    <div className="mb-4">
      <span className="admin-label">{label}</span>

      <div className="mt-1 overflow-hidden rounded-lg border border-[#000500]/12">
        <div className="relative grid aspect-video place-items-center bg-[#000500]/4">
          {value ? (
            looksVideo ? (
              <video
                src={value}
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              // Admin-side preview of an arbitrary uploaded URL; next/image
              // would need every future Storage host in remotePatterns.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )
          ) : (
            <span className="flex flex-col items-center gap-2 text-[#000500]/35">
              <ImageIcon className="size-6" />
              <span className="text-[12px]">Nothing uploaded yet</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-[#000500]/10 p-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy || !supabase}
            className="admin-ghost flex-1"
          >
            <Upload className="size-3.5" />
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove media"
              className="admin-ghost text-[#cb1531]"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={input}
        type="file"
        accept={ACCEPT[kind]}
        hidden
        onChange={(e) => {
          void pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && (
        <p role="alert" className="m-0 mt-2 text-[13px] text-[#cb1531]">
          {error}
        </p>
      )}
    </div>
  );
}
