/* ============================================================================
   ARQUIVO: assets/js/state.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Memória temporária do site: busca, filtros marcados e itens do orçamento
   DEPENDE DE: products-data.js
   O QUE VOCÊ PODE MUDAR AQUI: Ordenação inicial e valores de partida dos filtros
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 3] MEMÓRIA TEMPORÁRIA DO SITE (ESTADO / STATE)
           Guarda tudo o que o usuário está fazendo no momento: texto digitado na
           busca, caixinhas marcadas nos filtros e itens dentro da lista de orçamento.
        ------------------------------------------------------------------------- */
        let state = {
            searchQuery: "",            // Texto digitado na barra de pesquisa
            selectedCategories: [],     // Lista de categorias marcadas (ex: ['Fixadores'])
            selectedMaterials: [],      // Lista de materiais marcados (ex: ['Aço Inox 304'])
            selectedApplications: [],   // Lista de aplicações marcadas
            sortBy: "featured",         // Ordem escolhida no menu suspenso
            quoteList: []
        };

