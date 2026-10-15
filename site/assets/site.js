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
