/* ============================================================================
   ARQUIVO: assets/js/quote.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Lista de orçamento, validação de CPF/CNPJ, salvar o lead no banco e montar a mensagem do WhatsApp
   DEPENDE DE: config.js, state.js, ui-drawers.js
   O QUE VOCÊ PODE MUDAR AQUI: Texto da mensagem do WhatsApp (função submitQuote) e campos obrigatórios
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 9] LISTA DE ORÇAMENTO B2B E DISPARO PARA WHATSAPP
           Gerencia os itens escolhidos e monta a mensagem pronta para o vendedor.
        ------------------------------------------------------------------------- */
        function addToQuote(productId, quantity = 1) {
            const product = productsDatabase.find(p => p.id === productId);
            if (!product) return;

            // Se o produto já estiver na lista, apenas soma a quantidade
            const existingItem = state.quoteList.find(item => item.product.id === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.quoteList.push({ product, quantity });
            }

            updateQuoteUI();
            showToast(`"${product.sku}" adicionado à lista de orçamento!`);
        }

        // Altera a quantidade (+1 ou -1) dentro da gaveta de orçamento
        function updateQuoteItemQty(productId, delta) {
            const idx = state.quoteList.findIndex(item => item.product.id === productId);
            if (idx === -1) return;

            state.quoteList[idx].quantity += delta;
            // Se chegar a zero, remove o item da lista
            if (state.quoteList[idx].quantity <= 0) {
                state.quoteList.splice(idx, 1);
            }
            updateQuoteUI();
        }

        // Remove um item completamente ao clicar no ícone de lixeira
        function removeQuoteItem(productId) {
            state.quoteList = state.quoteList.filter(item => item.product.id !== productId);
            updateQuoteUI();
        }

        // Atualiza os contadores vermelhos/verdes e redesenha os itens na gaveta
        function updateQuoteUI() {
            const totalItems = state.quoteList.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('quoteBadge').textContent = totalItems;
            document.getElementById('floatingQuoteCount').textContent = totalItems;

            const container = document.getElementById('quoteItemsContainer');
            if (state.quoteList.length === 0) {
                container.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                        <i class="fa-solid fa-clipboard text-4xl mb-3 text-slate-300"></i>
                        <p class="font-bold text-slate-600 text-sm">Sua lista de cotação está vazia</p>
                        <p class="text-xs mt-1">Adicione parafusos, discos ou EPIs do catálogo para solicitar orçamento.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = state.quoteList.map(({ product, quantity }) => `
                <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
                    <div class="w-12 h-12 rounded-lg bg-industrial-bg flex items-center justify-center shrink-0">
                        ${getProductIllustrationSVG(product.svgType, "w-8 h-8")}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-mono text-[11px] font-bold text-industrial-amber bg-navy-900 px-1.5 py-0.5 rounded">${product.sku}</span>
                            <button onclick="removeQuoteItem(${product.id})" class="text-slate-400 hover:text-industrial-red text-xs">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        <h4 class="font-bold text-navy-900 text-xs mt-1 truncate">${product.name}</h4>
                        <p class="text-[11px] text-slate-500 font-mono">${product.packaging}</p>
                        
                        <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span class="text-[11px] font-semibold text-slate-500">Qtd. Embalagens:</span>
                            <div class="flex items-center border border-slate-200 rounded bg-slate-50">
                                <button onclick="updateQuoteItemQty(${product.id}, -1)" class="px-2 py-0.5 text-xs font-bold hover:bg-slate-200">-</button>
                                <span class="px-2.5 text-xs font-mono font-bold">${quantity}</span>
                                <button onclick="updateQuoteItemQty(${product.id}, 1)" class="px-2 py-0.5 text-xs font-bold hover:bg-slate-200">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Formata todo o pedido em texto e abre o WhatsApp Web / App no celular
        function maskDoc(el) {
            const d = el.value.replace(/\D/g, '').slice(0, 14);
            el.value = d.length <= 11
                ? d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                : d.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }

        // Valida os dígitos verificadores de CPF (11) e CNPJ (14)
        function validDoc(v) {
            const d = v.replace(/\D/g, '');
            if (!/^\d{11}$|^\d{14}$/.test(d) || /^(\d)\1+$/.test(d)) return false;
            if (d.length === 11) {
                for (let t = 9; t < 11; t++) {
                    let sum = 0; for (let i = 0; i < t; i++) sum += d[i] * (t + 1 - i);
                    if ((sum * 10 % 11) % 10 != d[t]) return false;
                }
                return true;
            }
            for (let t = 12; t < 14; t++) {
                let sum = 0, w = t - 7;
                for (let i = 0; i < t; i++) { sum += d[i] * w--; if (w < 2) w = 9; }
                if ((sum % 11 < 2 ? 0 : 11 - sum % 11) != d[t]) return false;
            }
            return true;
        }

        // Valida -> salva o lead no banco -> abre o WhatsApp com a lista pronta
        async function submitQuote() {
            if (state.quoteList.length === 0) return showToast("Adicione pelo menos 1 produto antes de enviar.");
            const g = id => document.getElementById(id).value.trim();
            const name = g('qName'), doc = g('qDoc'), phone = g('qPhone'), email = g('qEmail'), city = g('qCity'), notes = g('quoteNotesInput');
            if (!name) return showToast("Informe seu nome ou razão social.");
            if (!validDoc(doc)) return showToast("CPF ou CNPJ inválido. Confira os números.");
            if (phone.replace(/\D/g, '').length < 10) return showToast("Informe um telefone com DDD.");
            if (!document.getElementById('qConsent').checked) return showToast("Marque a autorização de uso dos dados (LGPD).");

            const btn = document.getElementById('qSendBtn'); btn.disabled = true;
            const win = window.open('', '_blank'); // abre já no clique para o celular não bloquear o pop-up
            const items = state.quoteList.map(({ product, quantity }) => ({ sku: product.sku, name: product.name, packaging: product.packaging, quantity }));

            let saved = false;
            if (db) {
                try {
                    const { error } = await db.from('quotes').insert({ name, document: doc.replace(/\D/g, ''), phone, email: email || null, city: city || null, notes: notes || null, items });
                    saved = !error; if (error) console.error(error);
                } catch (e) { console.error(e); }
            }

            let msg = `*SOLICITAÇÃO DE ORÇAMENTO - ${EMPRESA_CONFIG.nome}*\n*Cliente:* ${name}\n*CPF/CNPJ:* ${doc}\n*Contato:* ${phone}\n`;
            if (city) msg += `*Cidade:* ${city}\n`;
            if (notes) msg += `*Obs:* ${notes}\n`;
            msg += `\n*ITENS PARA COTAÇÃO:*\n`;
            items.forEach((it, i) => { msg += `${i + 1}. *[${it.sku}]* ${it.name}\n   • Qtd: *${it.quantity}x* (${it.packaging})\n`; });
            msg += `\nAguardo retorno com valores e prazo de entrega.`;

            const url = `https://wa.me/${EMPRESA_CONFIG.whatsappVendas}?text=${encodeURIComponent(msg)}`;
            if (win) win.location.href = url; else window.location.href = url;

            btn.disabled = false;
            if (saved) { state.quoteList = []; updateQuoteUI(); closeQuoteDrawer(); showToast("Orçamento registrado! Abrindo o WhatsApp..."); }
        }

