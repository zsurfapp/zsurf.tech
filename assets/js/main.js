/* zsurf.tech — main.js */
(function () {
  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Categories dropdown toggle (click-to-open on all devices)
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.parentElement;
      var expanded = parent.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      // Close other open dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(function (other) {
        if (other !== parent && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          var otherBtn = other.querySelector('.nav-dropdown-toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(function (d) {
        d.classList.remove('is-open');
        var b = d.querySelector('.nav-dropdown-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Prevent 300ms tap delay on touch devices
  if ('ontouchstart' in window) {
    document.querySelectorAll('.nav-dropdown-toggle, .nav-dropdown-menu a').forEach(function (el) {
      el.style.touchAction = 'manipulation';
    });
  }

  // Cookie consent removed: banner and consent handling are disabled.

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  // Reading-time helper for article pages
  var body = document.querySelector('.article-body');
  if (body) {
    var words = body.innerText.trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 220));
    var el = document.querySelector('.reading-time');
    if (el) el.textContent = mins + ' min read';
  }
})();
