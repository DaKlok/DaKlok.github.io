/* Crescendo – spoločné správanie stránok: jazyk, lišta, animácie, obsah dokumentov */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───── jazyk: angličtina, slovenčina pre sk/cs prehliadače alebo podľa voľby ───── */
  var translatable = document.querySelectorAll('[data-sk]');
  translatable.forEach(function (e) { e.setAttribute('data-en', e.innerHTML); });
  var titleEn = document.title;
  var titleSk = doc.getAttribute('data-title-sk');
  var langBtn = document.querySelector('.lang');

  function setLang(lang) {
    var sk = lang === 'sk';
    translatable.forEach(function (e) { e.innerHTML = e.getAttribute(sk ? 'data-sk' : 'data-en'); });
    doc.lang = sk ? 'sk' : 'en';
    if (titleSk) document.title = sk ? titleSk : titleEn;
    if (langBtn) {
      langBtn.textContent = sk ? 'EN' : 'SK';
      langBtn.setAttribute('aria-label', sk ? 'Switch to English' : 'Prepnúť do slovenčiny');
    }
    window.crescendoLang = lang;
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  var initial = saved || (/^(sk|cs)/i.test(navigator.language || '') ? 'sk' : 'en');
  if (!translatable.length) {
    if (langBtn) langBtn.remove();
    langBtn = null;
    initial = 'en';
  }
  setLang(initial);
  if (langBtn) langBtn.addEventListener('click', function () {
    var next = window.crescendoLang === 'sk' ? 'en' : 'sk';
    try { localStorage.setItem('lang', next); } catch (e) {}
    setLang(next);
  });

  /* ───── horná lišta ───── */
  function onScroll() { doc.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = doc.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.links a').forEach(function (a) {
      a.addEventListener('click', function () { doc.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ───── vlnka pri stlačení tlačidla ───── */
  document.addEventListener('pointerdown', function (ev) {
    var b = ev.target.closest('.btn');
    if (!b || reduce) return;
    var r = b.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2.2;
    var s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = size + 'px';
    s.style.left = (ev.clientX - r.left - size / 2) + 'px';
    s.style.top = (ev.clientY - r.top - size / 2) + 'px';
    b.appendChild(s);
    setTimeout(function () { s.remove(); }, 700);
  });

  /* ───── objavovanie pri posúvaní (so zdržaním v skupinách) ───── */
  document.querySelectorAll('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) {
      c.classList.add('reveal');
      c.style.setProperty('--d', (i * 0.07) + 's');
    });
  });
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* ───── galéria obrazoviek ───── */
  var gal = document.querySelector('.gallery');
  document.querySelectorAll('[data-gal]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!gal) return;
      gal.scrollBy({ left: (b.getAttribute('data-gal') === 'next' ? 1 : -1) * 290, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ───── dokumenty: obsah, číslovanie kapitol, priebeh čítania ───── */
  var article = document.querySelector('.article');
  var toc = document.querySelector('.toc');
  if (article && toc) {
    var heads = article.querySelectorAll('h2');
    var list = document.createElement('nav');
    list.setAttribute('aria-label', 'Contents');
    heads.forEach(function (h) {
      if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      list.appendChild(a);
    });
    toc.appendChild(list);
    // nadpisy sa môžu preložiť: obsah sa obnoví podľa nich
    document.addEventListener('langchange', function () {
      var links = list.querySelectorAll('a');
      heads.forEach(function (h, i) { if (links[i]) links[i].textContent = h.textContent.trim(); });
    });
    var links = list.querySelectorAll('a');
    if ('IntersectionObserver' in window) {
      var current = null;
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var i = Array.prototype.indexOf.call(heads, e.target);
            if (current) current.classList.remove('on');
            current = links[i];
            if (current) current.classList.add('on');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      heads.forEach(function (h) { spy.observe(h); });
    }
  }
  var bar = document.querySelector('.progress');
  if (bar) {
    var tick = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
  }

  document.querySelectorAll('.year').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
