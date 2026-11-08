/* v4 #work: the project ribbon itself lives in ribbon.js (three.js module).
   This classic script only keeps ScrollTrigger positions for the sections below #work correct
   once images and the ribbon track have settled the page height. */
(function () {
  window.addEventListener('load', function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });
})();

/* Writing: horizontal post scroller with previous/next buttons */
(function () {
  var track = document.querySelector('[data-posts]'); if (!track) return;
  var prev = document.querySelector('[data-posts-prev]'), next = document.querySelector('[data-posts-next]');
  function page() { var c = track.querySelector('.post-card'); return c ? c.getBoundingClientRect().width + 16 : track.clientWidth; }
  function sync() {
    if (prev) prev.disabled = track.scrollLeft < 4;
    if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }
  if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -page(), behavior: 'smooth' }); });
  if (next) next.addEventListener('click', function () { track.scrollBy({ left: page(), behavior: 'smooth' }); });
  track.addEventListener('scroll', sync, { passive: true }); window.addEventListener('resize', sync); sync();

  /* Live list: the cards baked in at build time are the fallback. On load, read the blog's posts.json and
     redraw the cards when the blog has published something since this page was built, so new posts show
     up here without redeploying the portfolio. */
  var feed = track.getAttribute('data-feed'), blog = track.getAttribute('data-blog');
  if (!feed || !window.fetch) return;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function human(d) { try { return new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); } catch (e) { return d; } }
  fetch(feed, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (list) {
    if (!list || !list.length) return;
    list = list.slice().sort(function (a, b) { return b.date < a.date ? -1 : b.date > a.date ? 1 : 0; }).slice(0, 8);
    var have = [].map.call(track.querySelectorAll('.post-card:not(.post-card--more)'), function (a) { return a.getAttribute('href') + '|' + a.querySelector('h3').textContent; }).join(',');
    var want = list.map(function (p) { return blog + '/' + p.slug + '/|' + p.title; }).join(',');
    if (have === want) return;
    var more = track.querySelector('.post-card--more');
    track.innerHTML = list.map(function (p) {
      return '<a class="post-card" href="' + esc(blog + '/' + p.slug + '/') + '"><time datetime="' + esc(p.date) + '">' + human(p.date) + '</time>' +
        '<h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p><span class="post-card__tags">' + (p.tags || []).map(esc).join(' · ') + '</span></a>';
    }).join('');
    if (more) { more.removeAttribute('data-reveal'); more.style.opacity = ''; more.style.transform = ''; track.appendChild(more); }
    track.scrollLeft = 0; sync();
  }).catch(function () { /* keep the built-in cards */ });
})();
