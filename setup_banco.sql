-- =====================================================================
-- MILFIX - Estrutura do banco. Cole TUDO no Supabase: SQL Editor > New query > Run
-- =====================================================================
create table if not exists products (
  id bigint generated always as identity primary key,
  sku text unique not null,
  name text not null,
  category text not null,
  material text, application text, norm text, gauge text, packaging text, description text,
  svg_type text default 'bolt',
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists quotes (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  document text not null,   -- CPF/CNPJ apenas números
  phone text not null,
  email text, city text, notes text,
  items jsonb not null,
  status text default 'novo'
);

alter table products enable row level security;
alter table quotes enable row level security;

-- Visitantes: só veem produtos ativos e só conseguem CRIAR orçamentos (nunca ler)
create policy "publico le produtos ativos" on products for select using (active = true);
create policy "publico cria orcamento" on quotes for insert to anon, authenticated with check (true);

-- Administrador logado: acesso total
create policy "admin produtos" on products for all to authenticated using (true) with check (true);
create policy "admin le orcamentos" on quotes for select to authenticated using (true);
create policy "admin atualiza orcamentos" on quotes for update to authenticated using (true);
create policy "admin apaga orcamentos" on quotes for delete to authenticated using (true);

-- Produtos iniciais (os 12 do catálogo atual)
insert into products (sku,name,category,material,application,norm,gauge,packaging,description,svg_type) values
('MFX-1042','Parafuso Sextavado Rosca Inteira M10 x 40mm','Fixadores','Aço Inox 304','Estruturas e Máquinas','DIN 933 / ISO 4017','M10 x 40mm (Passo 1,50)','Caixa com 100 unidades','Parafuso sextavado de rosca total fabricado em Aço Inoxidável AISI 304 (A2), ideal para montagem de equipamentos industriais e ambientes sujeitos à umidade.','bolt'),
('MFX-1088','Barra Roscada 1 Metro 3/8" UNC','Fixadores','Zincado Branco','Instalações e Montagem','DIN 975 / ASTM A307','3/8" - 16 FPP (1000mm)','Feixe com 10 barras','Barra roscada em aço baixo carbono com acabamento zincado eletrolítico branco. Amplamente utilizada em tirantes, eletrocalhas e tubulações industriais.','rod'),
('MFX-1120','Porca Sextavada Autotravante Nylon M12','Fixadores','Zincado Branco','Estruturas e Máquinas','DIN 985','M12 (Passo 1,75)','Caixa com 100 unidades','Porca sextavada com anel inserto em poliamida (nylon) que impede o afrouxamento por vibração mecânica contínua.','nut'),
('MFX-1195','Chumbador Parabolt Mecânico 1/2" x 4"','Fixadores','Aço Carbono','Construção Pesada','Padrão Industrial','1/2" x 101mm','Caixa com 25 unidades','Chumbador de expansão controlada por torque para fixação pesada em concreto estrutural, bases de máquinas e guarda-corpos.','anchor'),
('MFX-2015','Disco de Corte Fino 4.1/2" x 1,0mm Inox','Abrasivos e Corte','Óxido de Alumínio','Corte e Desbaste','EN 12413 (13.300 RPM)','115 x 1,0 x 22,23mm','Caixa com 25 discos','Disco de corte extrafino com dupla tela de fibra de vidro. Livre de ferro, enxofre e cloro, garantindo corte rápido e sem queima em aço inox e carbono.','disc'),
('MFX-2044','Disco Flap Angular Grão 60 4.1/2"','Abrasivos e Corte','Óxido de Alumínio','Corte e Desbaste','ABNT NBR 15230','115 x 22,23mm (Grão 60)','Pacote com 10 discos','Disco flap com costado de fibra e lixas de óxido de alumínio zirconado para desbaste de cordão de solda e acabamento simultâneo.','disc'),
('MFX-2090','Disco de Desbaste 7" x 1/4" Metal','Abrasivos e Corte','Óxido de Alumínio','Construção Pesada','EN 12413 (8.500 RPM)','180 x 6,4 x 22,23mm','Caixa com 10 discos','Disco de desbaste reforçado para operações severas em caldeiraria pesada, remoção de rebarbas e preparação de chanfros.','disc'),
('MFX-3010','Eletrodo Revestido E6013 3,25mm','Solda','Aço Carbono','Soldagem Industrial','AWS A5.1 E6013','3,25mm x 350mm','Lata 5kg / Caixa 20kg','Eletrodo rutílico de uso geral para soldagem em todas as posições, excelente abertura de arco, baixo índice de respingos e fácil remoção de escória.','weld'),
('MFX-3055','Arame de Solda MIG ER70S-6 1,0mm','Solda','Aço Carbono','Soldagem Industrial','AWS A5.18 ER70S-6','Ø 1,0mm (Rolo 15kg)','Carretel Plástico 15kg','Arame sólido cobreado com alto teor de manganês e silício para soldagem MIG/MAG de chapas e perfis estruturais com acabamento limpo.','weld'),
('MFX-4012','Óculos de Proteção Ampla Visão Antiembaçante','EPIs','Policarbonato','Segurança do Trabalho','CA 35.120 / ANSI Z87.1','Tamanho Único Ajustável','Unidade individual','Óculos de segurança ampla visão com ventilação indireta, lente em policarbonato incolor antirrisco e vedação macia contra partículas volantes.','epi'),
('MFX-4078','Luva de Segurança Tricotada Pigmentada','EPIs','Algodão / Poliéster','Segurança do Trabalho','CA 28.940 / EN 388','Tamanho 9 (G)','Pacote com 12 pares','Luva tricotada em 4 fios com pigmentos antiderrapantes em PVC na palma para manuseio seguro de peças mecânicas e ferramentas.','epi'),
('MFX-5021','Chave Combinada 17mm Cromo Vanádio','Ferramentas Manuais','Aço Cromo Vanádio','Instalações e Montagem','DIN 3113','Boca / Estrela 17mm','Unidade individual','Chave combinada forjada em aço cromo vanádio com acabamento acetinado, cabeça estrela com inclinação de 15° para maior torque.','wrench')
on conflict (sku) do nothing;
