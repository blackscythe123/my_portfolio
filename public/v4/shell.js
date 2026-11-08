/* v4 shell: nav + motion layer.
   Data attributes (usable by any section):
     [data-split]            line/word mask reveal on enter (children [data-line] are used as the lines, else words are grouped into lines)
     [data-reveal]           fade-up once; optional data-reveal-delay="0.2"
     [data-stagger]          direct children fade-up with a stagger, once
     [data-parallax="0.15"]  y parallax by factor (scrubbed)
     [data-highlight]        word-by-word ink highlight (scrubbed)
     [data-pin]              pinned while the [data-highlight] inside it plays (desktop, if it fits the screen)
     [data-count="3,400"]    counts up on enter; add data-count-scrub to scrub with scroll
     [data-marquee="left|right"] data-speed="60" (seconds per loop); pauses on hover
     [data-draw]             scaleY 0 to 1 scrubbed along its [data-tl] / parent
   html.nomotion = reduced motion or no GSAP: everything shows its final state. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- nav (always) ---------- */
  var nav = document.querySelector('.v4-nav');
  var toggle = nav && nav.querySelector('.v4-nav__toggle');
  function setMenu(open) {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle) toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  var lastY = 0;
  function onScrollNav(y) {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', y > 24);
    if (!nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > lastY + 4 && y > 500 ? true : (y < lastY - 4 ? false : nav.classList.contains('is-hidden')));
    lastY = y;
  }
  window.addEventListener('scroll', function () { onScrollNav(window.scrollY); }, { passive: true });
  onScrollNav(window.scrollY);

  /* ---------- fallback state ---------- */
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (reduce || !hasGsap) root.classList.add('nomotion');

  /* anchors: Lenis if present, else native */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    setMenu(false);
    if (window.__lenis) window.__lenis.scrollTo(t, { offset: 0, duration: 1.4 });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    if (history.pushState) history.pushState(null, '', id);
  });

  if (reduce || !hasGsap) return;

  /* ---------- safety: never leave content hidden ---------- */
  var ready = false;
  setTimeout(function () { if (!ready) root.classList.add('nomotion'); }, 4500);

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  var EASE = 'expo.out';

  /* ---------- helpers ---------- */
  function wrapWords(node, cls) {
    /* replace text nodes inside node by word spans; returns the spans */
    var out = [];
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    var texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(function (tn) {
      var parts = tn.nodeValue.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.className = cls; s.textContent = p; s.style.display = 'inline-block';
        frag.appendChild(s); out.push(s);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    return out;
  }

  function splitChars(el) {
    var chars = [];
    var txt = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-hidden', 'true');
    txt.split('').forEach(function (c) {
      var s = document.createElement('span');
      s.className = 'sc'; s.textContent = c === ' ' ? ' ' : c;
      el.appendChild(s); chars.push(s);
    });
    return chars;
  }

  function splitLines(el) {
    var inners = [];
    var lined = $('[data-line]', el);
    if (lined.length) {
      lined.forEach(function (l) {
        var i = document.createElement('span'); i.className = 'sl__in';
        while (l.firstChild) i.appendChild(l.firstChild);
        l.classList.add('sl'); l.appendChild(i); inners.push(i);
      });
    } else {
      var text = el.textContent.replace(/\s+/g, ' ').trim();
      el.setAttribute('aria-label', text);
      var words = wrapWords(el, 'sw');
      var lines = [], top = null, cur = null;
      words.forEach(function (w) {
        if (top === null || Math.abs(w.offsetTop - top) > 4) { top = w.offsetTop; cur = []; lines.push(cur); }
        cur.push(w.textContent);
      });
      el.textContent = '';
      lines.forEach(function (ws) {
        var l = document.createElement('span'); l.className = 'sl'; l.setAttribute('aria-hidden', 'true');
        var i = document.createElement('span'); i.className = 'sl__in'; i.textContent = ws.join(' ');
        l.appendChild(i); el.appendChild(l); inners.push(i);
      });
    }
    return inners;
  }

  function fmt(n, dec, comma) {
    var s = n.toFixed(dec);
    if (comma) { var p = s.split('.'); s = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p[1] ? '.' + p[1] : ''); }
    return s;
  }

  function init() {
    var hero = document.querySelector('.v4-hero');

    /* ---- hero: staged intro ---- */
    var heroChars = [];
    if (hero) {
      var name = hero.querySelector('[data-hero-name]');
      var frame = hero.querySelector('[data-hero-frame]');
      var img = frame && frame.querySelector('img');
      var lines = [];
      if (name) {
        $('[data-line]', name).forEach(function (l) {
          var cs = splitChars(l); heroChars = heroChars.concat(cs); lines.push(l);
        });
        name.classList.add('is-split');
      }
      var tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.fromTo(hero.querySelector('.v4-hero__eye'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8 }, .1);
      if (heroChars.length) tl.fromTo(heroChars, { yPercent: 115, rotate: 7, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.25, stagger: { each: .045 } }, .15);
      if (frame) {
        tl.fromTo(frame, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut' }, .35);
        if (img) tl.fromTo(img, { scale: 1.55 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, .35);
      }
      var rest = $('.v4-hero__lede, .v4-hero__btns, .v4-hero__facts, .v4-hero__cap', hero);
      tl.fromTo(rest, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1, stagger: .12 }, .95);
      tl.add(function () { frame && (frame.style.clipPath = 'none'); });

      /* cursor reaction: letters get heavier near the pointer, photo tilts and catches light */
      if (finePointer && heroChars.length) {
        var tgt = { x: -999, y: -999 }, active = false;
        var cache = [];
        var measure = function () {
          cache = heroChars.map(function (c) { var r = c.getBoundingClientRect(); return { el: c, x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY, w: 560 }; });
        };
        measure();
        window.addEventListener('resize', measure);
        hero.addEventListener('pointermove', function (e) {
          tgt.x = e.clientX; tgt.y = e.clientY + window.scrollY; active = true;
          if (frame) {
            var r = frame.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            frame.style.setProperty('--mx', (px * 100) + '%'); frame.style.setProperty('--my', (py * 100) + '%');
            var inside = px > -.2 && px < 1.2 && py > -.2 && py < 1.2;
            gsap.to(frame, { rotateY: inside ? (px - .5) * 8 : 0, rotateX: inside ? -(py - .5) * 6 : 0, duration: .6, ease: 'power3.out', overwrite: 'auto' });
          }
        });
        hero.addEventListener('pointerleave', function () { active = false; if (frame) gsap.to(frame, { rotateY: 0, rotateX: 0, duration: .8 }); });
        gsap.ticker.add(function () {
          if (!tl.progress || tl.progress() < 1) return;
          for (var i = 0; i < cache.length; i++) {
            var c = cache[i];
            var d = active ? Math.hypot(tgt.x - c.x, tgt.y - c.y - 0) : 9999;
            var goal = 560 + 240 * Math.max(0, 1 - d / 240);
            c.w += (goal - c.w) * .14;
            if (Math.abs(goal - c.w) > .5 || c.dirty) { c.el.style.fontWeight = Math.round(c.w); c.dirty = Math.abs(goal - c.w) > .5; }
          }
        });
      }

      /* scroll-driven exit: the name splits apart, the photo shrinks away */
      if (lines.length) {
        var exit = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 } });
        lines.forEach(function (l, i) { exit.fromTo(l, { xPercent: 0, opacity: 1 }, { xPercent: i % 2 ? 38 : -30, opacity: 0.1, ease: 'none', immediateRender: false }, 0); });
        if (frame) exit.to(frame, { scale: .82, yPercent: -8, borderRadius: 120, ease: 'none' }, 0);
        exit.fromTo(hero.querySelectorAll('.v4-hero__lede, .v4-hero__btns, .v4-hero__facts'), { y: 0, opacity: 1 }, { y: -50, opacity: 0, ease: 'none', immediateRender: false }, 0);
      }
    }

    /* ---- [data-split] ---- */
    $('[data-split]').forEach(function (el) {
      if (hero && hero.contains(el)) return;
      var inners = splitLines(el);
      el.classList.add('is-split');
      gsap.fromTo(inners, { yPercent: 110, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.2, ease: EASE, stagger: .12, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* ---- [data-reveal] ---- */
    $('[data-reveal]').forEach(function (el) {
      if (hero && hero.contains(el)) return;
      var d = parseFloat(el.getAttribute('data-reveal-delay') || '0');
      gsap.fromTo(el, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE, delay: d, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    /* ---- [data-stagger] ---- */
    $('[data-stagger]').forEach(function (el) {
      gsap.fromTo(el.children, { opacity: 0, y: 60, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: EASE, stagger: .12, scrollTrigger: { trigger: el, start: 'top 88%', once: true }, clearProps: 'transform' });
    });

    /* ---- [data-parallax] ---- */
    $('[data-parallax]').forEach(function (el) {
      var f = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      var trig = el.closest('section, footer') || el.parentElement;
      var dist = function () { return f * window.innerHeight * 0.5; };
      gsap.fromTo(el, { y: function () { return dist(); } }, { y: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: trig, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });

    /* ---- [data-highlight] (+ optional pin) ---- */
    $('[data-highlight]').forEach(function (el) {
      var words = wrapWords(el, 'hw');
      var pinEl = el.closest('[data-pin]');
      var canPin = pinEl && window.innerWidth > 900 && el.offsetHeight < window.innerHeight - 140;
      var st = { trigger: canPin ? pinEl : el, start: canPin ? 'center center' : 'top 80%', end: canPin ? '+=' + Math.round(window.innerHeight * 1.1) : 'bottom 55%', scrub: .5 };
      if (canPin) { st.pin = true; st.anticipatePin = 1; }
      gsap.to(words, { opacity: 1, ease: 'none', stagger: .5, scrollTrigger: st });
    });

    /* ---- [data-count] ---- */
    $('[data-count]').forEach(function (el) {
      var raw = el.getAttribute('data-count');
      var dec = (raw.split('.')[1] || '').length, comma = raw.indexOf(',') > -1, val = parseFloat(raw.replace(/,/g, ''));
      var o = { v: 0 };
      el.textContent = fmt(0, dec, comma);
      var upd = function () { el.textContent = fmt(o.v, dec, comma); };
      if (el.hasAttribute('data-count-scrub')) {
        gsap.to(o, { v: val, ease: 'none', onUpdate: upd, scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: .6 } });
      } else {
        gsap.to(o, { v: val, duration: 2, ease: 'power3.out', onUpdate: upd, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      }
    });

    /* ---- [data-marquee] ---- */
    var mqs = [];
    $('[data-marquee]').forEach(function (el) {
      var track = el.querySelector('.marquee__track'), g = track && track.querySelector('.marquee__group');
      if (!g) return;
      var c = g.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c);
      track.style.setProperty('--mq-dur', (parseFloat(el.getAttribute('data-speed')) || 60) + 's');
      if (el.getAttribute('data-marquee') === 'right') track.classList.add('rev');
      track.classList.add('is-live');
      mqs.push(track);
    });
    if (mqs.length) {
      /* scroll velocity nudges the rows faster */
      var rate = 1;
      gsap.ticker.add(function () {
        var v = lenis ? Math.abs(lenis.velocity || 0) : 0;
        var goal = 1 + Math.min(v * 0.35, 5);
        rate += (goal - rate) * .08;
        mqs.forEach(function (t) { var a = t.getAnimations && t.getAnimations()[0]; if (a) a.playbackRate = rate; });
      });
    }

    /* ---- timeline ---- */
    $('[data-tl]').forEach(function (tlEl) {
      var line = tlEl.querySelector('[data-draw]');
      if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tlEl, start: 'top 60%', end: 'bottom 60%', scrub: .4 } });
      $('[data-tl-item]', tlEl).forEach(function (it) {
        ScrollTrigger.create({ trigger: it, start: 'top 62%', onEnter: function () { it.classList.add('is-on'); }, onLeaveBack: function () { it.classList.remove('is-on'); } });
      });
    });

    /* ---- contact giant name slides with scroll ---- */
    $('[data-giant]').forEach(function (el) {
      gsap.fromTo(el, { xPercent: 6 }, { xPercent: -34, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ---- cursor ring: removed at the user's request ---- */
    if (false) {
      var cur = document.createElement('div'); cur.className = 'v4-cursor'; cur.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cur);
      var qx = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3' }), qy = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
      window.addEventListener('pointermove', function (e) { cur.classList.add('is-on'); qx(e.clientX); qy(e.clientY); }, { passive: true });
      document.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); });
      document.addEventListener('pointerover', function (e) {
        var t = e.target.closest && e.target.closest('a, button, [data-cursor]');
        cur.classList.toggle('is-big', !!t);
      });
    }

    ready = true;
    ScrollTrigger.refresh();
  }

  var start = function () { init(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else window.addEventListener('load', start);
  window.addEventListener('load', function () { if (ready) ScrollTrigger.refresh(); });
})();

/* theme toggle: light / dark, remembered in localStorage */
(function () {
  var root = document.documentElement;
  function label(btn) { btn.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); }
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      label(btn);
      btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        label(btn);
      });
    });
  });
})();
