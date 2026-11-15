/* ============================================================================
   ARQUIVO: assets/js/tailwind-config.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Paleta de cores e fontes do site (Tailwind)
   DEPENDE DE: Tailwind CDN carregado antes, no HTML
   O QUE VOCÊ PODE MUDAR AQUI: Códigos de cor (#...) e fontes. Troque aqui para mudar o azul/amarelo do site inteiro. (Se usar o Tailwind compilado, mude também em tailwind.config.js)
============================================================================ */

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // Tons de Azul Marinho Industrial (Cabeçalho, Rodapé e Botões Escuros)
                navy: {
                    950: '#091526', // Azul quase preto (barra superior e rodapé)
                    900: '#0F233C', // Azul principal da marca
                    800: '#173459', // Azul secundário (menus e cards de destaque)
                    700: '#21487A', // Azul claro (efeito ao passar o mouse / hover)
                },
                // Cores de Destaque e Ação
                industrial: {
                    amber: '#F59E0B',      // Amarelo/Âmbar industrial (botões principais e selos)
                    amberHover: '#D97706', // Amarelo mais escuro ao passar o mouse
                    red: '#D9232E',        // Vermelho técnico (alertas, contadores e limpeza)
                    bg: '#F4F6F9',         // Cinza bem claro do fundo da página
                }
            }
        }
    }
}
