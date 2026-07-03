create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.inquiries enable row level security;

create policy "Anyone can submit inquiries"
  on public.inquiries for insert
  with check (true);

create policy "Auth read inquiries"
  on public.inquiries for select
  using (auth.role() = 'authenticated');

create policy "Auth delete inquiries"
  on public.inquiries for delete
  using (auth.role() = 'authenticated');
