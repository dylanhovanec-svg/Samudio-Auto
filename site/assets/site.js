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

// Schedule form: turn the answers into a text (or email) to Jayden, ready to send.
(function () {
  var forms = document.querySelectorAll('form.schedule-form');
  forms.forEach(function (form) {
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      var d = new Date();
      dateInput.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    var error = form.querySelector('.schedule-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (el) {
        var bad = !el.value.trim();
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        el.style.borderColor = bad ? '#BC1823' : '';
        return bad;
      });
      if (missing.length) {
        if (error) error.textContent = 'Please fill in your name, phone, the service and where the car is.';
        missing[0].focus();
        return;
      }
      if (error) error.textContent = '';

      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var day = v('date');
      if (day) {
        var parts = day.split('-');
        day = new Date(+parts[0], parts[1] - 1, +parts[2]).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      }
      var when = [day, v('time')].filter(Boolean).join(', ') || 'Flexible';
      var lines = [
        'Hi Jayden, I’d like to schedule a job.',
        'Name: ' + v('name'),
        'Phone: ' + v('phone'),
        'Service: ' + v('service'),
        v('vehicle') && 'Vehicle: ' + v('vehicle'),
        'When: ' + when,
        'Car is at: ' + v('location'),
        v('details') && 'Details: ' + v('details')
      ].filter(Boolean);
      lines.splice(1, 0, '');  // blank line after the greeting
      var body = encodeURIComponent(lines.join('\n'));

      var viaEmail = e.submitter && e.submitter.value === 'email';
      window.location.href = viaEmail
        ? 'mailto:Samudioauto@gmail.com?subject=' + encodeURIComponent('Schedule a job: ' + v('service')) + '&body=' + body
        : 'sms:+18653158860?&body=' + body;
    });
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
