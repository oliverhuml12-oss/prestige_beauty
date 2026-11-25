// Hero slider: cross-fades to the next service every 3 s while the line under
// the active tab fills left to right; loops. Tabs also work by click and arrows.
(function () {
  var hero = document.querySelector('.hero');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.hero__tab'));
  if (!hero || !tabs.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;

  // Phones only: swap the hero photos for short muted clips. Each clip loads
  // just before it is needed, and only the visible one plays.
  var videos = Array.prototype.slice.call(hero.querySelectorAll('.slide__video'));
  var saveData = navigator.connection && navigator.connection.saveData;
  var useVideo = videos.length && !reduceMotion && !saveData &&
    window.matchMedia('(max-width: 900px)').matches;

  function load(v) { if (v && !v.src) { v.src = v.getAttribute('data-src'); v.preload = 'auto'; } }
  function playVideo(index) {
    if (!useVideo) return;
    videos.forEach(function (v, i) {
      if (i === index) {
        load(v);
        v.currentTime = 0;
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    });
    load(videos[(index + 1) % videos.length]); // warm up the next clip
  }
  if (useVideo) hero.classList.add('has-video');

  function run(tab) {
    tabs.forEach(function (t) { t.classList.remove('is-running'); });
    if (reduceMotion) return;
    void tab.offsetWidth; // restart the fill animation
    tab.classList.add('is-running');
  }

  function select(index, focus) {
    current = index;
    tabs.forEach(function (tab, i) {
      var on = i === index;
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      panel.classList.toggle('is-active', on);
      panel.setAttribute('aria-hidden', on ? 'false' : 'true');
      panel.inert = !on;
    });
    run(tabs[index]);
    playVideo(index);
    if (focus) tabs[index].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); select(next, true); }
    });
    // The line finished filling: move on to the next service.
    tab.addEventListener('animationend', function () {
      if (i === current) select((current + 1) % tabs.length, false);
    });
  });

  playVideo(0);

  if (!reduceMotion) {
    hero.classList.add('is-auto');
    // Hold the current slide while the visitor points at or tabs into the hero.
    var pause = function () { hero.classList.add('is-paused'); };
    var resume = function () { hero.classList.remove('is-paused'); };
    hero.addEventListener('mouseenter', pause);
    hero.addEventListener('mouseleave', resume);
    hero.addEventListener('focusin', pause);
    hero.addEventListener('focusout', resume);
    // Stop the loop while the hero is off screen or the tab is hidden.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        hero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(hero);
    }
    // Decode the other slides up front so the cross-fade never waits on an image.
    hero.querySelectorAll('.slide img').forEach(function (img) { if (img.decode) img.decode().catch(function () {}); });
    run(tabs[0]);
  }
})();

// Scroll spark: position follows scroll progress; the trail shows while moving, then fades.
(function () {
  var spark = document.querySelector('.scroll-spark');
  if (!spark) return;
  var ticking = false, idle;
  function update() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    spark.style.setProperty('--x', (p * spark.clientWidth).toFixed(1) + 'px');
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
    spark.classList.add('is-moving');
    clearTimeout(idle);
    idle = setTimeout(function () { spark.classList.remove('is-moving'); }, 180);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
