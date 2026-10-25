// raysan-ui · docs/guidelines.js
// Builds the swatches, type specimen, shape and spacing rows from the live
// tokens, so the guidelines never drift from tokens.css. Re-runs on theme change.
(() => {
  const root = document.documentElement;
  const tok = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  // ---------- Contrast (WCAG 2.x) ----------
  const toRgb = (v) => {
    const probe = document.createElement('span');
    probe.style.color = v;
    document.body.append(probe);
    const m = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
    probe.remove();
    return m.slice(0, 3);
  };
  const lum = ([r, g, b]) => {
    const c = [r, g, b].map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(toRgb(a)), lum(toRgb(b))].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const badge = (r) => {
    const cls = r >= 4.5 ? 'pass' : r >= 3 ? 'large' : 'fail';
    const txt = r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Low';
    return `<span class="g-badge ${cls}" title="Contrast ${r.toFixed(2)}:1">${txt} · ${r.toFixed(1)}</span>`;
  };

  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };

  const onFor = (role) => {
    if (role === 'inverse-surface') return 'inverse-on-surface';
    if (role.startsWith('surface')) return 'on-surface';
    if (role.endsWith('-container')) return 'on-' + role;
    return 'on-' + role;
  };

  const build = () => {
    // Role swatches: fill + on color + live contrast
    document.querySelectorAll('[data-swatches]').forEach((grid) => {
      grid.replaceChildren(...grid.dataset.swatches.split(' ').map((role) => {
        const on = onFor(role);
        const bg = tok('--md-' + role), fg = tok('--md-' + on);
        return el(`<div class="g-swatch">
          <div class="face" style="background:var(--md-${role});color:var(--md-${on})"><b>Aa</b>${badge(ratio(fg, bg))}</div>
          <div class="meta"><strong>${role}</strong><span>${bg} · text: ${on}</span></div></div>`);
      }));
    });

    // Text and line colors, measured against the page surface
    document.querySelectorAll('[data-text-swatches]').forEach((grid) => {
      const surface = tok('--md-surface');
      grid.replaceChildren(...grid.dataset.textSwatches.split(' ').map((role) => {
        const v = tok('--md-' + role);
        const isLine = role.startsWith('outline');
        const face = isLine
          ? `<div class="face" style="background:var(--md-surface);border-bottom:4px solid var(--md-${role})"><b style="color:var(--md-on-surface)">—</b>${role === 'outline' ? badge(ratio(v, surface)) : ''}</div>`
          : `<div class="face" style="background:var(--md-surface);color:var(--md-${role})"><b>Aa</b>${badge(ratio(v, surface))}</div>`;
        const use = { 'on-surface': 'Body text, headings', 'on-surface-variant': 'Secondary text, captions', 'outline': 'Input borders, strong dividers', 'outline-variant': 'Card borders, dividers' }[role];
        return el(`<div class="g-swatch">${face}<div class="meta"><strong>${role}</strong><span>${v} · ${use}</span></div></div>`);
      }));
    });

    // Brand accents: pick the more readable of near-black or white text
    document.querySelectorAll('[data-accents]').forEach((grid) => {
      grid.replaceChildren(...grid.dataset.accents.split(' ').map((name) => {
        const v = tok('--' + name);
        const dark = '#10223f', light = '#ffffff';
        const rd = ratio(dark, v), rl = ratio(light, v);
        const fg = rd >= rl ? dark : light;
        return el(`<div class="g-swatch">
          <div class="face" style="background:var(--${name});color:${fg}"><b>Aa</b>${badge(Math.max(rd, rl))}</div>
          <div class="meta"><strong>${name.replace('rd-', '')}</strong><span>${v} · --${name}</span></div></div>`);
      }));
    });
  };

  // ---------- Type specimen ----------
  const typeRoles = [
    ['display-l', 'Raysan', 'Hero titles'], ['display-m', 'Raysan Designs', 'Page titles'],
    ['headline-l', 'Section heading', 'Major sections'], ['headline-m', 'Section heading', 'Sub-sections'],
    ['headline-s', 'Card title', 'Bold sub-sections'], ['title-l', 'Brand name, large titles', 'App bar, dialogs'],
    ['title-m', 'List and card titles', 'Lists, field groups'], ['title-s', 'Small titles', 'Dense lists, tables'],
    ['body-l', 'The quick brown fox jumps over the lazy dog.', 'Default reading text'],
    ['body-m', 'The quick brown fox jumps over the lazy dog.', 'Descriptions, captions'],
    ['label-l', 'Button label', 'Buttons, tabs, chips'], ['label-m', 'OVERLINE LABEL', 'Overlines, badges']
  ];
  const ts = document.getElementById('type-scale');
  typeRoles.forEach(([role, sample, use]) => {
    const row = el(`<div class="g-type-row"><div class="spec"><code>${role}</code><span data-spec>${use}</span></div><div class="sample ${role}">${sample}</div></div>`);
    ts.append(row);
  });
  const fillSpecs = () => ts.querySelectorAll('.g-type-row').forEach((row, i) => {
    const s = getComputedStyle(row.querySelector('.sample'));
    const fam = s.fontFamily.split(',')[0].replace(/"/g, '');
    row.querySelector('[data-spec]').textContent = `${parseFloat(s.fontSize)}/${parseFloat(s.lineHeight) || '—'} · ${s.fontWeight} · ${fam} — ${typeRoles[i][2]}`;
  });

  // ---------- Shape ----------
  const sh = document.getElementById('shapes');
  ['xs', 's', 'm', 'l', 'xl', 'full'].forEach((s) => {
    sh.append(el(`<div class="g-shape"><div style="border-radius:var(--shape-${s})"></div><span>${s} · ${tok('--shape-' + s)}</span></div>`));
  });

  // ---------- Spacing ----------
  const sp = document.getElementById('spacing');
  [4, 8, 12, 16, 24, 32, 48].forEach((n) => sp.append(el(`<div class="g-space-row"><code>${n}px</code><div style="width:${n * 4}px;max-width:100%"></div></div>`)));

  // ---------- Motion demo ----------
  const track = document.getElementById('motion-track');
  document.getElementById('motion-play').addEventListener('click', () => {
    track.style.setProperty('--track-w', track.clientWidth + 'px');
    track.classList.toggle('go');
  });

  // ---------- Contents: highlight the section in view ----------
  const links = [...document.querySelectorAll('.g-toc a')];
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      const a = byId.get(e.target.id);
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('.g-section').forEach((s) => io.observe(s));

  const refresh = () => { build(); fillSpecs(); };
  refresh();
  document.addEventListener('themechange', () => requestAnimationFrame(refresh));
  if (document.fonts) document.fonts.ready.then(fillSpecs);
})();
