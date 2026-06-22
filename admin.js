/* =============================================
   PROVEN PSYCHOLOGY JOURNAL — admin.js
   Full CRUD for articles via REST API backend
   ============================================= */

// ── IMAGE UPLOAD HELPER ────────────────────────
async function uploadImageToServer(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.url; // e.g. "images/upload_1234567890.jpg"
}

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'ppj2026';

// ── ARTICLE STORE (REST API BACKEND) ───────────
let cachedArticles = [];

async function refreshArticles() {
  try {
    const res = await fetch('/api/articles');
    if (!res.ok) throw new Error('REST API returned status ' + res.status);
    cachedArticles = await res.json();
    // Sync to localStorage as backup
    try {
      localStorage.setItem('ppj_articles', JSON.stringify(cachedArticles));
    } catch (err) {}
    return cachedArticles;
  } catch (e) {
    console.warn('API fetch failed, falling back to local storage:', e);
    try {
      const stored = localStorage.getItem('ppj_articles');
      if (stored) {
        cachedArticles = JSON.parse(stored);
        if (cachedArticles && cachedArticles.length > 0) {
          return cachedArticles;
        }
      }
    } catch (err) {}
    cachedArticles = typeof DEFAULT_ARTICLES !== 'undefined' ? DEFAULT_ARTICLES : [];
    return cachedArticles;
  }
}

function loadArticles() {
  return cachedArticles;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  const parts = dateStr.split('-');
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseDateToYYYYMMDD(dateStr) {
  if (!dateStr) return '';
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch (e) {
    return '';
  }
}
function logActivity(msg) {
  const log = JSON.parse(localStorage.getItem('ppj_activity') || '[]');
  log.unshift({ msg, time: new Date().toLocaleString() });
  localStorage.setItem('ppj_activity', JSON.stringify(log.slice(0, 20)));
}

// ── CATEGORY BADGE ─────────────────────────────
function catClass(cat) {
  if (!cat) return 'cat-default';
  const c = cat.toLowerCase();
  if (c.includes('mindfulness')) return 'cat-mindfulness';
  if (c.includes('psychology'))  return 'cat-psychology';
  if (c.includes('reflective'))  return 'cat-reflective';
  if (c.includes('campus'))      return 'cat-campus';
  return 'cat-default';
}

// ── TOAST ──────────────────────────────────────
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'toast' + (type ? ' ' + type : '');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── DOM READY ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ── LOGIN ──────────────────────────────────
  const loginScreen = document.getElementById('login-screen');
  const adminApp    = document.getElementById('admin-app');
  const loginForm   = document.getElementById('login-form');
  const loginError  = document.getElementById('login-error');
  const logoutBtn   = document.getElementById('logout-btn');
  const togglePass  = document.getElementById('toggle-pass');
  const passInput   = document.getElementById('login-pass');

  // Auto-login if session exists
  if (sessionStorage.getItem('ppj_admin') === 'true') {
    loginScreen.classList.add('hidden');
    adminApp.classList.remove('hidden');
    refreshArticles().then(() => {
      initDashboard();
    });
  }

  togglePass.addEventListener('click', () => {
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
    togglePass.textContent = passInput.type === 'password' ? '👁' : '🙈';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('ppj_admin', 'true');
      loginError.classList.add('hidden');
      loginScreen.classList.add('hidden');
      adminApp.classList.remove('hidden');
      await refreshArticles();
      initDashboard();
    } else {
      loginError.classList.remove('hidden');
      loginError.textContent = 'Incorrect username or password. Try admin / ppj2026';
      passInput.value = '';
      passInput.focus();
      loginError.animate([
        { transform: 'translateX(0)' }, { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }
      ], { duration: 350 });
    }
  });

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('ppj_admin');
    adminApp.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
  });

  // ── SIDEBAR TOGGLE ─────────────────────────
  const sidebar       = document.getElementById('sidebar');
  const adminMain     = document.querySelector('.admin-main');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  sidebarToggle.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
      adminMain.classList.toggle('full');
    }
  });

  // Close sidebar on mobile when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
        sidebar.classList.remove('open');
      }
    }
  });

  // ── NAVIGATION ─────────────────────────────
  const views = {
    dashboard:   document.getElementById('view-dashboard'),
    articles:    document.getElementById('view-articles'),
    'new-article': document.getElementById('view-new-article')
  };
  const topbarTitle = document.getElementById('topbar-title');
  const viewTitles  = { dashboard: 'Dashboard', articles: 'All Articles', 'new-article': 'New Article' };

  async function switchView(name) {
    Object.keys(views).forEach(k => {
      views[k].classList.toggle('hidden', k !== name);
    });
    document.querySelectorAll('.sidebar-link[data-view]').forEach(l => {
      l.classList.toggle('active', l.dataset.view === name);
    });
    topbarTitle.textContent = viewTitles[name] || 'Dashboard';
    if (window.innerWidth <= 768) sidebar.classList.remove('open');

    await refreshArticles();

    if (name === 'dashboard')    renderDashboard();
    if (name === 'articles')     renderArticlesTable();
    if (name === 'new-article')  initNewArticleForm();
  }

  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const v = el.dataset.view;
      if (v) switchView(v);
    });
  });

  document.getElementById('topbar-new-btn').addEventListener('click', () => switchView('new-article'));
  document.getElementById('articles-new-btn').addEventListener('click', () => switchView('new-article'));

  // ── DASHBOARD ─────────────────────────────
  function renderDashboard() {
    const articles = loadArticles();
    const now = new Date();

    // Stats
    document.getElementById('stat-total').textContent = articles.length;
    const thisMonth = articles.filter(a => {
      if (!a.date) return false;
      try {
        const d = new Date(a.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      } catch { return false; }
    }).length;
    document.getElementById('stat-recent').textContent = thisMonth;

    // Category bars
    const catCounts = {};
    articles.forEach(a => { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });
    const maxCount = Math.max(...Object.values(catCounts), 1);
    const barsEl = document.getElementById('cat-bars');
    barsEl.innerHTML = '';
    const catColors = {
      'Mindfulness & Society':   '#606C38',
      'Psychology & Science':    '#BC6C25',
      'Reflective Insights':     '#DDA15E',
      'Campus News':             '#4a5c2e'
    };
    Object.entries(catCounts).sort((a,b) => b[1]-a[1]).forEach(([cat, count]) => {
      const pct = Math.round((count / maxCount) * 100);
      barsEl.innerHTML += `
        <div class="cat-bar-item">
          <div class="cat-bar-label">
            <span>${cat}</span><span>${count} article${count !== 1 ? 's' : ''}</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width:0%;background:${catColors[cat] || '#606C38'}" data-pct="${pct}"></div>
          </div>
        </div>`;
    });
    // Animate bars
    setTimeout(() => {
      barsEl.querySelectorAll('.cat-bar-fill').forEach(b => {
        b.style.width = b.dataset.pct + '%';
      });
    }, 100);

    // Activity log
    const activity = JSON.parse(localStorage.getItem('ppj_activity') || '[]');
    const actEl = document.getElementById('activity-list');
    if (activity.length === 0) {
      actEl.innerHTML = '<div class="activity-item"><div class="activity-text" style="color:var(--text-light)">No recent activity yet.</div></div>';
    } else {
      actEl.innerHTML = activity.slice(0, 6).map(a => `
        <div class="activity-item">
          <div class="activity-dot"></div>
          <div><div class="activity-text">${a.msg}</div><div class="activity-time">${a.time}</div></div>
        </div>`).join('');
    }

    // Recent articles table (last 5)
    const tbody = document.getElementById('dash-table-body');
    const recent = [...articles].reverse().slice(0, 5);
    tbody.innerHTML = recent.length ? recent.map(a => tableRow(a, true)).join('') : `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-light)">No articles yet.</td></tr>`;
    attachTableActions(tbody);
  }

  // ── ARTICLES TABLE ─────────────────────────
  function renderArticlesTable(filter = '', cat = '') {
    const articles = loadArticles();
    const tbody    = document.getElementById('articles-table-body');
    const emptyEl  = document.getElementById('articles-empty');

    let filtered = articles;
    if (filter) {
      const q = filter.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      );
    }
    if (cat) filtered = filtered.filter(a => a.category === cat);

    const reversed = [...filtered].reverse();
    if (reversed.length === 0) {
      tbody.innerHTML = '';
      emptyEl.classList.remove('hidden');
    } else {
      emptyEl.classList.add('hidden');
      tbody.innerHTML = reversed.map(a => tableRow(a, false)).join('');
      attachTableActions(tbody);
    }
  }

  function tableRow(a, short) {
    const excerpt = a.excerpt ? a.excerpt.substring(0, 60) + (a.excerpt.length > 60 ? '…' : '') : '';
    return `<tr data-id="${a.id}">
      <td class="td-title">${a.title}${short ? '' : `<small>${excerpt}</small>`}</td>
      <td><span class="cat-badge ${catClass(a.category)}">${a.category}</span></td>
      <td style="color:var(--text-mid);font-size:13px">${a.author || '—'}</td>
      <td style="color:var(--text-light);font-size:13px;white-space:nowrap">${formatDate(a.date) || '—'}</td>
      ${short ? '' : `<td style="color:var(--text-light);font-size:13px">${a.read || '—'}</td>`}
      <td>
        <div class="action-btns">
          <button class="btn-icon btn-edit" data-edit="${a.id}" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon btn-delete" data-delete="${a.id}" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }

  function attachTableActions(tbody) {
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditForm(Number(btn.dataset.edit)));
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(Number(btn.dataset.delete)));
    });
  }

  // Live search & filter
  const articleSearch = document.getElementById('article-search');
  const catFilter     = document.getElementById('cat-filter');
  if (articleSearch) {
    articleSearch.addEventListener('input', () =>
      renderArticlesTable(articleSearch.value, catFilter.value));
  }
  if (catFilter) {
    catFilter.addEventListener('change', () =>
      renderArticlesTable(articleSearch.value, catFilter.value));
  }

  // ── ARTICLE FORM (New + Edit) ─────────────
  const articleForm  = document.getElementById('article-form');
  const editIdField  = document.getElementById('edit-id');
  const formTitle    = document.getElementById('form-view-title');
  const blockEditor  = document.getElementById('block-editor');
  const cancelBtns   = [document.getElementById('cancel-btn'), document.getElementById('cancel-btn-2')];

  // ── BLOCK EDITOR ENGINE ────────────────────
  let blocks = []; // Array of { id, type: 'paragraph'|'image', text?, src?, align?, caption? }
  let blockCounter = 0;

  function makeBlockId() { return ++blockCounter; }

  function renderBlocks() {
    blockEditor.innerHTML = '';
    blocks.forEach((block, idx) => {
      const el = document.createElement('div');
      el.className = 'editor-block' + (block.type === 'image' ? ' image-block' : ' paragraph-block');
      el.dataset.id = block.id;

      if (block.type === 'paragraph') {
        el.innerHTML = `
          <div class="block-header">
            <span class="block-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="13" y1="18" x2="3" y2="18"/></svg>
              <span>${idx + 1}</span> PARAGRAPH
            </span>
            <button type="button" class="block-remove" data-bid="${block.id}" title="Remove block">× Remove</button>
          </div>
          <textarea class="block-textarea" data-bid="${block.id}" rows="5" placeholder="Write paragraph text here…">${escHtml(block.text || '')}</textarea>
        `;
      } else {
        const hasSrc = !!block.src;
        el.innerHTML = `
          <div class="block-header">
            <span class="block-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>${idx + 1}</span> IMAGE
            </span>
            <button type="button" class="block-remove" data-bid="${block.id}" title="Remove block">× Remove</button>
          </div>
          <div class="block-img-body">
            <div class="block-img-drop ${hasSrc ? 'hidden' : ''}" data-bid="${block.id}">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>Click to upload image</span>
              <input type="file" accept="image/*" class="block-file-input" data-bid="${block.id}" />
            </div>
            <div class="block-img-preview ${hasSrc ? '' : 'hidden'}" data-bid="${block.id}">
              <img src="${hasSrc ? block.src : ''}" alt="Block image" class="block-thumb" data-bid="${block.id}" />
              <div class="block-img-side">
                <div class="block-align-group">
                  <label class="block-align-opt ${(block.align || 'center') === 'center' ? 'active' : ''}">
                    <input type="radio" name="align-${block.id}" value="center" ${(block.align || 'center') === 'center' ? 'checked' : ''} data-bid="${block.id}" class="block-align-radio" /> Full Width
                  </label>
                  <label class="block-align-opt ${block.align === 'left' ? 'active' : ''}">
                    <input type="radio" name="align-${block.id}" value="left" ${block.align === 'left' ? 'checked' : ''} data-bid="${block.id}" class="block-align-radio" /> Left
                  </label>
                  <label class="block-align-opt ${block.align === 'right' ? 'active' : ''}">
                    <input type="radio" name="align-${block.id}" value="right" ${block.align === 'right' ? 'checked' : ''} data-bid="${block.id}" class="block-align-radio" /> Right
                  </label>
                </div>
                <input type="text" class="block-caption" data-bid="${block.id}" placeholder="Photo credit (optional)" value="${escHtml(block.caption || '')}" />
                <div class="block-img-actions">
                  <label class="btn-block-change">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Change
                    <input type="file" accept="image/*" class="block-file-change" data-bid="${block.id}" style="display:none;" />
                  </label>
                  <button type="button" class="btn-block-rmphoto" data-bid="${block.id}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    Remove photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      blockEditor.appendChild(el);
    });
    attachBlockListeners();
    updateBlockNumbers();
    updateReadTimeFromBlocks();
  }

  function updateBlockNumbers() {
    blockEditor.querySelectorAll('.block-label span').forEach((span, i) => {
      span.textContent = i + 1;
    });
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function updateReadTimeFromBlocks() {
    const text = blocks.filter(b => b.type === 'paragraph').map(b => b.text || '').join(' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const rtEl = document.getElementById('art-read');
    if (rtEl) rtEl.value = `${minutes} min read`;
  }

  function attachBlockListeners() {
    // Remove block
    blockEditor.querySelectorAll('.block-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        blocks = blocks.filter(b => b.id !== Number(btn.dataset.bid));
        renderBlocks();
      });
    });

    // Paragraph textarea — live sync text into block data
    blockEditor.querySelectorAll('.block-textarea').forEach(ta => {
      ta.addEventListener('input', () => {
        const bid = Number(ta.dataset.bid);
        const b = blocks.find(x => x.id === bid);
        if (b) { b.text = ta.value; updateReadTimeFromBlocks(); }
      });
    });

    // Alignment radio buttons
    blockEditor.querySelectorAll('.block-align-radio').forEach(radio => {
      radio.addEventListener('change', () => {
        const bid = Number(radio.dataset.bid);
        const b = blocks.find(x => x.id === bid);
        if (b) {
          b.align = radio.value;
          // Update active class on labels
          blockEditor.querySelectorAll(`.block-align-opt`).forEach(opt => {
            const r = opt.querySelector('input[type="radio"]');
            if (r && r.name === radio.name) {
              opt.classList.toggle('active', r.value === radio.value);
            }
          });
        }
      });
    });

    // Caption input
    blockEditor.querySelectorAll('.block-caption').forEach(cap => {
      cap.addEventListener('input', () => {
        const bid = Number(cap.dataset.bid);
        const b = blocks.find(x => x.id === bid);
        if (b) b.caption = cap.value;
      });
    });

    // Upload image in image block
    blockEditor.querySelectorAll('.block-file-input').forEach(input => {
      input.addEventListener('change', async () => {
        const bid = Number(input.dataset.bid);
        const file = input.files[0];
        if (!file) return;
        input.value = '';
        showToast('Uploading image…', 'info');
        try {
          const url = await uploadImageToServer(file);
          const b = blocks.find(x => x.id === bid);
          if (b) { b.src = url; renderBlocks(); }
          showToast('Image uploaded ✓', 'success');
        } catch(err) { showToast('Upload failed: ' + err.message, 'error'); }
      });
    });

    // Change image
    blockEditor.querySelectorAll('.block-file-change').forEach(input => {
      input.addEventListener('change', async () => {
        const bid = Number(input.dataset.bid);
        const file = input.files[0];
        if (!file) return;
        input.value = '';
        showToast('Uploading image…', 'info');
        try {
          const url = await uploadImageToServer(file);
          const b = blocks.find(x => x.id === bid);
          if (b) { b.src = url; renderBlocks(); }
          showToast('Image uploaded ✓', 'success');
        } catch(err) { showToast('Upload failed: ' + err.message, 'error'); }
      });
    });

    // Remove photo (keeps the image block, clears the image src)
    blockEditor.querySelectorAll('.btn-block-rmphoto').forEach(btn => {
      btn.addEventListener('click', () => {
        const bid = Number(btn.dataset.bid);
        const b = blocks.find(x => x.id === bid);
        if (b) { b.src = ''; renderBlocks(); }
      });
    });
  }

  function addParagraphBlock() {
    blocks.push({ id: makeBlockId(), type: 'paragraph', text: '' });
    renderBlocks();
    // Focus the new textarea
    const tas = blockEditor.querySelectorAll('.block-textarea');
    if (tas.length) tas[tas.length - 1].focus();
  }

  function addImageBlock() {
    const imgCount = blocks.filter(b => b.type === 'image').length;
    if (imgCount >= 5) { showToast('Maximum of 5 images per article.', 'error'); return; }
    blocks.push({ id: makeBlockId(), type: 'image', src: '', align: 'center', caption: '' });
    renderBlocks();
  }

  document.getElementById('btn-add-paragraph').addEventListener('click', addParagraphBlock);
  document.getElementById('btn-add-image').addEventListener('click', addImageBlock);

  // Serialize blocks → HTML string for saving
  function blocksToHtml() {
    return blocks.map(b => {
      if (b.type === 'paragraph') {
        if (!(b.text || '').trim()) return '';
        const lines = b.text.replace(/</g,'&lt;').replace(/>/g,'&gt;').split(/\r?\n\n+/);
        return lines.map(l => `<p>${l.replace(/\r?\n/g, '<br>')}</p>`).join('');
      } else {
        if (!b.src) return '';
        let figStyle = '', imgStyle = '';
        if (b.align === 'left') {
          figStyle = 'float:left;margin:0.5rem 1.5rem 1rem 0;max-width:45%;';
          imgStyle = 'width:100%;height:auto;border-radius:8px;display:block;';
        } else if (b.align === 'right') {
          figStyle = 'float:right;margin:0.5rem 0 1rem 1.5rem;max-width:45%;';
          imgStyle = 'width:100%;height:auto;border-radius:8px;display:block;';
        } else {
          figStyle = 'clear:both;margin:1.5rem auto;max-width:100%;text-align:center;';
          imgStyle = 'max-width:100%;height:auto;border-radius:8px;display:inline-block;';
        }
        const caption = b.caption ? `<figcaption>${b.caption.replace(/</g,'&lt;')}</figcaption>` : '';
        return `<figure class="article-img-align-${b.align || 'center'}" style="${figStyle}"><img src="${b.src}" alt="Article Image" style="${imgStyle}" />${caption}</figure>`;
      }
    }).join('');
  }

  // Parse HTML → blocks (for editing existing articles)
  function htmlToBlocks(html) {
    if (!html) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const result = [];
    doc.body.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          result.push({ id: makeBlockId(), type: 'paragraph', text: node.textContent.trim() });
        }
        return;
      }
      if (node.nodeName === 'FIGURE' || (node.nodeName === 'IMG')) {
        const img = node.nodeName === 'IMG' ? node : node.querySelector('img');
        if (!img) return;
        const cls = node.className || '';
        let align = 'center';
        if (cls.includes('left')) align = 'left';
        else if (cls.includes('right')) align = 'right';
        const cap = node.querySelector ? node.querySelector('figcaption') : null;
        result.push({ id: makeBlockId(), type: 'image', src: img.src || img.getAttribute('src') || '', align, caption: cap ? cap.textContent : '' });
      } else if (['P','H1','H2','H3','H4','BLOCKQUOTE','UL','OL','PRE'].includes(node.nodeName)) {
        const t = node.textContent.trim();
        if (t) result.push({ id: makeBlockId(), type: 'paragraph', text: t });
      }
    });
    return result;
  }

  cancelBtns.forEach(btn => btn && btn.addEventListener('click', () => {
    switchView('articles');
  }));

  function initNewArticleForm() {
    formTitle.textContent = 'New Article';
    document.getElementById('save-btn').textContent = 'Publish Article';
    editIdField.value = '';
    articleForm.reset();
    blocks = [];
    renderBlocks();
    setCoverImg('');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('art-date').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('art-read').value = '1 min read';
    topbarTitle.textContent = 'New Article';
    document.querySelectorAll('.sidebar-link[data-view]').forEach(l => l.classList.remove('active'));
    document.getElementById('nav-new').classList.add('active');
  }

  function openEditForm(id) {
    const articles = loadArticles();
    const a = articles.find(x => x.id === id);
    if (!a) return;

    Object.keys(views).forEach(k => {
      views[k].classList.toggle('hidden', k !== 'new-article');
    });
    document.querySelectorAll('.sidebar-link[data-view]').forEach(l => {
      l.classList.toggle('active', l.dataset.view === 'new-article');
    });
    if (window.innerWidth <= 768) sidebar.classList.remove('open');

    formTitle.textContent = 'Edit Article';
    topbarTitle.textContent = 'Edit Article';
    document.getElementById('save-btn').textContent = 'Save Changes';
    editIdField.value = String(id);

    document.getElementById('art-title').value    = a.title    || '';
    document.getElementById('art-category').value = a.category || '';
    document.getElementById('art-author').value   = a.author   || '';
    document.getElementById('art-date').value     = parseDateToYYYYMMDD(a.date);
    document.getElementById('art-excerpt').value  = a.excerpt  || '';

    setCoverImg(a.img || '');
    blocks = htmlToBlocks(a.content || '');
    renderBlocks();
    updateReadTimeFromBlocks();
  }

  // ── COVER IMAGE DROP ZONE ──────────────────
  function setCoverImg(src) {
    const hidden = document.getElementById('art-img');
    const placeholder = document.getElementById('cover-drop-placeholder');
    const preview = document.getElementById('cover-drop-preview');
    const thumb = document.getElementById('cover-thumb');
    if (!hidden || !placeholder || !preview || !thumb) return;
    if (src) {
      hidden.value = src;
      thumb.src = src;
      placeholder.classList.add('hidden');
      preview.classList.remove('hidden');
    } else {
      hidden.value = '';
      thumb.src = '';
      preview.classList.add('hidden');
      placeholder.classList.remove('hidden');
    }
  }

  function bindCoverUpload(inputEl) {
    inputEl.addEventListener('change', async () => {
      const file = inputEl.files[0];
      if (!file) return;
      inputEl.value = '';
      showToast('Uploading cover image…', 'info');
      try {
        const url = await uploadImageToServer(file);
        setCoverImg(url);
        showToast('Cover image uploaded ✓', 'success');
      } catch(err) { showToast('Upload failed: ' + err.message, 'error'); }
    });
  }

  const coverFileInput = document.getElementById('art-img-file');
  const coverFileChange = document.getElementById('art-img-file-change');
  const coverRemoveBtn = document.getElementById('btn-cover-remove');
  if (coverFileInput) bindCoverUpload(coverFileInput);
  if (coverFileChange) bindCoverUpload(coverFileChange);
  if (coverRemoveBtn) coverRemoveBtn.addEventListener('click', () => setCoverImg(''));

  // ── FORM SUBMIT ────────────────────────────
  articleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title   = document.getElementById('art-title').value.trim();
    const cat     = document.getElementById('art-category').value;
    const author  = document.getElementById('art-author').value.trim();
    const content = blocksToHtml();

    if (!title)   { highlight(document.getElementById('art-title')); return; }
    if (!cat)     { highlight(document.getElementById('art-category')); return; }
    if (!author)  { highlight(document.getElementById('art-author')); return; }
    if (!content) { showToast('Please add at least one paragraph block.', 'error'); return; }

    const editId = editIdField.value;
    const articleData = {
      title,
      category: cat,
      author,
      date:    document.getElementById('art-date').value,
      excerpt: document.getElementById('art-excerpt').value.trim(),
      img:     document.getElementById('art-img').value.trim() || 'images/hero_banner.png',
      content
    };

    try {
      if (editId !== '') {
        try {
          const res = await fetch(`/api/articles/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
          });
          if (!res.ok) throw new Error('REST API returned status ' + res.status);
          logActivity(`Updated article: <strong>"${title}"</strong>`);
          showToast('Article updated successfully ✓', 'success');
        } catch (apiErr) {
          console.warn('API update failed, fallback to local storage:', apiErr);
          const idx = cachedArticles.findIndex(a => a.id === Number(editId));
          if (idx !== -1) {
            cachedArticles[idx] = { ...cachedArticles[idx], ...articleData, read: document.getElementById('art-read').value };
            localStorage.setItem('ppj_articles', JSON.stringify(cachedArticles));
            logActivity(`Updated article: <strong>"${title}"</strong> (Local)`);
            showToast('Article updated locally ✓', 'success');
          } else { throw apiErr; }
        }
      } else {
        try {
          const res = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
          });
          if (!res.ok) throw new Error('REST API returned status ' + res.status);
          logActivity(`Published new article: <strong>"${title}"</strong>`);
          showToast('Article published successfully ✓', 'success');
        } catch (apiErr) {
          console.warn('API publish failed, fallback to local storage:', apiErr);
          const newId = cachedArticles.length > 0 ? Math.max(...cachedArticles.map(a => a.id)) + 1 : 100;
          cachedArticles.push({ id: newId, ...articleData, read: document.getElementById('art-read').value });
          localStorage.setItem('ppj_articles', JSON.stringify(cachedArticles));
          logActivity(`Published new article: <strong>"${title}"</strong> (Local)`);
          showToast('Article published locally ✓', 'success');
        }
      }

      await refreshArticles();
      switchView('articles');
      renderArticlesTable();
    } catch (err) {
      showToast('Error saving article: ' + err.message, 'error');
    }
  });

  function highlight(el) {
    el.style.borderColor = '#c0392b';
    el.focus();
    el.animate([
      { transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }
    ], { duration: 320 });
    setTimeout(() => el.style.borderColor = '', 2000);
  }

  // ── DELETE MODAL ───────────────────────────
  const deleteModal   = document.getElementById('delete-modal');
  const deleteConfirm = document.getElementById('delete-confirm');
  const deleteCancel  = document.getElementById('delete-cancel');
  const deleteTitlePrev = document.getElementById('delete-title-preview');
  let pendingDeleteId = null;

  function openDeleteModal(id) {
    const articles = loadArticles();
    const a = articles.find(x => x.id === id);
    if (!a) return;
    pendingDeleteId = id;
    deleteTitlePrev.textContent = `"${a.title}" will be permanently removed.`;
    deleteModal.classList.add('open');
  }

  deleteCancel.addEventListener('click', () => {
    deleteModal.classList.remove('open');
    pendingDeleteId = null;
  });
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) { deleteModal.classList.remove('open'); pendingDeleteId = null; }
  });

  deleteConfirm.addEventListener('click', async () => {
    if (pendingDeleteId === null) return;
    const articles = loadArticles();
    const a = articles.find(x => x.id === pendingDeleteId);
    try {
      try {
        const res = await fetch(`/api/articles/${pendingDeleteId}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('REST API returned status ' + res.status);
        if (a) logActivity(`Deleted article: <strong>"${a.title}"</strong>`);
        showToast('Article deleted.', 'error');
      } catch (apiErr) {
        console.warn('API delete failed, fallback to local storage:', apiErr);
        const filtered = cachedArticles.filter(x => x.id !== pendingDeleteId);
        localStorage.setItem('lumina_articles', JSON.stringify(filtered));
        if (a) logActivity(`Deleted article: <strong>"${a.title}"</strong> (Local)`);
        showToast('Article deleted locally.', 'error');
      }
      
      deleteModal.classList.remove('open');
      pendingDeleteId = null;
      
      await refreshArticles();
      renderDashboard();
      renderArticlesTable(
        articleSearch ? articleSearch.value : '',
        catFilter ? catFilter.value : ''
      );
    } catch (err) {
      showToast('Error deleting article: ' + err.message, 'error');
    }
  });

  // ── INIT ───────────────────────────────────
  function initDashboard() {
    renderDashboard();
    renderArticlesTable();
  }

});
