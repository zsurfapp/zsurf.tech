/* zsurf.tech — Search Engine
   Client-side article search using prebuilt index.
   Loads /assets/data/search-index.json and renders results in dropdown. */

(function () {
  'use strict';

  var INDEX_URL = '/assets/data/search-index.json';
  var MAX_RESULTS = 12;
  var MIN_QUERY_LENGTH = 2;

  // Cached index
  var INDEX = null;
  var loadingPromise = null;

  // Highlight matched terms in result text
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    var terms = query.trim().split(/\s+/).map(escapeRegex).filter(Boolean);
    if (!terms.length) return escapeHtml(text);
    var re = new RegExp('(' + terms.join('|') + ')', 'gi');
    return escapeHtml(text).replace(re, '<mark>$1</mark>');
  }

  // Score matches: title hits weighted highest
  function scoreArticle(article, terms) {
    var score = 0;
    var title = article.title.toLowerCase();
    var excerpt = (article.excerpt || '').toLowerCase();
    var category = (article.category || '').toLowerCase();
    var slug = article.slug.toLowerCase();

    terms.forEach(function (term) {
      if (!term) return;
      if (title.indexOf(term) >= 0) score += 10;
      if (title.toLowerCase().split(/\s+/).some(function (w) { return w.indexOf(term) === 0; })) score += 5;
      if (excerpt.indexOf(term) >= 0) score += 3;
      if (category.indexOf(term) >= 0) score += 2;
      if (slug.indexOf(term.replace(/\s+/g, '-')) >= 0) score += 2;
    });
    return score;
  }

  function loadIndex() {
    if (INDEX) return Promise.resolve(INDEX);
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch(INDEX_URL, { credentials: 'omit' })
      .then(function (r) { return r.json(); })
      .then(function (data) { INDEX = data; return data; })
      .catch(function (err) {
        console.error('[zsurf search] failed to load index:', err);
        INDEX = [];
        return INDEX;
      });
    return loadingPromise;
  }

  function renderResults(query, results, container) {
    if (!query || query.length < MIN_QUERY_LENGTH) {
      container.innerHTML = '<div class="search-empty">Type at least ' + MIN_QUERY_LENGTH + ' characters to search ' + (INDEX ? INDEX.length : '') + ' articles.</div>';
      container.classList.add('is-visible');
      return;
    }
    if (!results.length) {
      container.innerHTML = '<div class="search-empty">No articles found for <strong>' + escapeHtml(query) + '</strong>.</div>';
      container.classList.add('is-visible');
      return;
    }
    var html = '';
    results.slice(0, MAX_RESULTS).forEach(function (r) {
      html += '<a href="' + escapeHtml(r.url) + '" class="search-result">' +
        '<div class="search-result-meta">' +
          '<span class="search-result-cat">' + escapeHtml(r.category) + '</span>' +
          '<span class="search-result-date">' + escapeHtml(r.date) + '</span>' +
        '</div>' +
        '<div class="search-result-title">' + highlight(r.title, query) + '</div>' +
        '<div class="search-result-excerpt">' + highlight(r.excerpt, query) + '</div>' +
      '</a>';
    });
    if (results.length > MAX_RESULTS) {
      html += '<div class="search-more">Showing ' + MAX_RESULTS + ' of ' + results.length + ' results. Refine your search to narrow down.</div>';
    }
    container.innerHTML = html;
    container.classList.add('is-visible');
  }

  function close(container) {
    container.classList.remove('is-visible');
    container.innerHTML = '';
  }

  function init() {
    var input = document.getElementById('siteSearch');
    var dropdown = document.getElementById('searchResults');
    var form = document.getElementById('siteSearchForm');
    var nav = document.getElementById('nav');

    if (!input || !dropdown || !form) return;

    // Load index lazily
    loadIndex();

    var debounceTimer = null;

    input.addEventListener('input', function () {
      var q = input.value.trim();
      clearTimeout(debounceTimer);
      if (q.length < MIN_QUERY_LENGTH) {
        close(dropdown);
        return;
      }
      debounceTimer = setTimeout(function () {
        var terms = q.toLowerCase().split(/\s+/);
        var scored = (INDEX || []).map(function (a) {
          return { article: a, score: scoreArticle(a, terms) };
        }).filter(function (x) { return x.score > 0; })
          .sort(function (a, b) { return b.score - a.score; })
          .map(function (x) { return x.article; });
        renderResults(q, scored, dropdown);
      }, 80);
    });

    input.addEventListener('focus', function () {
      loadIndex().then(function () {
        if (input.value.trim().length >= MIN_QUERY_LENGTH) {
          input.dispatchEvent(new Event('input'));
        }
      });
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        close(dropdown);
        input.blur();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!form.contains(e.target) && !dropdown.contains(e.target)) {
        close(dropdown);
      }
    });

    // Submit: go to first result (or articles listing)
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      var first = dropdown.querySelector('.search-result');
      if (first) {
        window.location.href = first.getAttribute('href');
      } else {
        window.location.href = '/articles/index.html?q=' + encodeURIComponent(q);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
