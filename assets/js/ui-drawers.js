/* ============================================================================
   ARQUIVO: assets/js/ui-drawers.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Abrir/fechar menus laterais, gavetas e o aviso rápido (toast)
   DEPENDE DE: nenhum
   O QUE VOCÊ PODE MUDAR AQUI: Animações e tempo do aviso
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 10] CONTROLES DE ABERTURA E FECHAMENTO DAS GAVETAS (DRAWERS)
        ------------------------------------------------------------------------- */
        function toggleMobileMenu() {
            const drawer = document.getElementById('mobileMenuDrawer');
            const overlay = document.getElementById('mobileMenuOverlay');
            const isClosed = drawer.classList.contains('-translate-x-full');

            if (isClosed) {
                drawer.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                drawer.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }

        function toggleFilterDrawer(open) {
            const drawer = document.getElementById('filterDrawer');
            const overlay = document.getElementById('filterDrawerOverlay');
            if (open) {
                drawer.classList.remove('translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                drawer.classList.add('translate-x-full');
                overlay.classList.add('hidden');
            }
        }

        function openQuoteDrawer() {
            document.getElementById('quoteDrawer').classList.remove('translate-x-full');
            document.getElementById('quoteDrawerOverlay').classList.remove('hidden');
        }

        function closeQuoteDrawer() {
            document.getElementById('quoteDrawer').classList.add('translate-x-full');
            document.getElementById('quoteDrawerOverlay').classList.add('hidden');
        }

        // Rola a página suavemente até a seção do catálogo
        function scrollToCatalog() {
            document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
        }

        // Exibe a notificação rápida (toast) na parte inferior da tela por 3,2 segundos
        let toastTimeout;
        function showToast(text) {
            const toast = document.getElementById('toastNotification');
            document.getElementById('toastMessage').textContent = text;
            toast.classList.remove('opacity-0', 'pointer-events-none');
            
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.add('opacity-0', 'pointer-events-none');
            }, 3200);
        }

