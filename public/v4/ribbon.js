/* v4 #work: three.js ribbon of project cards.
   One number (section scroll progress) drives everything: p eases toward the scroll target, the head of the
   ribbon moves along a fixed rail and every card is re-laid along it. Card count is read from the DOM.
   Fallback (no WebGL, reduced motion, narrow screens, three.js failing to load) is the plain HTML card list. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

/* The Vercel flag "film-reel" (read through /api/flags) picks the film reel or the plain cards.
   ?film=1 or ?film=0 in the URL overrides it for previews. Any failure or a slow answer means plain cards. */
const FILM_FLAG = await (async function () {
  var q = new URLSearchParams(location.search).get('film');
  if (q === '1' || q === '0') return q === '1';
  try {
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 1500);
    var r = await fetch('/api/flags', { signal: ctl.signal });
    clearTimeout(t);
    return r.ok ? !!(await r.json()).filmReel : false;
  } catch (e) { return false; }
})();

(function () {
  var sec = document.getElementById('work');
  var list = sec && sec.querySelector('[data-wk-pin]');
  var cards = sec ? Array.prototype.slice.call(sec.querySelectorAll('[data-wk-card]')) : [];
  if (!sec || !list || !cards.length) return;

  /* tuning */
  var VH_PER_CARD = 34;      /* scroll length per card, vh */
  var SMOOTH = 0.09;         /* per-frame (60 Hz) easing of progress toward the scroll target */
  var SWAP_MS = 2000;        /* screenshot change interval for cards with several images */
  var FILM = FILM_FLAG;      /* film reel or plain cards, from the film-reel flag (see the top of this file) */
  var FILM_BAND = 0.075;     /* film border above and below the picture, as a share of the frame height */
  var CARD_W = 2.6, CARD_H = FILM ? 1.635 / (1 - 2 * FILM_BAND) : 1.635, GAP = FILM ? 0 : 0.03, STEP = CARD_W + GAP;   /* film keeps the picture the same size and adds the border */
  var NX = 28, NY = 3;

  var mqW = window.matchMedia('(min-width: 760px)');
  var mqR = window.matchMedia('(prefers-reduced-motion: reduce)');

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function span(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function mix(a, b, t) { return a + (b - a) * t; }

  /* ---------- rail (built once) ---------- */
  var rail = (function () {
    var pts = [], k, S = 161;
    for (k = 0; k < S; k++) {
      var t = k / (S - 1);
      var ph = mix(-1.5, Math.PI * 2 + 1.35, t);
      var cs = Math.cos(ph);
      var depth = cs > 0 ? 7.6 + 16.4 * Math.pow(cs, 0.9) : 7.6 + 2.2 * cs;
      var edge = 0.84 + 0.5 * span(0.14 - t, 0, 0.14) + 0.8 * span(t, 0.84, 1);
      var u = 2 * t - 1;
      pts.push(new THREE.Vector3(edge * Math.sin(ph) * depth * 0.561, 0.5 * Math.sign(u) * Math.pow(Math.abs(u), 1.4) * depth * 0.63, -depth));
    }
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    curve.arcLengthDivisions = 1500;
    var M = 1201, P = new Float32Array(M * 3), T = new Float32Array(M * 3);
    var L = curve.getLength(), nearIdx = 0, bestD = 1e9;
    for (k = 0; k < M; k++) {
      var q = curve.getPointAt(k / (M - 1)), tg = curve.getTangentAt(k / (M - 1));
      P[k * 3] = q.x; P[k * 3 + 1] = q.y; P[k * 3 + 2] = q.z;
      T[k * 3] = tg.x; T[k * 3 + 1] = tg.y; T[k * 3 + 2] = tg.z;
      if (-q.z < bestD) { bestD = -q.z; nearIdx = k; }
    }
    var o = { L: L, near: nearIdx / (M - 1) * L, px: 0, py: 0, pz: 0, tx: 0, ty: 0, tz: 0 };
    o.at = function (s) {
      var f = clamp(s / L, 0, 1) * (M - 1), i = Math.min(Math.floor(f), M - 2), r = f - i, a = i * 3, b = a + 3;
      o.px = mix(P[a], P[b], r); o.py = mix(P[a + 1], P[b + 1], r); o.pz = mix(P[a + 2], P[b + 2], r);
      var x = mix(T[a], T[b], r), y = mix(T[a + 1], T[b + 1], r), z = mix(T[a + 2], T[b + 2], r);
      var n = Math.hypot(x, y, z) || 1;
      o.tx = x / n; o.ty = y / n; o.tz = z / n;
    };
    return o;
  })();

  var VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
  var FRAG = [
    'uniform sampler2D uMap; uniform sampler2D uPrev; uniform vec2 uCov; uniform vec2 uCovPrev;',
    'uniform float uMix; uniform float uReady; varying vec2 vUv;',
    'const vec2 SZ = vec2(' + CARD_W.toFixed(2) + ',' + CARD_H.toFixed(2) + ');',
    'void main(){',
    '  vec2 uv = vUv; if(!gl_FrontFacing) uv.x = 1. - uv.x;',
    '  vec2 p = (vUv - .5) * SZ; float r = .018;',
    '  vec2 d = abs(p) - (SZ * .5 - r);',
    '  float sd = length(max(d, 0.)) + min(max(d.x, d.y), 0.) - r;',
    '  float aa = max(fwidth(sd), 1e-5);',
    '  float a = 1. - smoothstep(-aa, aa, sd);',
    '  if(a < .003) discard;',
    '  vec3 c0 = texture2D(uMap, (uv - .5) * uCov + .5).rgb;',
    '  vec3 c1 = texture2D(uPrev, (uv - .5) * uCovPrev + .5).rgb;',
    '  vec3 col = mix(c0, c1, uMix);',
    '  col = mix(vec3(.075), col, uReady);',
    '  col += vec3(.55) * smoothstep(-.014, -.001, sd) * .22;',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n');

  var FILM_FRAG = [
    'uniform sampler2D uMap; uniform sampler2D uPrev; uniform vec2 uCov; uniform vec2 uCovPrev;',
    'uniform float uMix; uniform float uReady; uniform vec3 uFilm; varying vec2 vUv;',
    'const vec2 SZ = vec2(' + CARD_W.toFixed(3) + ',' + CARD_H.toFixed(3) + ');',
    'const float BAND = ' + FILM_BAND.toFixed(3) + ';',
    'float hash(vec2 q){ return fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453); }',
    'float rbox(vec2 q, vec2 h, float r){ vec2 d = abs(q) - h + r; return length(max(d, 0.)) + min(max(d.x, d.y), 0.) - r; }',
    'void main(){',
    '  vec2 uv = vUv; if(!gl_FrontFacing) uv.x = 1. - uv.x;',
    '  vec2 p = (uv - .5) * SZ;',
    /* sprocket holes: 8 per frame in each band, punched through (discard) so the page shows behind */
    '  float bandH = SZ.y * BAND; float yb = SZ.y * .5 - bandH * .5;',
    '  float pitch = SZ.x / 10.; float hx = mod(p.x + SZ.x * .5, pitch) - pitch * .5;',
    '  float hole = rbox(vec2(hx, abs(p.y) - yb), vec2(pitch * .2, bandH * .27), .012);',
    '  if (abs(p.y) > SZ.y * .5 - bandH && hole < 0.) discard;',
    /* picture window, with a thin black gutter between frames */
    '  float py = (uv.y - BAND) / (1. - 2. * BAND);',
    '  float gut = .03 / SZ.x; float px = (uv.x - gut) / (1. - 2. * gut);',
    '  vec3 film = uFilm;',
    '  vec3 col = film;',
    '  if (py > 0. && py < 1. && px > 0. && px < 1.) {',
    '    vec2 q = vec2(px, py);',
    '    vec3 c0 = texture2D(uMap, (q - .5) * uCov + .5).rgb;',
    '    vec3 c1 = texture2D(uPrev, (q - .5) * uCovPrev + .5).rgb;',
    '    col = mix(mix(vec3(.075), mix(c0, c1, uMix), uReady), film, 0.);',
    '    vec2 e = q - .5; col *= 1. - dot(e, e) * .35;',                  /* gentle vignette per frame */
    '  } else {',
    '    float edge = step(abs(p.y), SZ.y * .5 - .012);',                 /* faint highlight on the film edge */
    '    col += vec3(.06) * (1. - edge);',
    '  }',
    '  col += (hash(floor(uv * vec2(900., 560.))) - .5) * .045;',          /* film grain */
    '  gl_FragColor = vec4(col, 1.);',
    '}'
  ].join('\n');
  if (FILM) FRAG = FILM_FRAG;

  var live = null;   /* current mounted ribbon, or null */

  function webglOk() {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
  }

  function mount() {
    if (live || !mqW.matches || mqR.matches || !webglOk()) return;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch (e) { return; }
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var N = cards.length;
    /* DOM: track > sticky stage > canvas + panel + progress. Card list stays in the DOM, visually hidden. */
    var track = document.createElement('div');
    track.className = 'wk-rtrack';
    track.style.setProperty('--wk-n', String(N));
    var stage = document.createElement('div');
    stage.className = 'wk-rstage';
    var canvas = renderer.domElement;
    canvas.className = 'wk-rcanvas';
    canvas.setAttribute('aria-hidden', 'true');
    var panel = document.createElement('div');
    panel.className = 'wk-rpanel';
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-atomic', 'true');
    var panelIn = document.createElement('div');
    panelIn.className = 'wk-rpanel__in';
    panel.appendChild(panelIn);
    var prog = document.createElement('div');
    prog.className = 'wk-rprog';
    prog.setAttribute('aria-hidden', 'true');
    var progBar = document.createElement('i');
    prog.appendChild(progBar);
    /* a small cat runs along the progress line and plays with a ball of yarn (black in light theme, white in dark) */
    var cat = document.createElement('span');
    cat.className = 'wk-cat'; cat.setAttribute('aria-hidden', 'true');
    cat.innerHTML = '<span class="wk-cat__yarn"><svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="5.2"/><path d="M2 4.5c2.5 1.2 5.5 1.2 8 0M1.6 7.2c2.8 1.4 6 1.4 8.8 0M4.2 1.4c1.6 2.6 1.6 6.6 0 9.2"/></svg></span>' +
      '<svg class="wk-cat__body" viewBox="0 0 40 26">' +
      '<path class="wk-cat__tail" d="M6 13c-4-1-6-5-4-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
      '<g class="wk-cat__legs"><rect class="l1" x="9" y="15" width="3" height="9" rx="1.5"/><rect class="l2" x="13" y="15" width="3" height="9" rx="1.5"/>' +
      '<rect class="l3" x="22" y="15" width="3" height="9" rx="1.5"/><rect class="l4" x="26" y="15" width="3" height="9" rx="1.5"/></g>' +
      '<ellipse cx="18" cy="14" rx="12" ry="6.5"/>' +
      '<g class="wk-cat__head"><circle cx="31" cy="9" r="6"/><path d="M26.6 5.2 27.4 -.6 30.8 3.6zM31.4 3.4 35 -.4 35.4 5z"/>' +
      '<circle class="wk-cat__eye" cx="33.4" cy="8.4" r="1"/></g></svg>';
    prog.appendChild(cat);
    var catLastP = 0, catIdle = 0;
    stage.appendChild(canvas); stage.appendChild(panel); stage.appendChild(prog);
    track.appendChild(stage);
    list.parentNode.insertBefore(track, list);
    sec.classList.add('wk-ribbon');
    var tabbed = Array.prototype.slice.call(list.querySelectorAll('a'));
    tabbed.forEach(function (a) { a.setAttribute('tabindex', '-1'); });

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.1, 100);
    var dummy = new THREE.DataTexture(new Uint8Array([19, 19, 19, 255]), 1, 1);
    dummy.needsUpdate = true;

    /* ---------- cards ---------- */
    var loader = new THREE.TextureLoader();
    /* film base: charcoal on a dark page so the sprocket holes read, near-black on a light page */
    function filmTone() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? new THREE.Color(0.055, 0.05, 0.048) : new THREE.Color(0.2, 0.195, 0.19);
    }
    function coverOf(tex) {
      var picH = FILM ? CARD_H * (1 - 2 * FILM_BAND) : CARD_H, picW = FILM ? CARD_W - 0.06 : CARD_W;
      var ia = tex && tex.image && tex.image.width ? tex.image.width / tex.image.height : picW / picH, ca = picW / picH;
      return ia > ca ? new THREE.Vector2(ca / ia, 1) : new THREE.Vector2(1, ia / ca);
    }
    var items = cards.map(function (el, i) {
      var geo = new THREE.PlaneGeometry(1, 1, NX, NY);
      var mat = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG, transparent: true, side: THREE.DoubleSide,
        uniforms: {
          uMap: { value: dummy }, uPrev: { value: dummy },
          uCov: { value: new THREE.Vector2(1, 1) }, uCovPrev: { value: new THREE.Vector2(1, 1) },
          uMix: { value: 0 }, uReady: { value: 0 }, uFilm: { value: filmTone() }
        }
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      mesh.visible = false;
      scene.add(mesh);
      var urls = (el.getAttribute('data-tex') || '').split('|').filter(Boolean);
      var it = { el: el, mesh: mesh, mat: mat, pos: geo.attributes.position, urls: urls, tex: [], loading: [], cur: 0, t: 0, mix: 0, s: -1e9, cover: [] };
      it.load = function (k) {
        if (k >= urls.length || it.tex[k] || it.loading[k]) return;
        it.loading[k] = true;
        loader.load(urls[k], function (tx) {
          tx.colorSpace = THREE.NoColorSpace;
          tx.minFilter = THREE.LinearFilter; tx.magFilter = THREE.LinearFilter;
          tx.generateMipmaps = false;
          it.tex[k] = tx; it.cover[k] = coverOf(tx);
          if (k === it.cur) {
            mat.uniforms.uMap.value = tx; mat.uniforms.uCov.value = it.cover[k];
            mat.uniforms.uPrev.value = tx; mat.uniforms.uCovPrev.value = it.cover[k];
            mat.uniforms.uReady.value = 1;
          }
        }, undefined, function () { it.loading[k] = false; });
      };
      it.swap = function (k) {
        var u = mat.uniforms;
        u.uPrev.value = u.uMap.value; u.uCovPrev.value = u.uCov.value;
        u.uMap.value = it.tex[k]; u.uCov.value = it.cover[k];
        u.uMix.value = 1; it.mix = 1; it.cur = k;
      };
      it.load(0);
      return it;
    });

    /* ---------- front-card panel ---------- */
    var shown = -1, panelTok = 0, panelOn = false;
    function showPanel(i) {
      if (i === shown) return;
      shown = i;
      var tok = ++panelTok;
      panelIn.classList.add('is-out');
      setTimeout(function () {
        if (tok !== panelTok) return;
        panelIn.textContent = '';
        var body = items[i].el.querySelector('.wk-body');
        if (body) {
          var c = body.cloneNode(true);
          c.className = 'wk-body wk-body--panel';
          panelIn.appendChild(c);
        }
        panelIn.classList.remove('is-out');
      }, 140);
    }
    function setPanelVisible(on) {
      if (on === panelOn) return;
      panelOn = on;
      panel.classList.toggle('is-on', on);
    }

    /* ---------- size ---------- */
    var W = 1, H = 1;
    function resize() {
      var r = stage.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      renderer.setSize(W, H, false);
      var aspect = W / H;
      camera.aspect = aspect;
      camera.fov = aspect < 16 / 9 ? Math.atan(0.561 / aspect) * 360 / Math.PI : 35;
      camera.updateProjectionMatrix();
    }
    var ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    /* ---------- frame ---------- */
    var p = 0, target = 0, visible = false, raf = 0, last = 0, cur = 0;
    var head, i, ix, iy;
    var colX = new Float32Array((NX + 1) * 3), colU = new Float32Array((NX + 1) * 3);

    function readTarget() {
      var r = track.getBoundingClientRect();
      var total = track.offsetHeight - window.innerHeight;
      return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    }

    function layout(it, s) {
      var pos = it.pos.array;
      for (ix = 0; ix <= NX; ix++) {
        rail.at(s + (ix / NX - 0.5) * CARD_W);
        var tx = rail.tx, ty = rail.ty, tz = rail.tz;
        var ux = -ty * tx, uy = 1 - ty * ty, uz = -ty * tz;
        var n = Math.hypot(ux, uy, uz) || 1;
        ux /= n; uy /= n; uz /= n;
        colX[ix * 3] = rail.px; colX[ix * 3 + 1] = rail.py; colX[ix * 3 + 2] = rail.pz;
        colU[ix * 3] = ux; colU[ix * 3 + 1] = uy; colU[ix * 3 + 2] = uz;
      }
      var k = 0;
      for (iy = 0; iy <= NY; iy++) {
        var v = (0.5 - iy / NY) * CARD_H;
        for (ix = 0; ix <= NX; ix++) {
          pos[k++] = colX[ix * 3] + colU[ix * 3] * v;
          pos[k++] = colX[ix * 3 + 1] + colU[ix * 3 + 1] * v;
          pos[k++] = colX[ix * 3 + 2] + colU[ix * 3 + 2] * v;
        }
      }
      it.pos.needsUpdate = true;
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      target = readTarget();
      var k = 1 - Math.pow(1 - SMOOTH, dt * 60);
      p += (target - p) * k;
      if (Math.abs(target - p) < 0.00005) p = target;

      /* start with the first card centred at the front and end on the last */
      head = rail.near + span(p, 0, 1) * (N - 1) * STEP;   /* continuous: no hold, so scrolling stays fluid */
      var best = -1, bestD = 1e9;
      for (i = 0; i < N; i++) {
        var it = items[i];
        var s = head - i * STEP;
        it.s = s;
        var vis = s > CARD_W && s < rail.L - CARD_W;
        if (it.mesh.visible !== vis) it.mesh.visible = vis;
        if (!vis) continue;
        layout(it, s);
        var d = Math.abs(s - rail.near);
        if (d < bestD) { bestD = d; best = i; }
        /* several screenshots: every visible card cycles, staggered so they don't all change on the same frame */
        if (it.urls.length > 1) {
          var nx = (it.cur + 1) % it.urls.length;
          it.load(nx);
          if (!it.t) it.t = now - (i * 370) % SWAP_MS;
          if (now - it.t > SWAP_MS && it.tex[nx]) { it.swap(nx); it.t = now; }
        }
        if (it.mix > 0) {
          it.mix = Math.max(0, it.mix - dt / 0.7);
          var e = it.mix; it.mat.uniforms.uMix.value = e * e * (3 - 2 * e);
        }
      }
      if (best >= 0) {
        cur = best;
        showPanel(best);
        setPanelVisible(bestD < STEP * 2.2);
      } else {
        cur = -1;
        setPanelVisible(false);
      }
      progBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var dp = p - catLastP; catLastP = p;
      cat.style.left = (p * 100).toFixed(3) + '%';
      if (Math.abs(dp) > 0.00008) { cat.classList.add('is-run'); cat.classList.toggle('is-back', dp < 0); catIdle = 0; }
      else if (++catIdle > 14) cat.classList.remove('is-run');
      renderer.render(scene, camera);
    }

    function run() { if (!raf) { last = 0; p = readTarget(); raf = requestAnimationFrame(frame); } }
    function halt() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    var io = new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) run(); else halt();
    }, { rootMargin: '100px 0px' });
    io.observe(track);

    /* ---------- click on the front card opens its first link ---------- */
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function hit(e) {
      if (cur < 0 || !panelOn) return null;
      var r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      var m = items[cur].mesh;
      m.geometry.computeBoundingSphere();
      if (!ray.intersectObject(m, false).length) return null;
      return items[cur].el.querySelector('a.wk-link');
    }
    function onMove(e) { canvas.style.cursor = hit(e) ? 'pointer' : ''; }
    function onClick(e) {
      var a = hit(e);
      if (a) window.open(a.href, a.target === '_blank' ? '_blank' : '_self', 'noopener');
    }
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('click', onClick);
    /* the theme toggle flips data-theme on <html>: retint the film to match */
    var themeObs = new MutationObserver(function () { var t = filmTone(); items.forEach(function (it) { it.mat.uniforms.uFilm.value = t; }); });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    live = {
      destroy: function () {
        halt(); io.disconnect(); ro.disconnect(); themeObs.disconnect();
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('click', onClick);
        items.forEach(function (it) { it.mesh.geometry.dispose(); it.mat.dispose(); it.tex.forEach(function (t) { if (t) t.dispose(); }); });
        dummy.dispose(); renderer.dispose();
        tabbed.forEach(function (a) { a.removeAttribute('tabindex'); });
        sec.classList.remove('wk-ribbon');
        track.remove();
      }
    };
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function unmount() {
    if (!live) return;
    live.destroy(); live = null;
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function sync() { if (mqW.matches && !mqR.matches) mount(); else unmount(); }
  function listen(mq) { if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync); }
  listen(mqW); listen(mqR);
  sync();
})();
