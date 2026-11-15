-- =====================================================================
-- MILFIX - ATUALIZAÇÃO: FOTOS DOS PRODUTOS (15/11/2026)
-- Cole TUDO no Supabase: SQL Editor > New query > Run. Pode rodar mais de uma vez sem problema.
-- =====================================================================
alter table products add column if not exists image_url text;

-- Pasta pública de fotos (qualquer visitante pode VER as fotos)
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Só o administrador logado pode ENVIAR, trocar ou apagar fotos
drop policy if exists "admin envia fotos" on storage.objects;
drop policy if exists "admin troca fotos" on storage.objects;
drop policy if exists "admin apaga fotos" on storage.objects;
create policy "admin envia fotos" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "admin troca fotos" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "admin apaga fotos" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
