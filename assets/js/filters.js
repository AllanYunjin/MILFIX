/* ============================================================================
   ARQUIVO: assets/js/filters.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Filtros laterais, busca, limpeza e ordenação (PASSOS 5 e 6)
   DEPENDE DE: products-data.js, state.js, product-cards.js
   O QUE VOCÊ PODE MUDAR AQUI: Campos pesquisados na busca e opções de ordenação
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 5] CONSTRUÇÃO AUTOMÁTICA DOS FILTROS (DESKTOP E CELULAR)
           Lê todos os produtos cadastrados no 'productsDatabase', extrai as
           categorias, materiais e aplicações únicas e cria as caixinhas (checkbox).
        ------------------------------------------------------------------------- */
        function renderFilterControls() {
            // 'new Set(...)' elimina repetições para criar uma lista limpa de opções
            const categories = [...new Set(productsDatabase.map(p => p.category))];
            const materials = [...new Set(productsDatabase.map(p => p.material))];
            const applications = [...new Set(productsDatabase.map(p => p.application))];

            // Função auxiliar que monta o HTML de cada grupo de filtro
            const buildGroup = (title, items, filterType) => `
                <div>
                    <h4 class="text-xs font-extrabold uppercase tracking-wider text-navy-900 mb-2.5">${title}</h4>
                    <div class="space-y-2">
                        ${items.map(item => {
                            // Verifica se esta opção já está marcada na memória (state)
                            const isChecked = (
                                (filterType === 'category' && state.selectedCategories.includes(item)) ||
                                (filterType === 'material' && state.selectedMaterials.includes(item)) ||
                                (filterType === 'application' && state.selectedApplications.includes(item))
                            );
                            // Conta quantos produtos existem com essa característica
                            const count = productsDatabase.filter(p => p[filterType] === item).length;
                            
                            return `
                                <label class="flex items-center justify-between cursor-pointer group py-0.5">
                                    <span class="flex items-center gap-2.5">
                                        <input type="checkbox" 
                                            ${isChecked ? 'checked' : ''} 
                                            onchange="toggleFilter('${filterType}', '${item}')"
                                            class="w-4 h-4 rounded border-slate-300 text-navy-900 focus:ring-industrial-amber cursor-pointer">
                                        <span class="text-sm text-slate-700 group-hover:text-navy-900 font-medium">${item}</span>
                                    </span>
                                    <span class="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">${count}</span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            const html = `
                ${buildGroup('Categoria Industrial', categories, 'category')}
                <div class="border-t border-slate-100 pt-4">
                    ${buildGroup('Material / Acabamento', materials, 'material')}
                </div>
                <div class="border-t border-slate-100 pt-4">
                    ${buildGroup('Aplicação Técnica', applications, 'application')}
                </div>
            `;

            // Injeta os mesmos filtros tanto na barra lateral do PC quanto na gaveta do Celular
            document.getElementById('desktopFiltersContainer').innerHTML = html;
            document.getElementById('mobileFiltersContainer').innerHTML = html;
        }

        /* -------------------------------------------------------------------------
           [PASSO 6] FUNÇÕES DE BUSCA, SELEÇÃO E LIMPEZA DE FILTROS
        ------------------------------------------------------------------------- */

        // Marca ou desmarca uma opção de filtro quando o usuário clica no checkbox
        function toggleFilter(type, value) {
            const targetArray = type === 'category' 
                ? state.selectedCategories 
                : type === 'material' 
                    ? state.selectedMaterials 
                    : state.selectedApplications;

            const idx = targetArray.indexOf(value);
            if (idx > -1) {
                targetArray.splice(idx, 1); // Se já estava marcado, remove
            } else {
                targetArray.push(value);    // Se não estava marcado, adiciona
            }
            renderFilterControls();
            applyFilters();
        }

        // Captura o que o usuário digita na barra de busca (PC ou Celular)
        function handleSearch(query) {
            state.searchQuery = query.trim().toLowerCase();
            
            // Mantém os campos de busca do PC e do Celular sempre sincronizados
            document.getElementById('desktopSearchInput').value = query;
            document.getElementById('mobileSearchInput').value = query;
            
            // Mostra ou esconde o botão 'X' de limpar pesquisa
            const clearBtn = document.getElementById('clearSearchDesktop');
            if (query.length > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }
            applyFilters();
        }

        // Limpa apenas o texto da barra de busca
        function clearSearch() {
            handleSearch('');
        }

        // Filtra o catálogo ao clicar em uma categoria no menu superior ou nos cards de atalho
        function selectCategoryFromNav(category) {
            if (category === 'Todos') {
                state.selectedCategories = [];
            } else {
                state.selectedCategories = [category];
            }
            renderFilterControls();
            applyFilters();
            scrollToCatalog();
        }

        // Faz o mesmo no celular, mas fecha o menu lateral antes de rolar até os produtos
        function selectCategoryFromMobile(category) {
            toggleMobileMenu();
            selectCategoryFromNav(category);
        }

        // Reseta todos os filtros e busca para o estado inicial
        function resetAllFilters(event) {
            if (event) event.preventDefault();
            state.searchQuery = "";
            state.selectedCategories = [];
            state.selectedMaterials = [];
            state.selectedApplications = [];
            document.getElementById('desktopSearchInput').value = "";
            document.getElementById('mobileSearchInput').value = "";
            document.getElementById('clearSearchDesktop').classList.add('hidden');
            renderFilterControls();
            applyFilters();
        }

        // Cruza todos os filtros + texto de busca + ordenação e atualiza a vitrine
        function applyFilters() {
            state.sortBy = document.getElementById('sortSelect').value;

            let filtered = productsDatabase.filter(product => {
                // 1. Verifica se o texto digitado bate com Nome, SKU, Material, Norma ou Medida
                const matchesSearch = !state.searchQuery || 
                    product.name.toLowerCase().includes(state.searchQuery) ||
                    product.sku.toLowerCase().includes(state.searchQuery) ||
                    product.material.toLowerCase().includes(state.searchQuery) ||
                    product.norm.toLowerCase().includes(state.searchQuery) ||
                    product.gauge.toLowerCase().includes(state.searchQuery);

                // 2. Verifica se bate com as categorias, materiais e aplicações selecionadas
                const matchesCategory = state.selectedCategories.length === 0 || state.selectedCategories.includes(product.category);
                const matchesMaterial = state.selectedMaterials.length === 0 || state.selectedMaterials.includes(product.material);
                const matchesApp = state.selectedApplications.length === 0 || state.selectedApplications.includes(product.application);

                return matchesSearch && matchesCategory && matchesMaterial && matchesApp;
            });

            // Aplica a ordenação escolhida pelo usuário
            if (state.sortBy === 'sku') {
                filtered.sort((a, b) => a.sku.localeCompare(b.sku));
            } else if (state.sortBy === 'name') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            }

            renderProductsGrid(filtered);
            updateActiveFilterBadges();
        }

        // Desenha os selos (chips) dos filtros ativos acima dos produtos
        function updateActiveFilterBadges() {
            const totalActive = state.selectedCategories.length + state.selectedMaterials.length + state.selectedApplications.length;
            const mobileBadge = document.getElementById('mobileActiveFilterCount');
            const bar = document.getElementById('activeFiltersBar');
            const tagsContainer = document.getElementById('activeFilterTags');

            if (totalActive > 0) {
                mobileBadge.textContent = totalActive;
                mobileBadge.classList.remove('hidden');
                bar.classList.remove('hidden');
                bar.classList.add('flex');

                let tagsHtml = '';
                state.selectedCategories.forEach(c => {
                    tagsHtml += `<button onclick="toggleFilter('category', '${c}')" class="bg-navy-900 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">${c} <i class="fa-solid fa-xmark text-industrial-amber"></i></button>`;
                });
                state.selectedMaterials.forEach(m => {
                    tagsHtml += `<button onclick="toggleFilter('material', '${m}')" class="bg-navy-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">${m} <i class="fa-solid fa-xmark text-industrial-amber"></i></button>`;
                });
                state.selectedApplications.forEach(a => {
                    tagsHtml += `<button onclick="toggleFilter('application', '${a}')" class="bg-slate-700 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">${a} <i class="fa-solid fa-xmark text-industrial-amber"></i></button>`;
                });
                tagsContainer.innerHTML = tagsHtml;
            } else {
                mobileBadge.classList.add('hidden');
                bar.classList.add('hidden');
                bar.classList.remove('flex');
            }
        }

