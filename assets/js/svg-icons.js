/* ============================================================================
   ARQUIVO: assets/js/svg-icons.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Desenhos vetoriais (SVG) usados no lugar de fotos
   DEPENDE DE: nenhum
   O QUE VOCÊ PODE MUDAR AQUI: Formas e cores dos ícones, ou trocar por <img> com fotos reais
============================================================================ */

        /* -------------------------------------------------------------------------
           [PASSO 4] DESENHOS VETORIAIS (SVG) DOS PRODUTOS
           Gera ilustrações técnicas nítidas em qualquer tamanho de tela sem precisar
           carregar imagens pesadas externas.
        ------------------------------------------------------------------------- */
        function getProductIllustrationSVG(type, sizeClass = "w-16 h-16") {
            const svgs = {
                bolt: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect x="20" y="8" width="24" height="10" rx="2" fill="#F59E0B" fill-opacity="0.25"/>
                    <line x1="27" y1="8" x2="27" y2="18"/><line x1="37" y1="8" x2="37" y2="18"/>
                    <rect x="26" y="18" width="12" height="36" rx="1"/>
                    <path d="M26 24l12 3M26 30l12 3M26 36l12 3M26 42l12 3M26 48l12 3"/>
                </svg>`,
                rod: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect x="27" y="6" width="10" height="52" rx="1" fill="#F59E0B" fill-opacity="0.2"/>
                    <path d="M27 12l10 3M27 18l10 3M27 24l10 3M27 30l10 3M27 36l10 3M27 42l10 3M27 48l10 3"/>
                </svg>`,
                nut: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4">
                    <polygon points="32 10 52 21 52 43 32 54 12 43 12 21 32 10" fill="#F59E0B" fill-opacity="0.25"/>
                    <circle cx="32" cy="32" r="10" fill="#FFFFFF"/>
                    <circle cx="32" cy="32" r="7" stroke-dasharray="3 2"/>
                </svg>`,
                anchor: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect x="28" y="8" width="8" height="34"/>
                    <path d="M24 38h16v14l-8 4-8-4V38z" fill="#F59E0B" fill-opacity="0.25"/>
                    <rect x="22" y="14" width="20" height="5" rx="1"/>
                </svg>`,
                disc: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="32" cy="32" r="24" fill="#0F233C" fill-opacity="0.08"/>
                    <circle cx="32" cy="32" r="18" stroke="#F59E0B" stroke-width="3"/>
                    <circle cx="32" cy="32" r="6" fill="#FFFFFF"/>
                </svg>`,
                weld: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">
                    <line x1="14" y1="50" x2="46" y2="18" stroke-width="4" stroke-linecap="round"/>
                    <path d="M46 18l6-6M42 12l2 4M52 22l-4-2M49 11l-1 4" stroke="#F59E0B" stroke-width="2.4" stroke-linecap="round"/>
                </svg>`,
                epi: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M12 36c0-11 9-20 20-20s20 9 20 20H12z" fill="#F59E0B" fill-opacity="0.3"/>
                    <path d="M8 36h48" stroke-width="3" stroke-linecap="round"/>
                    <path d="M26 16v12M38 16v12"/>
                </svg>`,
                wrench: `<svg class="${sizeClass} text-navy-900" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M44 12a10 10 0 0 0-12 12L16 40a8 8 0 1 0 8 8l16-16a10 10 0 0 0 12-12l-6 6-4-4 6-6z" fill="#F59E0B" fill-opacity="0.25"/>
                </svg>`
            };
            // Retorna o ícone pedido ou, se não existir, retorna o ícone de parafuso ('bolt')
            return svgs[type] || svgs.bolt;
        }


        /* -------------------------------------------------------------------------
           FOTO DO PRODUTO (adicionado em 15/11/2026)
           Se o produto tem foto (image_url, enviada pelo painel), mostra a foto.
           Se NÃO tem, mostra o desenho SVG de sempre. Assim nada quebra.
           svgClass = tamanho do desenho | imgClass = tamanho/ajuste da foto
        ------------------------------------------------------------------------- */
        function getProductVisual(product, svgClass, imgClass) {
            if (!product.image_url) return getProductIllustrationSVG(product.svgType, svgClass);
            const safe = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
            return `<img src="${safe(product.image_url)}" alt="${safe(product.name)}" loading="lazy" class="${imgClass}">`;
        }
