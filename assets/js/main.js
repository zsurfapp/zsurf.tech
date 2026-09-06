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

  // Cookie consent — AdSense-compliant (loads scripts only after accept)
  var banner = document.getElementById('cookieBanner');
  var accept = document.getElementById('acceptCookies');
  var KEY = 'zsurf_consent_v1';

  function loadAdSense() {
    // Real AdSense code goes here once approved:
    // var s = document.createElement('script');
    // s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXX';
    // s.async = true; s.crossOrigin = 'anonymous';
    // document.head.appendChild(s);
    console.log('[zsurf] Consent given — AdSense would load here.');
  }

  try {
    var consent = localStorage.getItem(KEY);
    if (banner) {
      if (!consent) banner.hidden = false;
      if (accept) {
        accept.addEventListener('click', function () {
          localStorage.setItem(KEY, 'all');
          banner.hidden = true;
          loadAdSense();
        });
      }
    }
    // Already accepted previously — load immediately
    if (consent === 'all') loadAdSense();
  } catch (e) { /* localStorage blocked — fail safe: ask again */ }

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
