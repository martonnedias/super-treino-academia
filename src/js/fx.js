/* Super Treino Academia: interações e efeitos.
 * Tudo aqui é aprimoramento: sem JS o conteúdo continua visível e os links funcionam.
 * Efeitos de movimento respeitam prefers-reduced-motion. */
(() => {
  'use strict';
  const html = document.documentElement;
  const variant = html.dataset.variant;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const ease = (t) => 1 - Math.pow(1 - t, 4);

  let page = {};
  try { page = JSON.parse($('#st-data').textContent); } catch (e) { /* sem dados */ }

  /* ---------- FAQ ---------- */
  $$('[data-acc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
    });
  });

  /* ---------- Grade de aulas: dias ---------- */
  $$('[data-day]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.parentElement;
      $$('[data-day]', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const scope = group.closest('section') || document;
      $$('[data-panel]', scope).forEach((p) => { p.hidden = p.dataset.panel !== btn.dataset.day; });
    });
  });

  /* ---------- Depoimentos (carrossel) ---------- */
  $$('[data-quotes]').forEach((root) => {
    const slides = $$('[data-q]', root);
    const count = Math.max(...slides.map((s) => +s.dataset.q)) + 1;
    const pos = $('[data-q-pos]', root);
    let cur = 0;
    const go = (n) => {
      cur = (n + count) % count;
      slides.forEach((s) => { s.hidden = +s.dataset.q !== cur; });
      if (pos) pos.textContent = `${cur + 1} / ${count}`;
    };
    $('[data-q-prev]', root)?.addEventListener('click', () => go(cur - 1));
    $('[data-q-next]', root)?.addEventListener('click', () => go(cur + 1));
  });


  /* ---------- Formulário de aula experimental: abre o WhatsApp da unidade ---------- */
  $$('[data-wa-form]').forEach((form) => {
    const status = $('.fm-status', form);
    const say = (html) => { status.hidden = false; status.innerHTML = html; };
    const mark = (el, bad) => { if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.elements.nome;
      const unidade = form.querySelector('input[name="unidade"]:checked');
      const bad = [];
      mark(nome, !nome.value.trim());
      if (!nome.value.trim()) bad.push('o seu nome');
      $$('.fm-pill input[name="unidade"]', form).forEach((r) => mark(r.nextElementSibling, !unidade));
      if (!unidade) bad.push('a unidade');
      if (bad.length) { say(`Falta informar ${bad.join(' e ')}.`); status.classList.add('fm-err'); (nome.value.trim() ? form.querySelector('input[name="unidade"]') : nome).focus(); return; }
      status.classList.remove('fm-err');
      const exp = form.querySelector('input[name="experiencia"]:checked');
      const msg = `Olá! Meu nome é ${nome.value.trim()}. Quero agendar uma aula experimental na Super Treino ${unidade.value}. Quero treinar: ${form.elements.objetivo.value}. Melhor horário: ${form.elements.horario.value}.${exp ? ` Experiência: ${exp.value}.` : ''}`;
      const num = (unidade.dataset.wa.match(/wa\.me\/(\d+)/) || [])[1];
      const url = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
      (window.dataLayer = window.dataLayer || []).push({ event: 'form_submit', form: 'aula_experimental', unit: unidade.value, page: location.pathname });
      window.open(url, '_blank', 'noopener');
      say(`Abrimos o WhatsApp da ${unidade.value}. Se não abriu, <a href="${url}" target="_blank" rel="noopener">toque aqui para enviar a mensagem</a>.`);
    });
  });


  /* ---------- Acessibilidade extra ---------- */
  // Rolagem horizontal alcançável pelo teclado
  $$('.rail').forEach((r) => {
    const h = r.closest('section') && $('h2', r.closest('section'));
    r.setAttribute('tabindex', '0');
    r.setAttribute('role', 'region');
    r.setAttribute('aria-label', `${h ? h.textContent.replace(/\s+/g, ' ').trim() + ': ' : ''}role para o lado para ver mais`);
  });
  // Links que abrem em nova aba avisam leitores de tela
  $$('a[target="_blank"]').forEach((a) => {
    const note = ' (abre em nova aba)';
    const al = a.getAttribute('aria-label');
    if (al) a.setAttribute('aria-label', al + note);
    else { const s = document.createElement('span'); s.className = 'sr-only'; s.textContent = note; a.appendChild(s); }
  });
  // Carrossel de depoimentos anuncia a troca
  $$('[data-q-pos]').forEach((p) => { p.setAttribute('role', 'status'); p.setAttribute('aria-live', 'polite'); });
  // Campo com erro aponta para a mensagem
  $$('[data-wa-form] input[name="nome"]').forEach((n) => n.setAttribute('aria-describedby', 'fm-status'));
  // Letreiro em movimento precisa de controle para pausar (WCAG 2.2.2)
  if (!reduce) {
    $$('.mq').forEach((mq) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mq-pause';
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="sr-only">Pausar animação do letreiro</span><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path class="ic-pause" fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/><path class="ic-play" fill="currentColor" d="M8 5v14l11-7z" style="display:none"/></svg>';
      b.addEventListener('click', () => {
        const on = mq.classList.toggle('paused');
        b.setAttribute('aria-pressed', String(on));
        $('.sr-only', b).textContent = on ? 'Retomar animação do letreiro' : 'Pausar animação do letreiro';
        $('.ic-pause', b).style.display = on ? 'none' : '';
        $('.ic-play', b).style.display = on ? '' : 'none';
      });
      mq.appendChild(b);
    });
  }

  /* ---------- Menu mobile ---------- */
  $$('details.nav-m').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target.closest('a')) d.open = false; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && d.open) { d.open = false; $('summary', d)?.focus(); } });
  });

  /* ---------- Onda no clique nos botões ---------- */
  if (!reduce) {
    document.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('.btn');
      if (!b) return;
      const r = b.getBoundingClientRect();
      const d = Math.max(r.width, r.height) * 2;
      const w = document.createElement('span');
      w.className = 'fx-ripple';
      w.setAttribute('aria-hidden', 'true');
      w.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      b.appendChild(w);
      w.addEventListener('animationend', () => w.remove());
    }, { passive: true });
  }

  /* ---------- Eventos de conversão (GA4 / GTM, se instalados) ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    let method = null;
    if (href.startsWith('https://wa.me/')) method = 'whatsapp';
    else if (href.startsWith('tel:')) method = 'ligar';
    else if (href.includes('google.com/maps')) method = 'rota';
    if (!method) return;
    let unit = '';
    try { unit = (decodeURIComponent(href).match(/Super Treino ([^.&]+)/) || [])[1] || page.unit?.name || ''; } catch (err) { /* ignore */ }
    (window.dataLayer = window.dataLayer || []).push({ event: 'contact_click', method, unit, page: location.pathname });
  });

  /* ---------- Botão flutuante de WhatsApp (desktop) ---------- */
  const waIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6L3 21z"/></svg>';
  const fab = document.createElement('aside');
  fab.className = 'wa-fab';
  fab.setAttribute('aria-label', 'Agendar pelo WhatsApp');
  if (page.kind === 'unit' && page.unit) {
    fab.innerHTML = `<a class="wa-btn" href="${page.unit.wa}" target="_blank" rel="noopener">${waIcon}<span>Agendar na ${page.unit.name}</span></a>`;
  } else if (page.units) {
    fab.innerHTML = `<div class="wa-menu" id="wa-menu" hidden><p>Escolha a unidade</p>${page.units.map((u) => `<a href="${u.wa}" target="_blank" rel="noopener">${u.name}<span>Aula experimental</span></a>`).join('')}</div><button type="button" class="wa-btn" aria-expanded="false" aria-controls="wa-menu">${waIcon}<span>Agendar aula</span></button>`;
    const btn = $('.wa-btn', fab);
    const menu = $('.wa-menu', fab);
    const toggle = (open) => { btn.setAttribute('aria-expanded', String(open)); menu.hidden = !open; };
    btn.addEventListener('click', () => toggle(menu.hidden));
    document.addEventListener('click', (e) => { if (!fab.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  }
  if (fab.firstChild) document.body.appendChild(fab);

  /* ---------- Progresso de rolagem + estado do cabeçalho ---------- */
  const bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = html.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      html.classList.toggle('fx-scrolled', y > 24);
      html.classList.toggle('fx-past-hero', y > innerHeight * 0.55);
      html.style.setProperty('--sy', y.toFixed(0));
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Contagem de números ---------- */
  const fmt = (n, dec) => n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const counters = $$('[data-count]');
  const runCount = (el) => {
    const to = parseFloat(el.dataset.count);
    const dec = +(el.dataset.dec || 0);
    const t0 = performance.now();
    const dur = 1300;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(to * ease(t), dec);
      if (t < 1) requestAnimationFrame(step); else el.textContent = fmt(to, dec);
    };
    requestAnimationFrame(step);
  };

  if (reduce) return; // abaixo: somente efeitos de movimento

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('fx-in');
      if (el.hasAttribute('data-count')) runCount(el);
      io.unobserve(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

  counters.forEach((el) => { el.style.fontVariantNumeric = 'tabular-nums'; io.observe(el); });

  /* ---------- Revelação por rolagem ---------- */
  const hero = $('main > section:first-child');
  const sel = [
    'main .wrap > *', 'article', 'figure', '.tkw', '.ucard', '.gcell', '.row', '.drow', '.orow', '.mod', '.hrow', '.lineup',
    '.strip > *', '.bub', '.cmp',
  ].join(',');
  const seen = new Set();
  $$(sel).forEach((el) => {
    if (seen.has(el) || (hero && hero.contains(el)) || el.closest('.rail, table, nav, details, header, footer, .proto, .wa-fab')) return;
    if (el.parentElement && el.parentElement.closest('.fx-r')) return; // só o container mais externo
    seen.add(el);
    const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => seen.has(c)) : [];
    el.style.setProperty('--d', Math.min(5, Math.max(0, sibs.indexOf(el))));
    el.classList.add('fx-r');
    io.observe(el);
  });
  setTimeout(() => $$('.fx-r:not(.fx-in)').forEach((el) => { if (el.getBoundingClientRect().top < innerHeight * 1.5) el.classList.add('fx-in'); }), 2500);

  /* ---------- Títulos em máscara (C e D) ---------- */
  if (variant === 'c' || variant === 'd') {
    $$('main h1, main h2').forEach((h) => {
      h.classList.remove('fx-r');
      let i = 0;
      const walk = (node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((p) => {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
              const w = document.createElement('span');
              w.className = 'fx-w';
              const inner = document.createElement('span');
              inner.className = 'fx-wi';
              inner.style.setProperty('--i', i++);
              inner.textContent = p;
              w.appendChild(inner);
              frag.appendChild(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
        });
      };
      walk(h);
      h.classList.add('fx-split');
      if (hero && hero.contains(h)) requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('fx-in')));
      else io.observe(h);
    });
  }

  /* ---------- Paralaxe suave (via variável --sy, ver fx.css) ---------- */
  $$(variant === 'c' ? '.kb' : variant === 'd' ? '.hero-img' : '.g-photo .print').forEach((el) => el.classList.add('fx-par'));

  /* Opção D: fotos em preto e branco ganham cor ao chegar no centro da tela */
  if (variant === 'd') {
    const colorIo = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle('fx-color', en.isIntersecting)), { threshold: 0.6 });
    $$('.bw').forEach((el) => colorIo.observe(el));
  }

  if (!fine) return; // abaixo: efeitos que dependem de mouse

  /* ---------- Lanterna e ímã (C) ---------- */
  if (variant === 'c') {
    $$('.btn-y, .btn-k').forEach((b) => {
      if (b.closest('.bar-m, .proto')) return;
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.translate = `${(x * 10).toFixed(1)}px ${(y * 8).toFixed(1)}px`;
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
    $$('main > section:first-child > div:first-child, .ucard').forEach((el) => {
      el.classList.add('fx-spot');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Ingressos 3D e confete (A) ---------- */
  if (variant === 'a') {
    $$('.tkw[data-tilt], .g-tick .tkw').forEach((el) => {
      el.classList.add('fx-tilt');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    const cv = document.createElement('canvas');
    cv.className = 'fx-confetti';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const css = getComputedStyle($('.st') || html);
    const palette = ['--yellow', '--orange', '--blue'].map((v) => css.getPropertyValue(v).trim() || '#FFC400').concat('#FFFFFF');
    let parts = [];
    let raf = 0;
    const fit = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
    fit();
    addEventListener('resize', fit);
    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts = parts.filter((p) => p.life > 0 && p.y < cv.height + 40);
      parts.forEach((p) => {
        p.vy += 0.32 * devicePixelRatio; p.vx *= 0.992; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 1;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.life / 30);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };
    const burst = (x, y) => {
      const d = devicePixelRatio;
      for (let i = 0; i < 72; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = (4 + Math.random() * 9) * d;
        parts.push({ x: x * d, y: y * d, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6 * d, w: (6 + Math.random() * 7) * d, h: (4 + Math.random() * 5) * d, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: palette[i % palette.length], life: 70 + Math.random() * 40 });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="https://wa.me/"]');
      if (a) burst(e.clientX, e.clientY);
    });
  }

  /* ---------- Cursor e cor ao rolar (D) ---------- */
  if (variant === 'd') {
    const ring = document.createElement('div');
    ring.className = 'fx-cursor';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    let tx = -100, ty = -100, x = -100, y = -100;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; ring.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerleave', () => ring.classList.remove('on'));
    const loop = () => { x += (tx - x) * 0.2; y += (ty - y) * 0.2; ring.style.transform = `translate(${x}px, ${y}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerover', (e) => ring.classList.toggle('big', Boolean(e.target.closest('a, button, summary'))));
  }
})();
