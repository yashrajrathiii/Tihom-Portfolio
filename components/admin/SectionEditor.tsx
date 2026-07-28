"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { saveSection } from "@/app/actions";
import type { SectionKey, SiteContent } from "@/content/schema";
import { useAdmin } from "./AdminProvider";
import { Area, Field, Modal, SaveButton } from "./Modal";
import { MediaInput } from "./MediaInput";

const TITLES: Record<SectionKey, string> = {
  hero: "Hero",
  about: "Bio & genres",
  timeline: "Timeline",
  journey: "Journey & gigs",
  genres: "Genres",
  contact: "Contact",
};

/**
 * The EDIT affordance for one section, plus the dialog behind it. Renders
 * nothing at all unless edit mode is on, so visitors get the untouched page
 * and no extra markup.
 */
export function SectionEditor<K extends SectionKey>({
  section,
  value,
  className = "",
}: {
  section: K;
  value: SiteContent[K];
  className?: string;
}) {
  const { editing } = useAdmin();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SiteContent[K]>(value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!editing) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await saveSection(section, draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // A server action's id is content-hashed per build, so a tab left open
      // across a deploy posts an id the new build has never heard of and gets
      // a 404. Nothing is wrong with the data — the page just needs reloading.
      setError(
        /server action|failed to fetch|fetch failed|networkerror|load failed/i.test(
          message,
        )
          ? "Couldn't reach the server. The page was loaded before the last update — reload and try again."
          : `Save failed: ${message}`,
      );
    } finally {
      // Always clears, so a thrown action can never strand the button on
      // "Saving…" with no way back.
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        // Seed the draft on open rather than syncing it in an effect, so the
        // form always starts from what the page is currently showing.
        onClick={() => {
          setDraft(value);
          setError(null);
          setOpen(true);
        }}
        className={`admin-edit ${className}`}
      >
        <Pencil className="size-3" />
        Edit
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={`Section · ${TITLES[section]}`}
        title={`Edit ${TITLES[section].toLowerCase()}`}
      >
        <form onSubmit={save}>
          <div className="admin-scroll">
            <Body
              section={section}
              draft={draft}
              setDraft={setDraft as (next: SiteContent[SectionKey]) => void}
            />
          </div>

          {error && (
            <p role="alert" className="m-0 mb-3 text-[13px] text-[#cb1531]">
              {error}
            </p>
          )}
          <SaveButton busy={busy}>Save {TITLES[section].toLowerCase()} →</SaveButton>
        </form>
      </Modal>
    </>
  );
}

/* ------------------------------------------------------------------ forms */

function Body({
  section,
  draft,
  setDraft,
}: {
  section: SectionKey;
  draft: SiteContent[SectionKey];
  setDraft: (next: SiteContent[SectionKey]) => void;
}) {
  switch (section) {
    case "hero":
      return (
        <HeroForm
          v={draft as SiteContent["hero"]}
          set={setDraft as (n: SiteContent["hero"]) => void}
        />
      );
    case "about":
      return (
        <AboutForm
          v={draft as SiteContent["about"]}
          set={setDraft as (n: SiteContent["about"]) => void}
        />
      );
    case "timeline":
      return (
        <TimelineForm
          v={draft as SiteContent["timeline"]}
          set={setDraft as (n: SiteContent["timeline"]) => void}
        />
      );
    case "journey":
      return (
        <JourneyForm
          v={draft as SiteContent["journey"]}
          set={setDraft as (n: SiteContent["journey"]) => void}
        />
      );
    case "genres":
      return (
        <GenresForm
          v={draft as SiteContent["genres"]}
          set={setDraft as (n: SiteContent["genres"]) => void}
        />
      );
    case "contact":
      return (
        <ContactForm
          v={draft as SiteContent["contact"]}
          set={setDraft as (n: SiteContent["contact"]) => void}
        />
      );
  }
}

function HeroForm({
  v,
  set,
}: {
  v: SiteContent["hero"];
  set: (n: SiteContent["hero"]) => void;
}) {
  return (
    <>
      <Field
        label="Artist name"
        value={v.name}
        onChange={(e) => set({ ...v, name: e.target.value })}
      />
      <Area
        label="Tagline"
        rows={4}
        value={v.tagline}
        onChange={(e) => set({ ...v, tagline: e.target.value })}
      />
      <Field
        label="Button label"
        value={v.cta.label}
        onChange={(e) => set({ ...v, cta: { ...v.cta, label: e.target.value } })}
      />
      <Field
        label="Button link"
        value={v.cta.href}
        onChange={(e) => set({ ...v, cta: { ...v.cta, href: e.target.value } })}
      />
    </>
  );
}

function AboutForm({
  v,
  set,
}: {
  v: SiteContent["about"];
  set: (n: SiteContent["about"]) => void;
}) {
  return (
    <>
      <Field
        label="Heading"
        value={v.headingLead}
        onChange={(e) => set({ ...v, headingLead: e.target.value })}
      />
      <Field
        label="Heading (coloured part)"
        value={v.headingAccent}
        onChange={(e) => set({ ...v, headingAccent: e.target.value })}
      />
      <Area
        label="Bio"
        rows={9}
        value={v.body}
        onChange={(e) => set({ ...v, body: e.target.value })}
      />
    </>
  );
}

function TimelineForm({
  v,
  set,
}: {
  v: SiteContent["timeline"];
  set: (n: SiteContent["timeline"]) => void;
}) {
  const items = v.milestones;
  const put = (next: typeof items) => set({ ...v, milestones: next });

  return (
    <>
      <Field
        label="Heading"
        value={v.headingLead}
        onChange={(e) => set({ ...v, headingLead: e.target.value })}
      />
      <Field
        label="Heading (coloured part)"
        value={v.headingAccent}
        onChange={(e) => set({ ...v, headingAccent: e.target.value })}
      />

      <ListEditor
        label="Milestones"
        items={items}
        onChange={put}
        blank={{ year: "", title: "", desc: "" }}
        addLabel="Add milestone"
        title={(m) => m.title || "Untitled milestone"}
        render={(m, patch) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Year / month"
                value={m.year}
                onChange={(e) => patch({ year: e.target.value })}
              />
              <Field
                label="Sub-label"
                value={m.sub ?? ""}
                onChange={(e) => patch({ sub: e.target.value || undefined })}
              />
            </div>
            <Field
              label="Title"
              value={m.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
            <Area
              label="Description"
              rows={3}
              value={m.desc}
              onChange={(e) => patch({ desc: e.target.value })}
            />
          </>
        )}
      />
    </>
  );
}

function JourneyForm({
  v,
  set,
}: {
  v: SiteContent["journey"];
  set: (n: SiteContent["journey"]) => void;
}) {
  return (
    <>
      <Field
        label="Heading"
        value={v.headingLead}
        onChange={(e) => set({ ...v, headingLead: e.target.value })}
      />
      <Field
        label="Heading (coloured part)"
        value={v.headingAccent}
        onChange={(e) => set({ ...v, headingAccent: e.target.value })}
      />
      <Area
        label="Story"
        hint="one paragraph per blank line"
        rows={8}
        value={v.intro.join("\n\n")}
        onChange={(e) =>
          set({
            ...v,
            intro: e.target.value
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean),
          })
        }
      />

      <ListEditor
        label="Gigs & gallery"
        items={v.gigs}
        onChange={(next) => set({ ...v, gigs: next })}
        blank={{ month: "", year: "", name: "", detail: "" }}
        addLabel="Add gig"
        title={(g) => g.name || "Untitled gig"}
        render={(g, patch) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Month"
                value={g.month}
                onChange={(e) => patch({ month: e.target.value })}
              />
              <Field
                label="Year"
                value={g.year}
                onChange={(e) => patch({ year: e.target.value })}
              />
            </div>
            <Field
              label="Place"
              value={g.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
            <Field
              label="Description"
              value={g.detail}
              onChange={(e) => patch({ detail: e.target.value })}
            />
            <MediaInput
              label="Photo or video"
              value={g.media?.src}
              onChange={(next) =>
                patch({
                  media: next
                    ? {
                        src: next.url,
                        kind: next.isVideo ? "video" : "photo",
                        tone: g.media?.tone ?? "light",
                      }
                    : undefined,
                })
              }
            />
            {g.media && (
              <label className="mb-4 block">
                <span className="admin-label">Caption colour</span>
                <select
                  className="admin-input"
                  value={g.media.tone ?? "light"}
                  onChange={(e) =>
                    patch({
                      media: {
                        ...g.media!,
                        tone: e.target.value as "light" | "dark",
                      },
                    })
                  }
                >
                  <option value="light">White — for a dark photo</option>
                  <option value="dark">Black — for a bright photo</option>
                </select>
              </label>
            )}
          </>
        )}
      />
    </>
  );
}

function GenresForm({
  v,
  set,
}: {
  v: SiteContent["genres"];
  set: (n: SiteContent["genres"]) => void;
}) {
  return (
    <>
      <Field
        label="Centre label"
        value={v.open}
        onChange={(e) => set({ ...v, open: e.target.value })}
      />
      <ListEditor
        label="Genres"
        items={v.primary}
        onChange={(next) => set({ ...v, primary: next })}
        blank={{ name: "" }}
        addLabel="Add genre"
        title={(g) => g.name || "Untitled genre"}
        render={(g, patch) => (
          <>
            <Field
              label="Name"
              value={g.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
            <MediaInput
              label="Record sleeve"
              kind="photo"
              value={g.cover}
              onChange={(next) => patch({ cover: next?.url })}
            />
          </>
        )}
      />
    </>
  );
}

function ContactForm({
  v,
  set,
}: {
  v: SiteContent["contact"];
  set: (n: SiteContent["contact"]) => void;
}) {
  return (
    <>
      <Field
        label="Heading"
        value={v.headingLead}
        onChange={(e) => set({ ...v, headingLead: e.target.value })}
      />
      <Field
        label="Heading (coloured part)"
        value={v.headingAccent}
        onChange={(e) => set({ ...v, headingAccent: e.target.value })}
      />
      <Area
        label="Blurb"
        rows={3}
        value={v.blurb}
        onChange={(e) => set({ ...v, blurb: e.target.value })}
      />
      <Field
        label="Email"
        type="email"
        value={v.email}
        onChange={(e) => set({ ...v, email: e.target.value })}
      />
      <Field
        label="Phone"
        value={v.phoneDisplay}
        onChange={(e) =>
          set({
            ...v,
            phoneDisplay: e.target.value,
            // Keep the tel: link in step with what's displayed, so editing the
            // number in one place can't leave the link dialling the old one.
            phoneHref: `tel:${e.target.value.replace(/[^\d+]/g, "")}`,
          })
        }
      />
      <Field
        label="Instagram handle"
        value={v.instagram.handle}
        onChange={(e) =>
          set({ ...v, instagram: { ...v.instagram, handle: e.target.value } })
        }
      />
      <Field
        label="Instagram link"
        value={v.instagram.href}
        onChange={(e) =>
          set({ ...v, instagram: { ...v.instagram, href: e.target.value } })
        }
      />

      <p className="m-0 mb-3 mt-6 text-[12px] text-[#000500]/55">
        Clear both fields of a channel below to take its card off the page.
      </p>

      <Field
        label="Manager Instagram handle"
        value={v.managerInstagram?.handle ?? ""}
        onChange={(e) =>
          set({
            ...v,
            managerInstagram: {
              href: v.managerInstagram?.href ?? "",
              handle: e.target.value,
            },
          })
        }
      />
      <Field
        label="Manager Instagram link"
        value={v.managerInstagram?.href ?? ""}
        onChange={(e) =>
          set({
            ...v,
            managerInstagram: {
              handle: v.managerInstagram?.handle ?? "",
              href: e.target.value,
            },
          })
        }
      />
      <Field
        label="WhatsApp number"
        value={v.whatsapp?.display ?? ""}
        onChange={(e) =>
          set({
            ...v,
            whatsapp: {
              display: e.target.value,
              // wa.me takes the bare number, so the link is derived rather
              // than typed — one less thing to get wrong.
              href: `https://wa.me/${e.target.value.replace(/\D/g, "")}`,
            },
          })
        }
      />

      <Field
        label="Location"
        value={v.location}
        onChange={(e) => set({ ...v, location: e.target.value })}
      />
    </>
  );
}

/* ------------------------------------------------------------ list editor */

/**
 * Add / edit / reorder / delete for the three sections that are lists. Rows
 * collapse to their title so a long list stays navigable, and only the open
 * row renders its fields.
 */
function ListEditor<T>({
  label,
  items,
  onChange,
  blank,
  addLabel,
  title,
  render,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  blank: T;
  addLabel: string;
  title: (item: T) => string;
  render: (item: T, patch: (fields: Partial<T>) => void) => React.ReactNode;
}) {
  const [openRow, setOpenRow] = useState<number | null>(null);

  const patchAt = (i: number, fields: Partial<T>) =>
    onChange(items.map((it, n) => (n === i ? { ...it, ...fields } : it)));

  const move = (i: number, by: number) => {
    const to = i + by;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
    setOpenRow(to);
  };

  return (
    <div className="mb-4">
      <span className="admin-label">{label}</span>

      <div className="mt-1 flex flex-col gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-[#000500]/12"
          >
            <div className="flex items-center gap-1 bg-[#000500]/3 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setOpenRow(openRow === i ? null : i)}
                className="flex-1 truncate px-1 text-left text-[13px] font-semibold text-[#000500]"
              >
                {title(item)}
              </button>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="admin-icon"
              >
                <ChevronUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label="Move down"
                className="admin-icon"
              >
                <ChevronDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(items.filter((_, n) => n !== i));
                  setOpenRow(null);
                }}
                aria-label={`Delete ${title(item)}`}
                className="admin-icon text-[#cb1531]"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            {openRow === i && (
              <div className="border-t border-[#000500]/10 p-3 pb-0">
                {render(item, (fields) => patchAt(i, fields))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          onChange([...items, blank]);
          setOpenRow(items.length);
        }}
        className="admin-ghost mt-2 w-full"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
