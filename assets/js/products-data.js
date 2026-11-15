/* ============================================================================
   ARQUIVO: assets/js/products-data.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Lista de produtos de RESERVA + carregamento dos produtos reais do banco (Supabase)
   DEPENDE DE: config.js
   O QUE VOCÊ PODE MUDAR AQUI: Os produtos reais agora são editados no painel (admin.html). A lista abaixo só aparece se o banco estiver fora do ar ou sem configuração; os comentários do PASSO 2 sobre "adicionar produto aqui" valem só para essa lista de reserva.
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 2] BANCO DE DADOS DE PRODUTOS (CATÁLOGO)
           Para adicionar um produto novo, basta copiar um bloco entre chaves { ... },
           colar no final da lista (antes do colchete ']'), mudar o 'id' e preencher
           os dados. Os filtros laterais se atualizam sozinhos!
           
           Tipos de ícones disponíveis para 'svgType':
           "bolt" (parafuso), "rod" (barra roscada), "nut" (porca), "anchor" (chumbador),
           "disc" (disco de corte/desbaste), "weld" (solda), "epi" (capacete/EPI), "wrench" (chave)
        ------------------------------------------------------------------------- */
        // Lista local = reserva caso o banco não esteja configurado ou fique fora do ar
        let productsDatabase = [
            {
                id: 1,                                                  // Número único do produto
                sku: "MFX-1042",                                        // Código interno da peça
                name: "Parafuso Sextavado Rosca Inteira M10 x 40mm",    // Nome técnico exibido no card
                category: "Fixadores",                                  // Categoria (vira filtro automático)
                material: "Aço Inox 304",                               // Material/Acabamento (vira filtro automático)
                application: "Estruturas e Máquinas",                   // Aplicação (vira filtro automático)
                norm: "DIN 933 / ISO 4017",                             // Norma técnica
                gauge: "M10 x 40mm (Passo 1,50)",                       // Medida / Bitola
                packaging: "Caixa com 100 unidades",                    // Quantidade por embalagem
                description: "Parafuso sextavado de rosca total fabricado em Aço Inoxidável AISI 304 (A2), ideal para montagem de equipamentos industriais e ambientes sujeitos à umidade.",
                svgType: "bolt"                                         // Desenho técnico exibido no card
            },
            {
                id: 2,
                sku: "MFX-1088",
                name: "Barra Roscada 1 Metro 3/8\" UNC",
                category: "Fixadores",
                material: "Zincado Branco",
                application: "Instalações e Montagem",
                norm: "DIN 975 / ASTM A307",
                gauge: "3/8\" - 16 FPP (1000mm)",
                packaging: "Feixe com 10 barras",
                description: "Barra roscada em aço baixo carbono com acabamento zincado eletrolítico branco. Amplamente utilizada em tirantes, eletrocalhas e tubulações industriais.",
                svgType: "rod"
            },
            {
                id: 3,
                sku: "MFX-1120",
                name: "Porca Sextavada Autotravante Nylon M12",
                category: "Fixadores",
                material: "Zincado Branco",
                application: "Estruturas e Máquinas",
                norm: "DIN 985",
                gauge: "M12 (Passo 1,75)",
                packaging: "Caixa com 100 unidades",
                description: "Porca sextavada com anel inserto em poliamida (nylon) que impede o afrouxamento por vibração mecânica contínua.",
                svgType: "nut"
            },
            {
                id: 4,
                sku: "MFX-1195",
                name: "Chumbador Parabolt Mecânico 1/2\" x 4\"",
                category: "Fixadores",
                material: "Aço Carbono",
                application: "Construção Pesada",
                norm: "Padrão Industrial",
                gauge: "1/2\" x 101mm",
                packaging: "Caixa com 25 unidades",
                description: "Chumbador de expansão controlada por torque para fixação pesada em concreto estrutural, bases de máquinas e guarda-corpos.",
                svgType: "anchor"
            },
            {
                id: 5,
                sku: "MFX-2015",
                name: "Disco de Corte Fino 4.1/2\" x 1,0mm Inox",
                category: "Abrasivos e Corte",
                material: "Óxido de Alumínio",
                application: "Corte e Desbaste",
                norm: "EN 12413 (13.300 RPM)",
                gauge: "115 x 1,0 x 22,23mm",
                packaging: "Caixa com 25 discos",
                description: "Disco de corte extrafino com dupla tela de fibra de vidro. Livre de ferro, enxofre e cloro, garantindo corte rápido e sem queima em aço inox e carbono.",
                svgType: "disc"
            },
            {
                id: 6,
                sku: "MFX-2044",
                name: "Disco Flap Angular Grão 60 4.1/2\"",
                category: "Abrasivos e Corte",
                material: "Óxido de Alumínio",
                application: "Corte e Desbaste",
                norm: "ABNT NBR 15230",
                gauge: "115 x 22,23mm (Grão 60)",
                packaging: "Pacote com 10 discos",
                description: "Disco flap com costado de fibra e lixas de óxido de alumínio zirconado para desbaste de cordão de solda e acabamento simultâneo.",
                svgType: "disc"
            },
            {
                id: 7,
                sku: "MFX-2090",
                name: "Disco de Desbaste 7\" x 1/4\" Metal",
                category: "Abrasivos e Corte",
                material: "Óxido de Alumínio",
                application: "Construção Pesada",
                norm: "EN 12413 (8.500 RPM)",
                gauge: "180 x 6,4 x 22,23mm",
                packaging: "Caixa com 10 discos",
                description: "Disco de desbaste reforçado para operações severas em caldeiraria pesada, remoção de rebarbas e preparação de chanfros.",
                svgType: "disc"
            },
            {
                id: 8,
                sku: "MFX-3010",
                name: "Eletrodo Revestido E6013 3,25mm",
                category: "Solda",
                material: "Aço Carbono",
                application: "Soldagem Industrial",
                norm: "AWS A5.1 E6013",
                gauge: "3,25mm x 350mm",
                packaging: "Lata 5kg / Caixa 20kg",
                description: "Eletrodo rutílico de uso geral para soldagem em todas as posições, excelente abertura de arco, baixo índice de respingos e fácil remoção de escória.",
                svgType: "weld"
            },
            {
                id: 9,
                sku: "MFX-3055",
                name: "Arame de Solda MIG ER70S-6 1,0mm",
                category: "Solda",
                material: "Aço Carbono",
                application: "Soldagem Industrial",
                norm: "AWS A5.18 ER70S-6",
                gauge: "Ø 1,0mm (Rolo 15kg)",
                packaging: "Carretel Plástico 15kg",
                description: "Arame sólido cobreado com alto teor de manganês e silício para soldagem MIG/MAG de chapas e perfis estruturais com acabamento limpo.",
                svgType: "weld"
            },
            {
                id: 10,
                sku: "MFX-4012",
                name: "Óculos de Proteção Ampla Visão Antiembaçante",
                category: "EPIs",
                material: "Policarbonato",
                application: "Segurança do Trabalho",
                norm: "CA 35.120 / ANSI Z87.1",
                gauge: "Tamanho Único Ajustável",
                packaging: "Unidade individual",
                description: "Óculos de segurança ampla visão com ventilação indireta, lente em policarbonato incolor antirrisco e vedação macia contra partículas volantes.",
                svgType: "epi"
            },
            {
                id: 11,
                sku: "MFX-4078",
                name: "Luva de Segurança Tricotada Pigmentada",
                category: "EPIs",
                material: "Algodão / Poliéster",
                application: "Segurança do Trabalho",
                norm: "CA 28.940 / EN 388",
                gauge: "Tamanho 9 (G)",
                packaging: "Pacote com 12 pares",
                description: "Luva tricotada em 4 fios com pigmentos antiderrapantes em PVC na palma para manuseio seguro de peças mecânicas e ferramentas.",
                svgType: "epi"
            },
            {
                id: 12,
                sku: "MFX-5021",
                name: "Chave Combinada 17mm Cromo Vanádio",
                category: "Ferramentas Manuais",
                material: "Aço Cromo Vanádio",
                application: "Instalações e Montagem",
                norm: "DIN 3113",
                gauge: "Boca / Estrela 17mm",
                packaging: "Unidade individual",
                description: "Chave combinada forjada em aço cromo vanádio com acabamento acetinado, cabeça estrela com inclinação de 15° para maior torque.",
                svgType: "wrench"
            }
        ];


        /* Busca os produtos ATIVOS do banco e substitui a lista de reserva acima */
        async function loadProducts() {
            if (!db) return;
            try {
                const { data, error } = await db.from('products').select('*').eq('active', true).order('id');
                if (error || !data || !data.length) return;
                productsDatabase = data.map(p => ({ ...p, svgType: p.svg_type || 'bolt', material: p.material || '', application: p.application || '', norm: p.norm || '', gauge: p.gauge || '', packaging: p.packaging || '', description: p.description || '' }));
            } catch (e) { console.error(e); }
        }

