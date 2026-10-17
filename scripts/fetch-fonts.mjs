// Baixa as fontes do Google Fonts (só o subconjunto latin) para src/fonts e gera src/css/fonts.css.
// Rode uma vez: node scripts/fetch-fonts.mjs. O site passa a não chamar o Google em cada visita.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const URLS = [
  'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Figtree:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Albert+Sans:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Teko:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap',
];
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36';
mkdirSync(path.join(ROOT, 'src/fonts'), { recursive: true });
const seen = new Map(); let css = '/* gerado por scripts/fetch-fonts.mjs: não editar à mão */\n';
for (const u of URLS) {
  const text = await (await fetch(u, { headers: { 'User-Agent': UA } })).text();
  for (const m of text.matchAll(/\/\* (\S+) \*\/\s*(@font-face \{[^}]+\})/g)) {
    if (m[1] !== 'latin') continue;
    let block = m[2];
    const src = block.match(/url\((https:[^)]+)\)/)[1];
    if (!seen.has(src)) {
      const name = src.split('/').pop().replace(/\.woff2$/, '').slice(0, 40) + '.woff2';
      writeFileSync(path.join(ROOT, 'src/fonts', name), Buffer.from(await (await fetch(src)).arrayBuffer()));
      seen.set(src, name);
    }
    css += block.replace(src, `../fonts/${seen.get(src)}`) + '\n';
  }
}
writeFileSync(path.join(ROOT, 'src/css/fonts.css'), css);
console.log(seen.size, 'arquivos de fonte');
