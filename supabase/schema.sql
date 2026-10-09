create table if not exists public.characters (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  id         text        not null check (char_length(id) between 1 and 64),
  data       jsonb       not null default '{}'::jsonb check (pg_column_size(data) <= 262144),
  deleted    boolean     not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.characters enable row level security;

revoke all on table public.characters from anon, public;
grant select, insert, update, delete on table public.characters to authenticated;

drop policy if exists "Read own characters"   on public.characters;
drop policy if exists "Add own characters"    on public.characters;
drop policy if exists "Update own characters" on public.characters;
drop policy if exists "Delete own characters" on public.characters;

create policy "Read own characters" on public.characters
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add own characters" on public.characters
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own characters" on public.characters
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own characters" on public.characters
  for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.enforce_character_limit()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.characters c where c.user_id = new.user_id and c.id = new.id)
     and (select count(*) from public.characters c where c.user_id = new.user_id) >= 1000 then
    raise exception 'Character limit reached';
  end if;
  return new;
end;
$$;
revoke all on function public.enforce_character_limit() from public, anon, authenticated;
drop trigger if exists characters_limit on public.characters;
create trigger characters_limit before insert on public.characters
  for each row execute function public.enforce_character_limit();

create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  delete from public.characters where user_id = uid;
  delete from auth.users where id = uid;
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
