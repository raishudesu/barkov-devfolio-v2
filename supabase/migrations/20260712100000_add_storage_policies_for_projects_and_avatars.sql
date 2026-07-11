-- Add RLS policies for project-images bucket
create policy "Public read project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Auth upload project-images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Auth delete project-images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- Add RLS policies for avatars bucket
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Auth upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Auth delete avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');
