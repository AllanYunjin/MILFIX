# MILFIX – Mapa do projeto (atualizado em 15/11/2026)

## Estrutura
```
milfix-site/
├─ index.html              ← GERADO por build.js (não edite direto)
├─ admin.html              ← painel administrativo
├─ setup_banco.sql         ← cria o banco no Supabase (rodar 1 vez)
├─ build.js                ← junta os pedaços do HTML
├─ tailwind.config.js, input.css, package.json  ← só para o Tailwind compilado (opcional)
├─ src/
│  ├─ index.template.html  ← esqueleto: <head>, ordem das seções, ordem dos scripts
│  └─ partials/            ← cada parte visual do site (1 arquivo por parte)
└─ assets/
   ├─ css/custom.css       ← seu CSS próprio
   └─ js/                  ← todo o JavaScript, 1 arquivo por assunto
```

## "Quero mudar ___"  →  edite ___
| Quero mudar | Arquivo |
|---|---|
| Chaves do Supabase / WhatsApp de vendas | `assets/js/config.js` |
| Cores e fontes do site | `assets/js/tailwind-config.js` |
| Telefone/horário do topo | `src/partials/topbar.html` |
| Logo, busca, botão de orçamento | `src/partials/header.html` |
| Menu de departamentos (PC) | `src/partials/nav.html` |
| Banner principal | `src/partials/hero.html` |
| Cards de atalho | `src/partials/shortcuts.html` |
| Área do catálogo (filtros, ordenação) | `src/partials/catalog.html` |
| Artigos/guias | `src/partials/articles.html` |
| Rodapé e contatos | `src/partials/footer.html` |
| Botão flutuante | `src/partials/floating-button.html` |
| Menu do celular | `src/partials/mobile-menu.html` |
| Filtros do celular | `src/partials/filter-drawer.html` |
| Ficha técnica | `src/partials/product-modal.html` + `assets/js/product-modal.js` |
| Campos do formulário de orçamento | `src/partials/quote-drawer.html` + `assets/js/quote.js` |
| Mensagem enviada ao WhatsApp | `assets/js/quote.js` (função `submitQuote`) |
| Visual dos cards de produto | `assets/js/product-cards.js` |
| Ícones dos produtos | `assets/js/svg-icons.js` |
| Regras de busca/filtro/ordenação | `assets/js/filters.js` |
| Produtos (dia a dia) | **Painel** `admin.html` (sem mexer em código) |
| Lógica do painel | `assets/js/admin.js` |

## Depois de editar
- Mexeu em `src/` → rode `node build.js` (regera o `index.html`).
- Mexeu só em `assets/` ou `admin.html` → nada a rodar, só recarregar a página.
- **Sem Node?** Dá para apagar `src/` e `build.js` e editar o `index.html` direto (perde a organização por partes).

## Ordem dos scripts (NÃO troque)
`config → products-data → state → svg-icons → filters → product-cards → product-modal → quote → ui-drawers → main`
Cada arquivo usa funções dos anteriores. "X is not defined" no console geralmente é ordem errada ou arquivo faltando.

## Publicar sem comentários e com JS compacto
`npm install` (1ª vez) → `npm run publicar` → envie a pasta **dist/** (não a raiz) para o Netlify.
Isso remove os comentários do HTML e compacta o JS. O código do navegador **nunca fica secreto**, só mais difícil de ler;
a segurança real está nas regras (RLS) do Supabase, criadas pelo `setup_banco.sql`.

## Tailwind compilado (opcional)
`npm install` → `npm run css` (gera `assets/css/tailwind.css`). Depois, no `src/index.template.html` e no `admin.html`,
troque as linhas do `cdn.tailwindcss.com` e do `tailwind-config.js` por `<link rel="stylesheet" href="assets/css/tailwind.css">`
e rode `node build.js`. Para mudar cores nesse modo, edite `tailwind.config.js`.
