/* ============================================================================
   ARQUIVO: assets/js/config.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Dados que VOCÊ precisa preencher: chaves do Supabase (usadas pelo site E pelo painel) e WhatsApp de vendas
   DEPENDE DE: Biblioteca Supabase (carregada antes, no HTML)
   O QUE VOCÊ PODE MUDAR AQUI: SUPABASE_URL, SUPABASE_ANON_KEY e whatsappVendas
============================================================================ */

        /* ---- CONEXÃO COM O BANCO (SUPABASE) ----
           Project URL e chave "anon/publishable" ficam em Project Settings > API do Supabase.
           NUNCA coloque a chave "service_role" aqui. */
        const SUPABASE_URL = "COLE_AQUI_A_PROJECT_URL";      // ex: https://abcd1234.supabase.co
        const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_KEY";   // chave pública (anon / publishable)
        const db = (window.supabase && SUPABASE_URL.startsWith("https"))
            ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;


        /* -------------------------------------------------------------------------
           [PASSO 1] CONFIGURAÇÕES RÁPIDAS DA EMPRESA
           Edite o número abaixo para onde os orçamentos do WhatsApp serão enviados.
           Formato obrigatório: 55 (Brasil) + DDD + Número (apenas dígitos).
        ------------------------------------------------------------------------- */
        const EMPRESA_CONFIG = {
            nome: "MILFIX",
            whatsappVendas: "5511998765432" // <-- EDITE SEU NÚMERO DE WHATSAPP AQUI!
        };

