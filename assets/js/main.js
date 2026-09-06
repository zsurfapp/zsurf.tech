/* zsurf.tech — main.js */
(function () {
  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
  }

  // Cookie consent
  var banner = document.getElementById('cookieBanner');
  var accept = document.getElementById('acceptCookies');
  var KEY = 'zsurf_cookie_consent_v1';
  try {
    if (banner) {
      if (!localStorage.getItem(KEY)) banner.hidden = false;
      if (accept) {
        accept.addEventListener('click', function () {
          localStorage.setItem(KEY, '1');
          banner.hidden = true;
        });
      }
    }
  } catch (e) { /* localStorage blocked — ignore */ }

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
