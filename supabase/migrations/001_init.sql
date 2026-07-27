-- Tihom portfolio — content store + media bucket.
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New
-- query → paste → Run). It is idempotent, so re-running it is harmless.
--
-- Shape: the whole site is a single JSON document in a single row. The page
-- renders that tree directly and the admin panel edits it in place, so there
-- is no mapping layer between the database and the UI to keep in step. Gigs
-- and genres are arrays inside the document rather than their own tables —
-- they are only ever read as part of the page, never queried across.

-- ---------------------------------------------------------------- content --

create table if not exists public.site_content (
  id          text primary key,
  doc         jsonb       not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid        references auth.users (id)
);

alter table public.site_content enable row level security;

-- Anyone may read: this is the public website's content.
drop policy if exists "site_content is world readable" on public.site_content;
create policy "site_content is world readable"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Only a signed-in user may write. There is exactly one account, created by
-- hand in the dashboard, and signup is disabled — so "authenticated" is the
-- artist and nobody else.
drop policy if exists "only signed-in admins may write" on public.site_content;
create policy "only signed-in admins may write"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

-- Stamp the row on every write so the admin panel can show "last saved".
create or replace function public.touch_site_content()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before insert or update on public.site_content
  for each row execute function public.touch_site_content();

-- ------------------------------------------------------------------ media --

-- Public read so <img>/<video> can load without a signed URL; writes are
-- restricted to the signed-in admin.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media is world readable" on storage.objects;
create policy "media is world readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "admins may upload media" on storage.objects;
create policy "admins may upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "admins may replace media" on storage.objects;
create policy "admins may replace media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

drop policy if exists "admins may delete media" on storage.objects;
create policy "admins may delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
