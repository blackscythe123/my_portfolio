/* Card screenshot loops: each [data-slides] crossfades through its <img> children while it is on screen.
   Still (first image only) under prefers-reduced-motion. Images after the first load lazily. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 2000;
  function setup(box) {
    var imgs = Array.prototype.slice.call(box.querySelectorAll('img'));
    if (imgs.length < 2 || reduce) return;
    var dots = box.querySelector('.wk-slides__dots');
    var i = 0, timer = null;
    function show(n) {
      imgs[i].classList.remove('is-on'); if (dots) dots.children[i].classList.remove('is-on');
      i = n % imgs.length;
      var next = imgs[(i + 1) % imgs.length]; if (next.loading === 'lazy') next.loading = 'eager';
      imgs[i].classList.add('is-on'); if (dots) dots.children[i].classList.add('is-on');
    }
    function start() { if (!timer) timer = setInterval(function () { show(i + 1); }, INTERVAL); }
    function stop() { clearInterval(timer); timer = null; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: 0.35 }).observe(box);
    } else start();
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : null; });
  }
  document.addEventListener('DOMContentLoaded', function () { document.querySelectorAll('[data-slides]').forEach(setup); });
})();
