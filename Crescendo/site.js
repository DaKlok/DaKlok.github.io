/* Crescendo – spoločné správanie stránok: lišta a päta, jazyk, animácie, obsah dokumentov */

/* ───── nastavenia webu (zmena na jednom mieste platí pre všetky stránky) ───── */
var CRESCENDO = {
  // kým appka nie je verejná, hlavné tlačidlá vedú na beta testovanie; po vydaní nastav false
  beta: true,
  play: 'https://play.google.com/store/apps/details?id=com.daklok.crescendo',
  email: 'support.crescendo.com@gmail.com',
  owner: 'Samuel Káčer',
};

(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───── spoločná lišta, päta a ikony (vložia sa do <div data-include="header|footer">) ───── */
  var me = document.currentScript;
  var root = ((me && me.getAttribute('src')) || 'site.js').replace(/site\.js.*$/, '');
  var page = document.body.getAttribute('data-page') || '';
  var C = CRESCENDO;

  var ICONS = {
    play: '<path d="M5.5 3.2v17.6c0 .7.8 1.2 1.4.8l14-8.8a.95.95 0 0 0 0-1.6l-14-8.8c-.6-.4-1.4.1-1.4.8z" fill="currentColor" stroke="none"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    dash: '<path d="M7 12h10"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 21H20"/><path d="M9 8h6M9 11.5h4"/>',
    pen: '<path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M14.5 6l3 3"/>',
    note: '<path d="M9 18V5.5l11-2.5v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    piano: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 20v-6M15 20v-6"/><path d="M7.5 4.5v9.5h3V4.5zM13.5 4.5v9.5h3V4.5z" fill="currentColor" stroke="none"/>',
    flame: '<path d="M12 3c.8 3.2 5.5 5.3 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.3 1.1-4 2.3-5 .1 2 1.1 3.3 2.4 3.3C11.2 8.6 10.5 6 12 3z"/>',
    people: '<circle cx="9" cy="8" r="3.3"/><path d="M2.8 20c.4-3.4 3-5.8 6.2-5.8s5.8 2.4 6.2 5.8"/><circle cx="17.2" cy="8.8" r="2.6"/><path d="M16.6 14.3c2.6.3 4.4 2.5 4.6 5.7"/>',
    chat: '<path d="M4.5 4h15A1.5 1.5 0 0 1 21 5.5v10a1.5 1.5 0 0 1-1.5 1.5H9l-5 4V5.5A1.5 1.5 0 0 1 4.5 4z"/><path d="M8 9h8M8 12.5h5"/>',
    ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-2.5 4-3 6.5-.4 2.2-1.6 3.5-3.5 3.5A3 3 0 0 1 7.6 17"/><path d="M10 9.5a2 2 0 0 1 4 0c0 1.2-1 1.6-1.5 2.5"/>',
    list: '<path d="M4 6h11M4 11h11M4 16h7"/><path d="M17 13v6.5"/><circle cx="15" cy="19.5" r="2"/><path d="M17 13l3 1"/>',
    tune: '<path d="M8 21h8l-1.5-17h-5z"/><path d="M12 15l4-8"/><path d="M9 17.5h6"/>',
    cloud: '<path d="M7 19a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.9 9.4 4.8 4.8 0 0 1 17.5 19z"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7M12 17.2h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>',
    alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.4h.01"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.6-4 3.9-6.5 8-6.5s7.4 2.5 8 6.5"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
    rocket: '<path d="M12 15l-3-3c1.5-5 5-8 10-8 0 5-3 8.5-8 10z"/><path d="M9 12l-3.5.5L4 15l4 1M12 15l-.5 3.5L9 20l-1-4"/><circle cx="15" cy="9" r="1.4"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
    open: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    keep: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/>',
  };
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    Object.keys(ICONS).map(function (k) { return '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; }).join('') +
    '</svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);

  function icon(name) { return '<svg class="i"><use href="#i-' + name + '"/></svg>'; }
  function link(href, label, sk, key) {
    return '<a href="' + root + href + '"' + (key && key === page ? ' aria-current="page"' : '') + (sk ? ' data-sk="' + sk + '"' : '') + '>' + label + '</a>';
  }
  var cta = C.beta
    ? '<a class="btn small" href="' + root + 'beta.html">' + icon('flask') + '<span data-sk="Testovať">Join the beta</span></a>'
    : '<a class="btn small" href="' + C.play + '">' + icon('play') + '<span data-sk="Stiahnuť">Get the app</span></a>';

  var header =
    '<a class="skip" href="#main" data-sk="Preskočiť na obsah">Skip to content</a>' +
    '<header class="top"><div class="wrap bar">' +
      '<a class="brand" href="' + root + './"><span class="logo"><img src="' + root + 'img/icon-fg.png" alt=""></span>Crescendo</a>' +
      '<nav class="links" aria-label="Main">' +
        link('index.html#features', 'Features', 'Funkcie', 'features') +
        link('pricing.html', 'Pricing', 'Cenník', 'pricing') +
        link('help.html', 'Help', 'Nápoveda', 'help') +
        (C.beta ? link('beta.html', 'Beta', null, 'beta') : '') +
      '</nav>' +
      '<button class="lang" type="button">SK</button>' + cta +
      '<button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false">' + icon('menu') + '</button>' +
    '</div></header>';

  var footer =
    '<footer class="site-footer"><div class="wrap">' +
      '<div class="fcols">' +
        '<div class="fbrand">' +
          '<a class="brand" href="' + root + './"><span class="logo"><img src="' + root + 'img/icon-fg.png" alt=""></span>Crescendo</a>' +
          '<p data-sk="Noty, cvičenie a hudobní priatelia v jednej aplikácii pre Android.">Sheet music, practice and music friends in one Android app.</p>' +
          '<a class="fmail" href="mailto:' + C.email + '">' + icon('mail') + C.email + '</a>' +
        '</div>' +
        '<nav aria-label="Product"><h2 data-sk="Produkt">Product</h2>' +
          link('index.html#features', 'Features', 'Funkcie') +
          link('pricing.html', 'Pricing', 'Cenník') +
          link('index.html#screens', 'Screenshots', 'Ukážky') +
          link('beta.html', 'Beta testing', 'Beta testovanie') +
        '</nav>' +
        '<nav aria-label="Support"><h2 data-sk="Podpora">Support</h2>' +
          link('help.html', 'Help &amp; FAQ', 'Nápoveda a otázky') +
          link('help.html#contact', 'Contact us', 'Kontakt') +
          link('delete-account.html', 'Delete account', 'Zmazanie účtu') +
          '<a href="mailto:' + C.email + '?subject=Crescendo%20feedback" data-sk="Poslať spätnú väzbu">Send feedback</a>' +
        '</nav>' +
        '<nav aria-label="Legal"><h2 data-sk="Právne">Legal</h2>' +
          link('privacy.html', 'Privacy Policy', 'Ochrana súkromia') +
          link('terms.html', 'Terms of Service', 'Podmienky používania') +
          link('terms.html#community', 'Community rules', 'Pravidlá komunity') +
          link('terms.html#child-safety', 'Child safety', 'Ochrana detí') +
        '</nav>' +
      '</div>' +
      '<div class="fbottom"><span>© <span class="year">2026</span> ' + C.owner + ' · Crescendo</span>' +
        '<span data-sk="Bez reklám · Bez sledovania">No ads · No tracking</span></div>' +
    '</div></footer>';

  var h = document.querySelector('[data-include="header"]');
  if (h) h.outerHTML = header;
  var f = document.querySelector('[data-include="footer"]');
  if (f) f.outerHTML = footer;
  // tlačidlá „Stiahnuť“ v obsahu stránok sa riadia tým istým nastavením (text: .when-beta / .when-live)
  doc.classList.toggle('beta-on', !!C.beta);
  document.querySelectorAll('[data-cta]').forEach(function (a) {
    a.href = C.beta ? root + 'beta.html' : C.play;
  });

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
