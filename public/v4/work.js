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
})();
