/* ============================================================================
   ARQUIVO: assets/js/admin.js
   Última atualização: 15/11/2026
   PARA QUE SERVE: Lógica do painel: login, produtos, orçamentos/leads e exportação CSV
   DEPENDE DE: config.js (define "db"), biblioteca Supabase
   O QUE VOCÊ PODE MUDAR AQUI: Lista STATUS dos leads, campos do formulário de produto
============================================================================ */

let products = [], quotes = [];
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDoc = d => d.length === 11 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
const STATUS = ['novo', 'em atendimento', 'fechado', 'perdido'];

async function login() {
  $('loginErr').textContent = '';
  const { error } = await db.auth.signInWithPassword({ email: $('email').value.trim(), password: $('pass').value });
  if (error) { $('loginErr').textContent = 'E-mail ou senha incorretos.'; return; }
  start();
}
async function logout() { await db.auth.signOut(); location.reload(); }
async function start() {
  const { data } = await db.auth.getSession();
  if (!data.session) return;
  $('loginBox').classList.add('hidden'); $('app').classList.remove('hidden');
  tab('p'); await Promise.all([loadProducts(), loadQuotes()]);
}
function tab(t) {
  $('secP').classList.toggle('hidden', t !== 'p'); $('secQ').classList.toggle('hidden', t !== 'q');
  $('tabP').className = 'px-4 py-2 rounded-lg text-sm font-semibold ' + (t === 'p' ? 'bg-[#0F233C] text-white' : 'bg-white');
  $('tabQ').className = 'px-4 py-2 rounded-lg text-sm font-semibold ' + (t === 'q' ? 'bg-[#0F233C] text-white' : 'bg-white');
}

/* ---------- PRODUTOS ---------- */
async function loadProducts() {
  const { data, error } = await db.from('products').select('*').order('id');
  if (error) return alert('Erro ao carregar produtos: ' + error.message);
  products = data; renderProducts();
  $('cats').innerHTML = [...new Set(products.map(p => p.category))].map(c => `<option value="${esc(c)}">`).join('');
}
function renderProducts() {
  const q = $('pSearch').value.toLowerCase();
  $('pBody').innerHTML = products.filter(p => (p.sku + ' ' + p.name).toLowerCase().includes(q)).map(p => `
    <tr class="border-t ${p.active ? '' : 'opacity-50'}">
      <td class="p-3 font-mono text-xs">${esc(p.sku)}</td><td class="p-3">${p.image_url ? `<img src="${esc(p.image_url)}" class="inline w-8 h-8 object-contain mr-2 align-middle">` : ''}${esc(p.name)}</td><td class="p-3">${esc(p.category)}</td>
      <td class="p-3"><input type="checkbox" ${p.active ? 'checked' : ''} onchange="toggleActive(${p.id}, this.checked)"></td>
      <td class="p-3 text-right whitespace-nowrap">
        <button onclick="openForm(${p.id})" class="text-blue-700 mr-3">Editar</button>
        <button onclick="delProduct(${p.id})" class="text-red-600">Excluir</button></td></tr>`).join('')
    || '<tr><td colspan="5" class="p-6 text-center text-slate-400">Nenhum produto.</td></tr>';
}
const FIELDS = ['sku', 'name', 'category', 'material', 'application', 'norm', 'gauge', 'packaging', 'description'];
function openForm(id) {
  const p = products.find(x => x.id === id) || {};
  $('mTitle').textContent = id ? 'Editar produto' : 'Novo produto'; $('mErr').textContent = '';
  $('f_id').value = id || '';
  FIELDS.forEach(f => $('f_' + f).value = p[f] || '');
  $('f_svg').value = p.svg_type || 'bolt'; $('f_active').checked = id ? p.active : true;
  $('f_file').value = ''; $('f_imgStatus').textContent = 'JPG, PNG ou WebP. É reduzida automaticamente.'; setImage(p.image_url || '');
  $('modal').classList.remove('hidden');
}
/* ---------- FOTO DO PRODUTO (adicionado em 15/11/2026) ----------
   Reduz a foto para no máx. 900px, converte para WebP e envia ao Storage do Supabase
   (pasta "product-images"). O endereço público fica em f_image e é salvo ao clicar em Salvar. */
let uploading = false;
function setImage(url) {
  $('f_image').value = url;
  $('f_preview').innerHTML = url ? `<img src="${esc(url)}" class="w-full h-full object-contain">` : 'sem foto';
}
function clearImage() { $('f_file').value = ''; setImage(''); }
async function onPickImage(inp) {
  const file = inp.files[0]; if (!file) return;
  uploading = true; $('f_imgStatus').textContent = 'Enviando foto...';
  try {
    const bmp = await createImageBitmap(file), k = Math.min(1, 900 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.85));
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const { error } = await db.storage.from('product-images').upload(name, blob, { contentType: 'image/webp', cacheControl: '31536000' });
    if (error) throw error;
    setImage(db.storage.from('product-images').getPublicUrl(name).data.publicUrl);
    $('f_imgStatus').textContent = 'Foto enviada! Clique em Salvar.';
  } catch (e) { console.error(e); $('f_imgStatus').textContent = 'Erro ao enviar a foto. Confira se rodou o atualizacao_fotos.sql.'; }
  uploading = false;
}
function closeForm() { $('modal').classList.add('hidden'); }
async function saveProduct() {
  const row = {}; FIELDS.forEach(f => row[f] = $('f_' + f).value.trim() || null);
  if (uploading) { $('mErr').textContent = 'Aguarde o envio da foto terminar.'; return; }
  row.svg_type = $('f_svg').value; row.active = $('f_active').checked; row.image_url = $('f_image').value || null;
  if (!row.sku || !row.name || !row.category) { $('mErr').textContent = 'Preencha SKU, nome e categoria.'; return; }
  const id = $('f_id').value;
  const { error } = id ? await db.from('products').update(row).eq('id', id) : await db.from('products').insert(row);
  if (error) { $('mErr').textContent = error.message.includes('duplicate') ? 'Já existe um produto com esse SKU.' : error.message; return; }
  closeForm(); loadProducts();
}
async function toggleActive(id, v) { await db.from('products').update({ active: v }).eq('id', id); loadProducts(); }
async function delProduct(id) {
  if (!confirm('Excluir este produto definitivamente? (Para só esconder do site, desmarque "Ativo".)')) return;
  await db.from('products').delete().eq('id', id); loadProducts();
}

/* ---------- ORÇAMENTOS ---------- */
async function loadQuotes() {
  const { data, error } = await db.from('quotes').select('*').order('created_at', { ascending: false });
  if (error) return alert('Erro ao carregar orçamentos: ' + error.message);
  quotes = data; renderQuotes();
}
function renderQuotes() {
  const q = $('qSearch').value.toLowerCase().replace(/[.\-\/]/g, '');
  $('qList').innerHTML = quotes.filter(x => (x.name + x.document + x.phone + (x.email || '')).toLowerCase().includes(q)).map(x => `
    <div class="bg-white rounded-xl shadow p-4 text-sm">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div><div class="font-bold text-[#0F233C]">${esc(x.name)}</div>
          <div class="text-slate-500 text-xs">${fmtDoc(esc(x.document))} · ${new Date(x.created_at).toLocaleString('pt-BR')}</div></div>
        <select onchange="setStatus(${x.id}, this.value)" class="border rounded-lg px-2 py-1 text-xs">
          ${STATUS.map(s => `<option ${s === x.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
      <div class="mt-2 text-xs flex flex-wrap gap-x-4 gap-y-1">
        <a class="text-emerald-700 font-semibold" target="_blank" rel="noopener" href="https://wa.me/55${esc(x.phone.replace(/\D/g, ''))}">WhatsApp: ${esc(x.phone)}</a>
        ${x.email ? `<span>${esc(x.email)}</span>` : ''}${x.city ? `<span>${esc(x.city)}</span>` : ''}</div>
      ${x.notes ? `<div class="mt-1 text-xs italic text-slate-500">Obs: ${esc(x.notes)}</div>` : ''}
      <ul class="mt-2 text-xs list-disc pl-5">${(x.items || []).map(i => `<li><b>${esc(i.sku)}</b> ${esc(i.name)} — ${esc(i.quantity)}x (${esc(i.packaging)})</li>`).join('')}</ul>
    </div>`).join('') || '<p class="text-center text-slate-400 p-6">Nenhum orçamento ainda.</p>';
}
async function setStatus(id, status) { await db.from('quotes').update({ status }).eq('id', id); }
function exportCSV() {
  const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [['Data', 'Nome', 'CPF/CNPJ', 'Telefone', 'E-mail', 'Cidade', 'Status', 'Itens', 'Obs'].join(';')]
    .concat(quotes.map(x => [new Date(x.created_at).toLocaleString('pt-BR'), x.name, fmtDoc(x.document), x.phone, x.email, x.city, x.status,
      (x.items || []).map(i => `${i.sku} x${i.quantity}`).join(' | '), x.notes].map(cell).join(';')));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
  a.download = 'orcamentos_milfix.csv'; a.click();
}
start();
