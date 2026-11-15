/* ============================================================================
   ARQUIVO: assets/js/main.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Ponto de partida: roda quando a página termina de carregar
   DEPENDE DE: todos os arquivos anteriores
   O QUE VOCÊ PODE MUDAR AQUI: Normalmente nada
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 11] INICIALIZAÇÃO AUTOMÁTICA DO SITE
           Assim que o navegador termina de carregar o HTML, estas 3 funções
           constroem os filtros, exibem os produtos e atualizam o carrinho.
        ------------------------------------------------------------------------- */
        window.addEventListener('DOMContentLoaded', async () => {
            await loadProducts();
            renderFilterControls();
            applyFilters();
            updateQuoteUI();
        });
