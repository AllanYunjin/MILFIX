// ARQUIVO: build.js | Atualizado em 15/11/2026
// "node build.js"             -> monta o index.html juntando src/index.template.html + src/partials/*.html
// "node build.js --producao"  -> também cria a pasta dist/ (comentários removidos do HTML e JS minificado) para publicar
const fs = require('fs'), path = require('path'), cp = require('child_process');
const SRC = path.join(__dirname, 'src');
const incl = t => t.replace(/^[ \t]*<!--@include (.+?)-->[ \t]*$/gm, (m, f) => incl(fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\n$/, '')));
const html = incl(fs.readFileSync(path.join(SRC, 'index.template.html'), 'utf8'));
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html gerado.');
if (process.argv.includes('--producao')) {
  const out = path.join(__dirname, 'dist'), rd = p => fs.readFileSync(path.join(__dirname, p), 'utf8');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(path.join(out, 'assets/js'), { recursive: true }); fs.mkdirSync(path.join(out, 'assets/css'), { recursive: true });
  const strip = h => h.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n+/g, '\n');
  fs.writeFileSync(path.join(out, 'index.html'), strip(html));
  fs.writeFileSync(path.join(out, 'admin.html'), strip(rd('admin.html')));
  for (const f of fs.readdirSync(path.join(__dirname, 'assets/js'))) {
    const i = path.join(__dirname, 'assets/js', f), o = path.join(out, 'assets/js', f);
    const terser = path.join(__dirname, 'node_modules/.bin/terser' + (process.platform === 'win32' ? '.cmd' : ''));
    try { if (!fs.existsSync(terser)) throw new Error('sem terser'); cp.execSync(`"${terser}" "${i}" -c -m -o "${o}"`, { stdio: 'pipe', timeout: 60000 }); }
    catch (e) { fs.copyFileSync(i, o); console.log('terser indisponível (rode npm install). Copiado sem minificar:', f); }
  }
  for (const f of fs.readdirSync(path.join(__dirname, 'assets/css'))) fs.copyFileSync(path.join(__dirname, 'assets/css', f), path.join(out, 'assets/css', f));
  console.log('Pasta dist/ pronta para publicar.');
}
