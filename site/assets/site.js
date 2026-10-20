// Samudio Auto — phone-width menu toggle (the button only shows below 820px; see site.css).
(function () {
  var button = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (!button || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  button.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });
})();

// Work videos: respect reduced-motion (show the still photo instead), and pause when off screen.
(function () {
  var videos = document.querySelectorAll('video.work-video');
  if (!videos.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function apply() {
    videos.forEach(function (v) {
      if (reduce.matches) { v.pause(); v.removeAttribute('autoplay'); }
      else if (v.dataset.visible !== 'false') { v.play().catch(function () {}); }
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.dataset.visible = e.isIntersecting ? 'true' : 'false';
        if (!e.isIntersecting) e.target.pause();
        else if (!reduce.matches) e.target.play().catch(function () {});
      });
    });
    videos.forEach(function (v) { io.observe(v); });
  }

  apply();
  if (reduce.addEventListener) reduce.addEventListener('change', apply);
})();

// Page wipe: wipe off once this page is ready, wipe on before leaving for another page.
(function () {
  var root = document.documentElement;
  var wipe = document.querySelector('.wipe');
  if (!wipe) return;
  var start = Date.now();
  var bumper = root.classList.contains('bumper');
  var MIN_MS = bumper ? 1700 : 350;  // bumper plays through; otherwise let the piston turn a little
  var MAX_MS = 2500;  // never hold the page longer than this

  var revealed = false;
  function reveal() {
    if (revealed) return;
    setTimeout(function () {
      if (revealed) return;
      revealed = true;
      root.classList.add('wipe-done');
      document.dispatchEvent(new Event('wipe:revealed'));
    }, Math.max(0, MIN_MS - (Date.now() - start)));
  }
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(reveal, reveal);
  setTimeout(reveal, MAX_MS);
  if (bumper) wipe.addEventListener('click', function () { MIN_MS = 0; reveal(); });  // tap to skip

  wipe.addEventListener('animationend', function (e) {
    if (e.animationName === 'wipe-off' || e.animationName === 'wipe-fade-out') {
      root.classList.remove('wipe-in', 'wipe-done', 'bumper');
    }
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target && a.target !== '_self' || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;  // tel:, sms:, mailto:, other sites
    if (url.pathname === location.pathname && url.hash) return;  // jump within this page
    e.preventDefault();
    root.classList.remove('wipe-in', 'wipe-done', 'bumper');
    root.classList.add('wipe-out');
    var go = function () { location.href = url.href; };
    var timer = setTimeout(go, 600);
    wipe.addEventListener('animationend', function done(ev) {
      if (ev.animationName !== 'wipe-on' && ev.animationName !== 'wipe-fade-in') return;
      wipe.removeEventListener('animationend', done);
      clearTimeout(timer);
      go();
    });
  });

  // Coming back with the browser's Back button can restore the page with the wipe still on.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) root.classList.remove('wipe-in', 'wipe-out', 'wipe-done', 'bumper');
  });
})();

// Scroll builds: sections assemble piece by piece as you scroll down to them.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var heroSkipped = false;
  var items = [];
  document.querySelectorAll('main section, body > div section').forEach(function (section) {
    if (!heroSkipped) { heroSkipped = true; return; }  // the first section is visible on arrival
    var container = section.firstElementChild;
    if (!container) return;
    Array.prototype.forEach.call(container.children, function (child) {
      // Grids of cards build one card at a time.
      var isGrid = /grid/.test(child.style.display) || child.tagName === 'OL' || child.tagName === 'UL';
      var parts = isGrid && child.children.length > 1 ? child.children : [child];
      Array.prototype.forEach.call(parts, function (el, i) {
        el.classList.add('build');
        el.style.setProperty('--build-delay', Math.min(i, 6) * 90 + 'ms');
        items.push(el);
      });
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-built'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  function start() { items.forEach(function (el) { io.observe(el); }); }
  // Hold the builds until the page wipe starts sliding away, so they play where you can see them.
  var root = document.documentElement;
  if (root.classList.contains('wipe-in') && !root.classList.contains('wipe-done')) {
    var started = false;
    var once = function () { if (!started) { started = true; start(); } };
    document.addEventListener('wipe:revealed', once);
    setTimeout(once, 3000);
  } else {
    start();
  }
})();

// Booking (Koalendar): inline calendar in #schedule, plus "Book" buttons (the floating
// "Book a job" button on larger screens, the Book button in the phone Call/Text bar)
// that open the booking page in a dialog. Without JS those buttons just open Koalendar.
(function () {
  var BOOKING_URL = 'https://koalendar.com/e/samudioauto';

  if (document.getElementById('inline-widget-samudioauto')) {
    window.Koalendar = window.Koalendar || function () { (Koalendar.props = Koalendar.props || []).push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://koalendar.com/assets/widget.js';
    document.head.appendChild(s);
    Koalendar('inline', { url: BOOKING_URL, selector: '#inline-widget-samudioauto' });
  }

  var fab = document.querySelector('.book-fab');
  var triggers = document.querySelectorAll('.book-fab, .cb-book');
  var dialog = document.querySelector('.book-dialog');
  if (!triggers.length) return;

  // Hide the floating button while the inline calendar or the footer is on screen,
  // so it never covers the calendar or the footer text.
  if (fab && 'IntersectionObserver' in window) {
    var onScreen = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) onScreen.add(e.target); else onScreen.delete(e.target);
      });
      fab.classList.toggle('is-hidden', onScreen.size > 0);
    }, { threshold: 0.15 });
    [document.querySelector('#schedule'), document.querySelector('footer')].forEach(function (el) {
      if (el) io.observe(el);
    });
  }

  if (!dialog || typeof dialog.showModal !== 'function') return;
  var frame = dialog.querySelector('iframe');
  var lastTrigger = null;
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      lastTrigger = trigger;
      if (!frame.src) frame.src = frame.dataset.src;
      dialog.showModal();
      document.documentElement.classList.add('book-open');
    });
  });
  dialog.querySelector('.book-dialog__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });  // tap outside
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('book-open');
    if (lastTrigger) lastTrigger.focus();
  });
})();

// Sticky header: add a soft shadow once the page has scrolled.
(function () {
  var root = document.documentElement;
  function update() { root.classList.toggle('is-scrolled', window.scrollY > 4); }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();
