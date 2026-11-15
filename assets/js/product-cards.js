/* ============================================================================
   ARQUIVO: assets/js/product-cards.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Desenha os cards de produto na grade do catálogo
   DEPENDE DE: svg-icons.js
   O QUE VOCÊ PODE MUDAR AQUI: O visual de cada card (classes Tailwind) e quais dados aparecem
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 7] DESENHO DOS CARDS DE PRODUTOS NA TELA
           Transforma a lista filtrada em cards visuais prontos para clique.
        ------------------------------------------------------------------------- */
        function renderProductsGrid(products) {
            const grid = document.getElementById('productsGrid');
            const emptyState = document.getElementById('emptyState');
            const counter = document.getElementById('resultsCounter');

            counter.textContent = `Exibindo ${products.length} ${products.length === 1 ? 'item técnico' : 'itens técnicos'} disponíveis para cotação`;

            // Se não houver nenhum produto correspondente, exibe a mensagem de vazio
            if (products.length === 0) {
                grid.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            grid.innerHTML = products.map(product => `
                <article class="bg-white rounded-xl border border-slate-200 hover:border-industrial-amber shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group">
                    <!-- Cabeçalho do Card: Código SKU e Etiqueta de Material -->
                    <div class="px-3 pt-3 flex items-center justify-between gap-1">
                        <span class="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">${product.sku}</span>
                        <span class="text-[10px] font-bold uppercase tracking-tight text-navy-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded truncate max-w-[110px]">
                            ${product.material}
                        </span>
                    </div>

                    <!-- Corpo Clicável: Abre a Ficha Técnica (Modal) -->
                    <div onclick="openProductModal(${product.id})" class="p-3 sm:p-4 flex-1 flex flex-col cursor-pointer">
                        <div class="h-28 sm:h-32 rounded-lg bg-industrial-bg/80 group-hover:bg-amber-50/40 transition-colors flex items-center justify-center mb-3 relative">
                            ${getProductVisual(product, "w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-105 transition-transform", "w-full h-full object-contain p-2 group-hover:scale-105 transition-transform")}
                            <span class="absolute bottom-2 right-2 text-[10px] font-semibold text-navy-900 bg-white/90 px-2 py-0.5 rounded shadow-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <i class="fa-solid fa-eye text-industrial-amber mr-1"></i>Ficha
                            </span>
                        </div>

                        <span class="text-[11px] font-semibold text-slate-400">${product.category}</span>
                        <h3 class="font-bold text-navy-900 text-xs sm:text-sm leading-snug mt-0.5 line-clamp-2 group-hover:text-navy-700">
                            ${product.name}
                        </h3>

                        <!-- Resumo Técnico: Medida e Norma -->
                        <div class="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-slate-400">Medida:</span>
                                <span class="font-mono font-semibold text-slate-800 truncate">${product.gauge}</span>
                            </div>
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-slate-400">Norma:</span>
                                <span class="font-mono text-slate-700 truncate">${product.norm}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Rodapé do Card: Botão para adicionar direto na lista de cotação -->
                    <div class="p-3 pt-0 mt-auto">
                        <button onclick="addToQuote(${product.id}, 1)" class="w-full bg-navy-900 hover:bg-industrial-amber text-white hover:text-navy-950 font-bold py-2.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs">
                            <i class="fa-solid fa-plus"></i>
                            <span>Adicionar ao Orçamento</span>
                        </button>
                    </div>
                </article>
            `).join('');
        }

