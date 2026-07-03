create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  header_image text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  description text,
  created_at timestamptz default now()
);

alter table public.blogs enable row level security;
alter table public.gallery enable row level security;

create policy "Public read published blogs"
  on public.blogs for select
  using (published = true);

create policy "Public read gallery"
  on public.gallery for select
  using (true);

create policy "Auth read all blogs"
  on public.blogs for select
  using (auth.role() = 'authenticated');

create policy "Auth insert blogs"
  on public.blogs for insert
  with check (auth.role() = 'authenticated');

create policy "Auth update blogs"
  on public.blogs for update
  using (auth.role() = 'authenticated');

create policy "Auth delete blogs"
  on public.blogs for delete
  using (auth.role() = 'authenticated');

create policy "Auth read all gallery"
  on public.gallery for select
  using (auth.role() = 'authenticated');

create policy "Auth insert gallery"
  on public.gallery for insert
  with check (auth.role() = 'authenticated');

create policy "Auth update gallery"
  on public.gallery for update
  using (auth.role() = 'authenticated');

create policy "Auth delete gallery"
  on public.gallery for delete
  using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('blog-headers', 'blog-headers', true);

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true);

create policy "Public read blog-headers"
  on storage.objects for select
  using (bucket_id = 'blog-headers');

create policy "Public read gallery-images"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

create policy "Auth upload blog-headers"
  on storage.objects for insert
  with check (bucket_id = 'blog-headers' and auth.role() = 'authenticated');

create policy "Auth upload gallery-images"
  on storage.objects for insert
  with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');

create policy "Auth delete blog-headers"
  on storage.objects for delete
  using (bucket_id = 'blog-headers' and auth.role() = 'authenticated');

create policy "Auth delete gallery-images"
  on storage.objects for delete
  using (bucket_id = 'gallery-images' and auth.role() = 'authenticated');
