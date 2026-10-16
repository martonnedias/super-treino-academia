#!/usr/bin/env node
// Gera o site estático em dist/ a partir de src/.
//
//   node build.mjs                 protótipo: página de escolha + layouts A, C e D (noindex)
//   node build.mjs --final=c       site final com o layout escolhido na raiz (indexável)
//   SITE_URL=https://dominio.com.br node build.mjs --final=c
//
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { posix as path } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brand, colors, units, plans, faq, dayLabels } from './src/data/site.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url).replace(/\\/g, '/'));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const finalArg = process.argv.find((a) => a.startsWith('--final='));
const FINAL = finalArg ? finalArg.split('=')[1] : null;
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');
if (FINAL && !['a', 'c', 'd'].includes(FINAL)) throw new Error('--final deve ser a, c ou d');

const VARIANTS = {
  a: {
    label: 'Opção A', nome: 'Ingresso de festa', theme: '#1E3FA8',
    fonts: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Figtree:wght@400;500;600;700;800&display=swap',
  },
  c: {
    label: 'Opção C', nome: 'Noite', theme: '#0B0B0F',
    fonts: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Albert+Sans:wght@400;500;600;700;800&display=swap',
  },
  d: {
    label: 'Opção D', nome: 'Contraste', theme: '#050507',
    fonts: 'https://fonts.googleapis.com/css2?family=Teko:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap',
  },
};

// ---------- utilitários ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ph = (t) => `<span class="ph">[${t}]</span>`;
// Texto de dados -> HTML, destacando [trechos a confirmar].
const rich = (s) => esc(s).replace(/\[([^\]]+)\]/g, (_, t) => ph(t));

const dirUrl = (from, to) => {
  const r = path.relative(path.join('/', from || ''), path.join('/', to || ''));
  return r ? r + '/' : './';
};
const vdir = (v) => (FINAL ? '' : v);
const unitDir = (v, u) => path.join(vdir(v), 'unidades', u.slug);

// ---------- mini engine de template ({{caminho}}, <sc-for>, <sc-if>) ----------
function lookup(scope, expr, where) {
  let cur = scope;
  for (const p of expr.trim().split('.')) {
    if (cur == null || !(p in Object(cur))) throw new Error(`[${where}] valor ausente: {{${expr}}}`);
    cur = cur[p];
  }
  return cur;
}

function findClose(str, from, tag) {
  const open = new RegExp(`<${tag}\\b`, 'g');
  const close = `</${tag}>`;
  let depth = 1;
  let i = from;
  for (;;) {
    const nc = str.indexOf(close, i);
    if (nc === -1) throw new Error(`</${tag}> não encontrado`);
    open.lastIndex = i;
    const m = open.exec(str);
    if (m && m.index < nc) { depth++; i = m.index + tag.length + 1; continue; }
    depth--;
    i = nc + close.length;
    if (depth === 0) return nc;
  }
}

const fill = (s, scope, where) => s.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, e) => String(lookup(scope, e, where)));

function render(tpl, scope, where) {
  let out = '';
  let rest = tpl;
  const re = /<sc-(for|if)\b([^>]*)>/;
  for (;;) {
    const m = re.exec(rest);
    if (!m) { out += fill(rest, scope, where); break; }
    out += fill(rest.slice(0, m.index), scope, where);
    const tag = `sc-${m[1]}`;
    const bodyStart = m.index + m[0].length;
    const closeAt = findClose(rest, bodyStart, tag);
    const inner = rest.slice(bodyStart, closeAt);
    if (m[1] === 'for') {
      const list = lookup(scope, /list="\{\{\s*([^}]+?)\s*\}\}"/.exec(m[2])[1], where);
      const as = /as="([^"]+)"/.exec(m[2])[1];
      for (const item of list) {
        const child = Object.create(scope);
        child[as] = item;
        out += render(inner, child, where);
      }
    } else if (lookup(scope, /value="\{\{\s*([^}]+?)\s*\}\}"/.exec(m[2])[1], where)) {
      out += render(inner, scope, where);
    }
    rest = rest.slice(closeAt + tag.length + 3);
  }
  return out;
}

// ---------- contexto de dados por página ----------
const waLink = (u) => `https://wa.me/${u.waNumber}?text=${encodeURIComponent(`Olá! Quero agendar uma aula experimental na Super Treino ${u.name}.`)}`;
const addrOf = (u) => `${u.street} – ${u.district}, ${brand.city}-${brand.state}`;
const mapQuery = (u) => encodeURIComponent(`Super Treino Academia ${addrOf(u)}`);

function unitCtx(u, v, fromDir, root) {
  const [img, alt] = u.images[v];
  const days = dayLabels.map((label, i) => {
    const rows = [];
    if (u.dance.days.includes(i)) rows.push({ time: u.dance.time, name: 'Dança · Energia &amp; Diversão', note: 'Sem experiência necessária', ph: '' });
    if (i === 5) rows.push({ time: u.satStart, name: 'Sala de musculação aberta', note: u.satNote, ph: '' });
    rows.push({ time: '[00:00]', name: '[Aula]', note: 'Funcional e demais aulas: horários a confirmar com a unidade', ph: 'ph' });
    return { i, label, rows, pressed: i === 0 ? 'true' : 'false', hidden: i === 0 ? '' : 'hidden' };
  });
  return {
    ...u,
    href: dirUrl(fromDir, unitDir(v, u)),
    addr: esc(addrOf(u)),
    refBr: u.reference ? `<br>${esc(u.reference)}` : '',
    refDot: u.reference ? ` · ${esc(u.reference)}` : '',
    img: `${root}img/${img}`, alt,
    wa: waLink(u),
    map: `https://www.google.com/maps/search/?api=1&amp;query=${mapQuery(u)}`,
    tel: `tel:+${u.waNumber}`,
    embed: `https://www.google.com/maps?q=${mapQuery(u)}&amp;output=embed`,
    weekdays: `${ph('abertura a confirmar')} às ${brand.closes}`,
    sun: ph('a confirmar'),
    days,
  };
}

const planCtx = (u) => plans.map((p) => ({
  ...p,
  wa: u ? `https://wa.me/${u.waNumber}?text=${encodeURIComponent(`Olá! Quero o plano ${p.name} na Super Treino ${u.name}.`)}` : '',
  paper: p.best ? '' : 'paper-w',
  btn: p.best ? 'btn-k' : 'btn-b',
  btnC: p.best ? 'btn-y' : 'btn-o',
  btnD: p.best ? 'btn-y' : 'btn-o',
  hl: p.best ? 'hl' : '',
  hlColor: p.best ? 'color:var(--yellow)' : '',
  parcel: p.parcels === 1 ? 'à vista' : `em até ${p.parcels}x`,
  month: `R$ ${Math.round(p.price / p.months)}`,
  badge: p.best ? 'Melhor preço' : '',
  hasBadge: Boolean(p.best),
  eco: p.months > 1 ? `Economize R$ ${plans[0].price * p.months - p.price} frente ao mensal` : 'Ideal para conhecer a academia',
}));

const faqCtx = () => faq.map((f, i) => ({
  i, q: esc(f.q), a: rich(f.a),
  expanded: i === 0 ? 'true' : 'false', hidden: i === 0 ? '' : 'hidden',
}));

// [descrição, proporção, deslocamento, arquivo]
const GALLERY = {
  a: [
    ['Treino com sorriso', '9/16', 0, 'aluna-halter.jpg'], ['A sala ampla', '1/1', 40, 'sala-musculacao.jpg'],
    ['Aula de dança com confete', '9/16', 0, 'danca-confete.jpg'], ['Turma reunida após a aula', '1/1', 40, 'turma-comemorando.jpg'],
    ['Instrutor ajudando um aluno', '4/5', 0, 'instrutor.jpg'], ['Fim de tarde na esteira', '9/16', 40, 'esteiras.jpg'],
  ],
  c: [
    ['A sala ampla', '4/5', 0, 'sala-musculacao.jpg'], ['Treino com sorriso', '4/5', 0, 'aluna-halter.jpg'],
    ['Aula de funcional', '4/5', 0, 'funcional.jpg'], ['Energia & Diversão', '4/5', 0, 'danca-confete.jpg'],
  ],
  d: [
    ['Sala de musculação ampla', '3/4', 0, 'sala-musculacao.jpg'], ['Aluna sorrindo na musculação', '3/4', 0, 'aluna-halter.jpg'],
    ['Aluna treinando com halter', '3/4', 0, 'aluna-pb.jpg'], ['Aula de dança com confete', '3/4', 0, 'danca-confete.jpg'],
  ],
};

const confetti = () => {
  const cols = [colors.yellow, colors.orange, colors.blue, '#FFFFFF'];
  return [[6, 8], [14, 64], [22, 22], [31, 88], [44, 6], [53, 92], [61, 14], [70, 70], [78, 30], [86, 84], [92, 10], [96, 52], [3, 40], [48, 48]]
    .map((p, i) => ({ x: p[0], y: p[1], w: 10 + (i % 3) * 6, h: 6 + (i % 4) * 3, r: (i * 47) % 180, bg: cols[i % cols.length] }));
};

// ---------- páginas ----------
const read = (p) => readFileSync(path.join(SRC, p), 'utf8');
const write = (rel, content) => {
  const p = path.join(DIST, rel);
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, content);
};
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const polish = (html) => html
  .replace(/>4,7</g, '><em class="num" data-count="4.7" data-dec="1">4,7</em><')
  .replace('<main>', '<main id="conteudo">');

function shell({ v, kind, dir, title, desc, ld, body, data }) {
  const root = dirUrl(dir, '');
  const meta = VARIANTS[v];
  const robots = FINAL ? '' : '<meta name="robots" content="noindex,nofollow">\n';
  const canonical = SITE_URL ? `<link rel="canonical" href="${SITE_URL}/${dir ? dir + '/' : ''}">\n` : '';
  const ogImg = `${SITE_URL ? SITE_URL + '/' : root}img/aluna-halter.jpg`;
  return `<!doctype html>
<html lang="pt-BR" data-variant="${v}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${robots}${canonical}<meta name="theme-color" content="${meta.theme}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${brand.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${meta.fonts}">
<link rel="stylesheet" href="${root}css/${v}-${kind}.css">
<link rel="stylesheet" href="${root}css/fx.css">
<script>document.documentElement.classList.add('js')</script>
${ld}
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${body}
<script type="application/json" id="st-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script src="${root}js/fx.js" defer></script>
</body>
</html>
`;
}

function protoNav(v, kind, unit, dir) {
  if (FINAL) return '';
  const items = Object.entries(VARIANTS).map(([k, m]) => {
    const to = kind === 'home' ? vdir(k) : unitDir(k, unit);
    return `<a href="${dirUrl(dir, to)}"${k === v ? ' aria-current="page"' : ''} title="${m.label} · ${m.nome}">${k.toUpperCase()}</a>`;
  }).join('');
  return `<details class="proto"><summary aria-label="Trocar de layout do protótipo">Layout <b>${v.toUpperCase()}</b></summary><nav aria-label="Layouts do protótipo">${items}<a class="proto-all" href="${dirUrl(dir, '')}">Comparar</a></nav></details>`;
}

function buildHome(v) {
  const dir = vdir(v);
  const root = dirUrl(dir, '');
  const ctxUnits = units.map((u) => unitCtx(u, v, dir, root));
  const scope = {
    root, ...colors,
    home: dirUrl(dir, vdir(v)),
    units: ctxUnits, plans: planCtx(), faq: faqCtx(),
    plansNote: ph('valores de Itararé como referência; confirmar na sua unidade'),
    gallery: GALLERY[v].map(([desc, ratio, mt, f]) => ({ kind: 'Foto', desc, reel: false, ratio, mt, img: `${root}img/${f}` })),
    stars: [1, 2, 3, 4, 5].map((n) => ({ n })),
    confetti: confetti(),
    days: dayLabels.map((label, i) => ({
      label,
      lines: units.filter((u) => u.dance.days.includes(i)).map((u) => ({ unit: u.name, time: u.dance.time })),
      has: units.some((u) => u.dance.days.includes(i)),
      none: !units.some((u) => u.dance.days.includes(i)),
    })),
    quotes: [0, 1, 2].map((i) => ({
      i, hidden: i === 0 ? '' : 'hidden', unit: units[i].name,
      img: `${root}img/${['aluna-halter.jpg', 'turma-comemorando.jpg', 'instrutor.jpg'][i]}`,
    })),
    reviewsTotal: String(brand.reviews),
  };
  const html = polish(render(read(`tpl/${v}-home.html`), scope, `${v}-home`));
  write(path.join(dir, 'index.html'), shell({
    v, kind: 'home', dir,
    title: 'Super Treino Academia · Musculação, funcional e dança em Teresina',
    desc: 'Três unidades em Teresina (Itararé, Parque Jurema e Renascença II), com atendimento até as 22:00 nos dias úteis. Veja planos, horários e agende sua aula experimental pelo WhatsApp.',
    ld: jsonLd({
      '@context': 'https://schema.org', '@type': 'Organization', name: brand.name,
      url: SITE_URL || undefined, sameAs: [brand.instagramUrl],
      subOrganization: units.map((u) => ({ '@type': 'HealthClub', name: `${brand.name} ${u.name}` })),
    }),
    body: `<div id="topo-wrap">${html}</div>\n${protoNav(v, 'home', null, dir)}`,
    data: { kind: 'home', units: ctxUnits.map((u) => ({ name: u.name, wa: u.wa, tel: u.tel })) },
  }));
}

function buildUnit(v, u) {
  const dir = unitDir(v, u);
  const root = dirUrl(dir, '');
  const all = units.map((x) => unitCtx(x, v, dir, root));
  const me = all.find((x) => x.slug === u.slug);
  const scope = {
    root, ...colors,
    home: dirUrl(dir, vdir(v)),
    unit: me, units: all, others: all.filter((x) => x.slug !== u.slug),
    plans: planCtx(u), days: me.days,
    gallery: GALLERY[v].map(([alt, , , f]) => ({ img: `${root}img/${f}`, alt, pos: f === 'aluna-pb.jpg' ? '80% 30%' : '50% 50%' })),
    plansNote: u.slug === 'itarare' ? ph('confirmar se os valores seguem vigentes') : ph('valores de Itararé como referência; confirmar nesta unidade'),
  };
  const html = polish(render(read(`tpl/${v}-unit.html`), scope, `${v}-unit`));
  write(path.join(dir, 'index.html'), shell({
    v, kind: 'unit', dir,
    title: `Academia em ${u.name}, Teresina · Super Treino`,
    desc: `Super Treino ${u.name}: ${addrOf(u)}. Musculação, funcional e dança, atendimento até as ${brand.closes} nos dias úteis. Agende sua aula experimental pelo WhatsApp.`,
    ld: jsonLd({
      '@context': 'https://schema.org', '@type': 'HealthClub', name: `${brand.name} ${u.name}`,
      image: SITE_URL ? `${SITE_URL}/img/${u.images[v][0]}` : undefined,
      telephone: `+${u.waNumber}`, url: SITE_URL ? `${SITE_URL}/${dir}/` : undefined,
      address: { '@type': 'PostalAddress', streetAddress: `${u.street} – ${u.district}`, addressLocality: brand.city, addressRegion: brand.state, postalCode: u.cep, addressCountry: 'BR' },
      sameAs: [brand.instagramUrl],
    }),
    body: `<div id="topo-wrap">${html}</div>\n${protoNav(v, 'unit', u, dir)}`,
    data: { kind: 'unit', unit: { name: me.name, wa: me.wa, tel: me.tel } },
  }));
}

function buildChooser() {
  const blurb = {
    a: 'Ingressos picotados, azul royal e amarelo. O mais próximo da marca no Instagram: festa, energia e clima de família.',
    c: 'Fotos em tela cheia e tipografia condensada em fundo escuro. Visual de academia premium, com tabela de planos para comparar.',
    d: 'Preto e branco que ganha cor ao passar o mouse, números grandes e muito amarelo. Direto e esportivo.',
  };
  const cards = Object.entries(VARIANTS).map(([k, m]) => `
    <article class="opt opt-${k}">
      <a class="opt-shot" href="${k}/" aria-label="Abrir ${m.label}, ${m.nome}">
        <img src="previews/${k}-desktop.jpg" alt="Prévia da home da ${m.label}, ${m.nome}" loading="lazy" width="960" height="600">
        <img class="opt-m" src="previews/${k}-mobile.jpg" alt="" loading="lazy" width="200" height="433">
      </a>
      <div class="opt-body">
        <h2>${m.label} <span>${m.nome}</span></h2>
        <p>${blurb[k]}</p>
        <div class="opt-actions"><a class="b-y" href="${k}/">Ver home</a><a class="b-o" href="${k}/unidades/itarare/">Ver unidade</a></div>
      </div>
    </article>`).join('');
  write('index.html', `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Super Treino Academia · Escolha o layout do site</title>
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#0B0B0F">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Figtree:wght@400;600;700&display=swap">
<link rel="stylesheet" href="css/choose.css">
</head>
<body>
<main>
  <header class="top">
    <svg viewBox="0 0 40 24" width="52" height="32" aria-hidden="true"><g fill="currentColor"><rect x="1" y="7" width="5" height="10" rx="1.5"/><rect x="7" y="3" width="6" height="18" rx="2"/><rect x="14" y="10.5" width="12" height="3"/><rect x="27" y="3" width="6" height="18" rx="2"/><rect x="34" y="7" width="5" height="10" rx="1.5"/></g></svg>
    <p>Super Treino Academia</p>
  </header>
  <section class="hero">
    <h1>Três jeitos de apresentar a sua academia.</h1>
    <p>Cada opção é um site completo e navegável: home e uma página para cada unidade, com planos, horários, mapa e WhatsApp. Abra, role, toque nos botões e compare. Em qualquer página dá para trocar de layout pelo seletor no canto da tela.</p>
  </section>
  <section class="opts">${cards}
  </section>
  <footer class="foot">
    <p>Protótipo para escolha do cliente. Fotos provisórias geradas por IA; endereços, telefones, notas e planos de Itararé vêm dos perfis públicos da academia e estão a confirmar. Campos em amarelo ainda esperam informação do proprietário.</p>
  </footer>
</main>
</body>
</html>
`);
}

// ---------- saída ----------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
for (const d of ['img', 'css', 'js', 'previews']) cpSync(path.join(SRC, d), path.join(DIST, d), { recursive: true });
cpSync(path.join(SRC, 'static'), DIST, { recursive: true });

const targets = FINAL ? [FINAL] : Object.keys(VARIANTS);
const urls = [];
for (const v of targets) {
  buildHome(v);
  urls.push(vdir(v) ? `${vdir(v)}/` : '');
  for (const u of units) { buildUnit(v, u); urls.push(`${unitDir(v, u)}/`); }
}
if (FINAL) {
  rmSync(path.join(DIST, 'css', 'choose.css'), { force: true });
  write('robots.txt', `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ''}`);
  if (SITE_URL) {
    write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  }
} else {
  buildChooser();
  write('robots.txt', 'User-agent: *\nDisallow: /\n');
}

console.log(`ok: ${targets.map((t) => t.toUpperCase()).join(' ')} → dist/ (${urls.length} páginas${FINAL ? ', versão final' : ', protótipo'})`);
