/* ============================================================================
   ARQUIVO: assets/js/product-modal.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Janela da ficha técnica do produto
   DEPENDE DE: products-data.js, svg-icons.js, quote.js
   O QUE VOCÊ PODE MUDAR AQUI: Campos exibidos na ficha
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 8] CONTROLE DO MODAL DE FICHA TÉCNICA
           Abre uma janela sobreposta com todas as especificações de engenharia.
        ------------------------------------------------------------------------- */
        function openProductModal(productId) {
            const product = productsDatabase.find(p => p.id === productId);
            if (!product) return;

            document.getElementById('modalSkuBadge').textContent = product.sku;
            document.getElementById('modalCategoryText').textContent = product.category;
            document.getElementById('modalProductName').textContent = product.name;
            document.getElementById('modalProductDesc').textContent = product.description;
            document.getElementById('modalProductIllustration').innerHTML = getProductVisual(product, "w-24 h-24", "w-full h-full object-contain");
            document.getElementById('modalQtyInput').value = 1;

            // Preenche a tabela de especificações técnicas
            document.getElementById('modalSpecsTable').innerHTML = `
                <tr>
                    <th class="px-4 py-2.5 bg-slate-50 text-slate-500 font-semibold w-1/3">Norma Técnica</th>
                    <td class="px-4 py-2.5 font-mono font-bold text-navy-900">${product.norm}</td>
                </tr>
                <tr>
                    <th class="px-4 py-2.5 bg-slate-50 text-slate-500 font-semibold">Material / Liga</th>
                    <td class="px-4 py-2.5 font-semibold text-slate-800">${product.material}</td>
                </tr>
                <tr>
                    <th class="px-4 py-2.5 bg-slate-50 text-slate-500 font-semibold">Bitola / Dimensão</th>
                    <td class="px-4 py-2.5 font-mono text-slate-800">${product.gauge}</td>
                </tr>
                <tr>
                    <th class="px-4 py-2.5 bg-slate-50 text-slate-500 font-semibold">Embalagem Padrão</th>
                    <td class="px-4 py-2.5 text-slate-800">${product.packaging}</td>
                </tr>
                <tr>
                    <th class="px-4 py-2.5 bg-slate-50 text-slate-500 font-semibold">Aplicação</th>
                    <td class="px-4 py-2.5 text-slate-800">${product.application}</td>
                </tr>
            `;

            // Configura o botão de adicionar dentro do modal para respeitar a quantidade digitada
            document.getElementById('modalAddBtn').onclick = () => {
                const qty = Math.max(1, parseInt(document.getElementById('modalQtyInput').value) || 1);
                addToQuote(product.id, qty);
                closeProductModal();
            };

            document.getElementById('productModalOverlay').classList.remove('hidden');
            document.body.classList.add('overflow-hidden'); // Trava a rolagem do fundo
        }

        function closeProductModal() {
            document.getElementById('productModalOverlay').classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }

        // Botões '+' e '-' de quantidade dentro do modal
        function changeModalQty(delta) {
            const input = document.getElementById('modalQtyInput');
            const current = parseInt(input.value) || 1;
            input.value = Math.max(1, current + delta);
        }

