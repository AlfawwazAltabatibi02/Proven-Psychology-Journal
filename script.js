/* =============================================
   LUMINA MAGAZINE — script.js (FIXED + Admin-Ready)
   Uses localStorage to sync with admin panel
   ============================================= */

// ── DEFAULT ARTICLES DATA ─────────────────────
// DEFAULT_ARTICLES loaded from articles-data.js

// ── ARTICLE STORE (REST API BACKEND) ───────────
let cachedArticles = [];

async function refreshArticles() {
  try {
    const res = await fetch('/api/articles');
    if (!res.ok) throw new Error('REST API returned status ' + res.status);
    cachedArticles = await res.json();
    // Sync to localStorage as backup
    try {
      localStorage.setItem('lumina_articles', JSON.stringify(cachedArticles));
    } catch (err) {}
    return cachedArticles;
  } catch (e) {
    console.warn('API fetch failed, falling back to local storage:', e);
    try {
      const stored = localStorage.getItem('lumina_articles');
      if (stored) {
        cachedArticles = JSON.parse(stored);
        if (cachedArticles && cachedArticles.length > 0) {
          return cachedArticles;
        }
      }
    } catch (err) {}
    // Complete fallback to script-defined DEFAULT_ARTICLES
    cachedArticles = typeof DEFAULT_ARTICLES !== 'undefined' ? DEFAULT_ARTICLES : [];
    return cachedArticles;
  }
}

function loadArticles() {
  return cachedArticles;
}

function getArticleById(id) {
  const all = loadArticles();
  return all.find(a => a.id === id) || {
    id, category: 'Lumina Magazine', img: 'images/hero_banner.png',
    title: 'Article Coming Soon',
    author: 'Lumina Editorial', date: 'May 2026', read: '5 min read',
    excerpt: 'This article will be published soon.',
    content: '<p>This article is coming soon. Subscribe to our newsletter to be the first to read it when it publishes.</p>'
  };
}

function renderAllSections(articles) {
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    const parts = dateStr.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  // Newest first (reverse database order which is default old-to-new)
  const newestFirst = [...articles].reverse();

  // 1. HERO SECTION
  const heroFeaturedContainer = document.querySelector('.hero-featured');
  const heroSideContainer = document.querySelector('.hero-side');
  if (heroFeaturedContainer && newestFirst.length > 0) {
    const a = newestFirst[0];
    heroFeaturedContainer.innerHTML = `
      <div class="hero-image-wrap">
        <img src="${a.img || 'images/hero_banner.png'}" alt="${a.title}" class="hero-img" loading="eager" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <span class="hero-tag">✦ Featured · ${a.category}</span>
        <h1 class="hero-title">${a.title}</h1>
        <p class="hero-excerpt">${a.excerpt || ''}</p>
        <div class="hero-meta">
          <span class="hero-author">By ${a.author}</span>
          <span class="hero-dot">·</span>
          <span class="hero-date">${formatDate(a.date)}</span>
          <span class="hero-dot">·</span>
          <span class="hero-read">${a.read}</span>
        </div>
        <a href="#article-modal" class="btn-read-more" id="hero-read-btn" data-article="${a.id}">Read Article <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
      </div>
    `;
  }
  if (heroSideContainer && newestFirst.length > 1) {
    const sideArticles = newestFirst.slice(1, 4);
    heroSideContainer.innerHTML = sideArticles.map(a => `
      <div class="side-card" data-article="${a.id}">
        <img src="${a.img || 'images/hero_banner.png'}" alt="${a.title}" />
        <div class="side-card-content">
          <span class="side-tag">${a.category.split(' & ')[0]}</span>
          <h3>${a.title}</h3>
          <span class="side-date">${formatDate(a.date)}</span>
        </div>
      </div>
    `).join('');
  }

  const getCategoryArticles = (cat) => newestFirst.filter(a => a.category === cat);

  // 2. MINDFULNESS & SOCIETY
  const mindfulnessContainer = document.querySelector('#mindfulness .articles-grid');
  if (mindfulnessContainer) {
    const catArts = getCategoryArticles('Mindfulness & Society');
    if (catArts.length > 0) {
      const main = catArts[0];
      const others = catArts.slice(1, 4);
      let html = `
        <article class="article-card featured-card" data-article="${main.id}">
          <div class="card-image-wrap">
            <img src="${main.img || 'images/article_mindfulness.png'}" alt="${main.title}" loading="lazy" />
            <span class="card-tag">Featured</span>
          </div>
          <div class="card-content">
            <span class="card-category">${main.category}</span>
            <h2 class="card-title">${main.title}</h2>
            <p class="card-excerpt">${main.excerpt || ''}</p>
            <div class="card-footer">
              <span class="card-author">By ${main.author}</span>
              <span class="card-date">${formatDate(main.date)} · ${main.read}</span>
            </div>
          </div>
        </article>
      `;
      const bgClasses = ['mindfulness-bg', 'mindfulness-bg2', 'mindfulness-bg3'];
      others.forEach((a, i) => {
        const bgClass = bgClasses[i % bgClasses.length];
        const imageHtml = a.img && !a.img.includes('hero_banner') && !a.img.includes('article_mindfulness')
          ? `<img src="${a.img}" alt="${a.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />`
          : `<div class="card-color-bg ${bgClass}"></div>`;
        html += `
          <article class="article-card" data-article="${a.id}">
            <div class="card-image-wrap small">
              ${imageHtml}
            </div>
            <div class="card-content">
              <span class="card-category">${a.category}</span>
              <h3 class="card-title">${a.title}</h3>
              <div class="card-footer">
                <span class="card-author">By ${a.author}</span>
                <span class="card-date">${formatDate(a.date)} · ${a.read}</span>
              </div>
            </div>
          </article>
        `;
      });
      mindfulnessContainer.innerHTML = html;
    }
  }

  // 3. PHILOSOPHY & SPIRITUALITY
  const philosophyContainer = document.querySelector('#philosophy .articles-list');
  if (philosophyContainer) {
    const catArts = getCategoryArticles('Philosophy & Spirituality').slice(0, 3);
    const bgClasses = ['philosophy-bg', 'philosophy-bg2', 'philosophy-bg3'];
    philosophyContainer.innerHTML = catArts.map((a, i) => {
      const bgClass = bgClasses[i % bgClasses.length];
      const imageHtml = a.img && !a.img.includes('hero_banner') && !a.img.includes('article_philosophy')
        ? `<img src="${a.img}" alt="${a.title}" loading="lazy" />`
        : `<div class="card-color-bg ${bgClass}"></div>`;
      return `
        <article class="list-card" data-article="${a.id}">
          <div class="list-card-image">
            ${imageHtml}
          </div>
          <div class="list-card-content">
            <span class="card-category">${a.category}</span>
            <h2 class="list-card-title">${a.title}</h2>
            <p class="list-card-excerpt">${a.excerpt || ''}</p>
            <div class="card-footer">
              <span class="card-author">By ${a.author}</span>
              <span class="card-date">${formatDate(a.date)} · ${a.read}</span>
              <span class="card-tag-inline">Essay</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // 4. PSYCHOLOGY & SCIENCE
  const psychologyContainer = document.querySelector('#psychology .psych-grid');
  if (psychologyContainer) {
    const catArts = getCategoryArticles('Psychology & Science');
    if (catArts.length > 0) {
      const main = catArts[0];
      const others = catArts.slice(1, 4);
      let html = `
        <article class="psych-main" data-article="${main.id}">
          <div class="psych-image">
            <img src="${main.img || 'images/article_psychology.png'}" alt="${main.title}" loading="lazy" />
            <span class="card-tag">Research</span>
          </div>
          <div class="card-content">
            <span class="card-category">${main.category}</span>
            <h2 class="card-title">${main.title}</h2>
            <p class="card-excerpt">${main.excerpt || ''}</p>
            <div class="card-footer">
              <span class="card-author">By ${main.author}</span>
              <span class="card-date">${formatDate(main.date)} · ${main.read}</span>
            </div>
          </div>
        </article>
      `;
      if (others.length > 0) {
        html += `
          <div class="psych-side">
            ${others.map(a => `
              <article class="psych-small" data-article="${a.id}">
                <span class="card-category">${a.category}</span>
                <h3>${a.title}</h3>
                <div class="card-footer">
                  <span class="card-date">${formatDate(a.date)} · ${a.read}</span>
                </div>
              </article>
            `).join('')}
          </div>
        `;
      }
      psychologyContainer.innerHTML = html;
    }
  }

  // 5. REFLECTIVE INSIGHTS
  const reflectiveContainer = document.querySelector('#reflective .reflective-grid');
  if (reflectiveContainer) {
    const catArts = getCategoryArticles('Reflective Insights');
    if (catArts.length > 0) {
      const main = catArts[0];
      const others = catArts.slice(1, 4);
      let html = `
        <article class="reflective-quote" data-article="${main.id}">
          <div class="quote-image">
            <img src="${main.img || 'images/article_reflective.png'}" alt="${main.title}" loading="lazy" />
          </div>
          <div class="quote-content">
            <div class="pull-quote">"The longest journey is the journey inward."</div>
            <div class="quote-attr">— Dag Hammarskjöld</div>
            <h2 class="card-title">${main.title}</h2>
            <p class="card-excerpt">${main.excerpt || ''}</p>
            <div class="card-footer">
              <span class="card-author">By ${main.author}</span>
              <span class="card-date">${formatDate(main.date)} · ${main.read}</span>
            </div>
            <a href="#" class="btn-text-link">Read Essay <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
          </div>
        </article>
      `;
      if (others.length > 0) {
        const bgClasses = ['reflective-bg', 'reflective-bg2', 'reflective-bg3'];
        html += `
          <div class="reflective-small-grid">
            ${others.map((a, i) => {
              const bgClass = bgClasses[i % bgClasses.length];
              return `
                <article class="reflective-small" data-article="${a.id}">
                  <div class="card-color-bg ${bgClass}"></div>
                  <div class="reflective-small-content">
                    <span class="card-category">${a.category}</span>
                    <h3>${a.title}</h3>
                    <span class="card-date">${formatDate(a.date)} · ${a.read}</span>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        `;
      }
      reflectiveContainer.innerHTML = html;
    }
  }

  // 6. CAMPUS NEWS
  const campusContainer = document.querySelector('#campus .campus-grid');
  if (campusContainer) {
    const catArts = getCategoryArticles('Campus News');
    if (catArts.length > 0) {
      const main = catArts[0];
      const others = catArts.slice(1, 5);
      let html = `
        <article class="campus-main" data-article="${main.id}">
          <div class="campus-image">
            <img src="${main.img || 'images/article_campus.png'}" alt="${main.title}" loading="lazy" />
            <span class="breaking-tag">Breaking</span>
          </div>
          <div class="card-content">
            <span class="card-category">${main.category}</span>
            <h2 class="card-title">${main.title}</h2>
            <p class="card-excerpt">${main.excerpt || ''}</p>
            <div class="card-footer">
              <span class="card-author">By ${main.author}</span>
              <span class="card-date">${formatDate(main.date)} · ${main.read}</span>
            </div>
          </div>
        </article>
      `;
      if (others.length > 0) {
        html += `
          <div class="campus-side">
            ${others.map(a => `
              <article class="campus-small" data-article="${a.id}">
                <span class="campus-small-date">${formatDate(a.date)}</span>
                <h3>${a.title}</h3>
                <span class="card-category">${a.category}</span>
              </article>
            `).join('')}
          </div>
        `;
      }
      campusContainer.innerHTML = html;
    }
  }
}

// ── DOM READY ──────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

  // Load articles from backend and render them dynamically
  await refreshArticles();
  renderAllSections(cachedArticles);

  // ── ANNOUNCEMENT BAR ──────────────────────
  const annClose = document.getElementById('ann-close');
  const annBar   = document.getElementById('announcement-bar');
  if (annClose && annBar) {
    annClose.addEventListener('click', () => {
      annBar.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease';
      annBar.style.maxHeight  = '0';
      annBar.style.opacity    = '0';
      annBar.style.padding    = '0';
      annBar.style.overflow   = 'hidden';
    });
  }

  // ── HEADER SCROLL ─────────────────────────
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── SEARCH ────────────────────────────────
  const searchToggle  = document.getElementById('search-toggle');
  const searchBar     = document.getElementById('search-bar');
  const searchClose   = document.getElementById('search-close');
  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (searchToggle) {
    searchToggle.addEventListener('click', () => { searchBar.classList.add('open'); searchInput.focus(); });
    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      searchResults.innerHTML = '';
      if (!q) return;
      const all  = loadArticles();
      const hits = all.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q))
      ).slice(0, 6);
      if (!hits.length) {
        searchResults.innerHTML = '<div class="search-result-item"><h4>No results found</h4><span>Try a different keyword</span></div>';
        return;
      }
      hits.forEach(a => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `<h4>${a.title}</h4><span>${a.category} · ${a.author}</span>`;
        div.addEventListener('click', () => { openModal(a.id); closeSearch(); });
        searchResults.appendChild(div);
      });
    });
  }
  function closeSearch() {
    if (searchBar) { searchBar.classList.remove('open'); searchInput.value = ''; searchResults.innerHTML = ''; }
  }

  // ── LANGUAGE SWITCHER ─────────────────────
  const langToggle   = document.getElementById('lang-toggle');
  const langDropdown = document.getElementById('lang-dropdown');
  const currentLang  = document.getElementById('current-lang');
  if (langToggle) {
    langToggle.addEventListener('click', (e) => { e.stopPropagation(); langDropdown.classList.toggle('open'); });
    document.addEventListener('click', () => langDropdown && langDropdown.classList.remove('open'));
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang; if (!lang) return;
        if (currentLang) currentLang.textContent = lang;
        document.querySelectorAll('.lang-option').forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.lang-option[data-lang="${lang}"]`).forEach(b => b.classList.add('active'));
        langDropdown.classList.remove('open');
        document.body.setAttribute('dir', lang === 'AR' ? 'rtl' : 'ltr');
        document.documentElement.lang = lang.toLowerCase();
      });
    });
  }

  // ── MOBILE MENU ───────────────────────────
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  if (hamburger) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.addEventListener('click', (e) => { if (e.target === mobileMenu) mobileMenu.classList.remove('open'); });
    document.querySelectorAll('.m-nav-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  // ── ACTIVE NAV ────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (sections.length) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const a = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => navObs.observe(s));
  }

  // ── ARTICLE MODAL ─────────────────────────
  const modalOverlay = document.getElementById('article-modal');
  const modalBody    = document.getElementById('modal-body');
  const modalClose   = document.getElementById('modal-close');

  function openModal(id) {
    const a = getArticleById(Number(id));
    if (!modalBody) return;
    modalBody.innerHTML = `
      <img src="${a.img || 'images/hero_banner.png'}" alt="${a.title}" onerror="this.style.display='none'" />
      <span class="modal-category">${a.category}</span>
      <h2 class="modal-title">${a.title}</h2>
      <div class="modal-meta">
        <span>By ${a.author}</span>
        <span>${a.date}</span>
        <span>${a.read}</span>
      </div>
      <div class="modal-content">${a.content}</div>
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalOverlay) { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }
  }

  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ── ATTACH CLICK TO ALL CARDS ──────────────
  // Use event delegation on the whole document for reliability
  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('[data-article]');
    if (card && !e.target.closest('#article-modal') && !e.target.closest('.modal-close')) {
      const id = card.getAttribute('data-article');
      if (id !== null) openModal(Number(id));
    }
  });

  // ── SUBSCRIBE FORM ────────────────────────
  const subForm    = document.getElementById('subscribe-form');
  const subSuccess = document.getElementById('sub-success');
  if (subForm) {
    subForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('sub-email').value.trim();
      const name  = document.getElementById('sub-name').value.trim();
      if (!email || !name) { shake(subForm.querySelector('button[type="submit"]')); return; }
      subForm.classList.add('hidden');
      if (subSuccess) subSuccess.classList.remove('hidden');
    });
  }

  // ── CONTACT FORM ──────────────────────────
  const ctForm = document.getElementById('contact-form');
  if (ctForm) {
    ctForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('ct-btn');
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'var(--moss)';
      setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 3500);
    });
  }

  // ── FAQ ───────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) { btn.setAttribute('aria-expanded', 'true'); btn.nextElementSibling.classList.add('open'); }
    });
  });

  function setupScrollAnimations() {
    const animEls = document.querySelectorAll(
      '.article-card, .list-card, .psych-main, .psych-small, .reflective-quote, .reflective-small, .campus-main, .campus-small, .about-card, .stat, .follow-card, .side-card'
    );
    animEls.forEach(el => el.classList.add('fade-in'));
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 55);
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    animEls.forEach(el => fadeObs.observe(el));
  }
  setupScrollAnimations();

  // ── SMOOTH SCROLL ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const offset = (header ? header.offsetHeight : 80) + 8;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // ── UTILITY ───────────────────────────────
  function shake(el) {
    if (!el) return;
    el.animate([
      {transform:'translateX(0)'},{transform:'translateX(-8px)'},
      {transform:'translateX(8px)'},{transform:'translateX(0)'}
    ], { duration: 400, easing: 'ease-in-out' });
  }

});
