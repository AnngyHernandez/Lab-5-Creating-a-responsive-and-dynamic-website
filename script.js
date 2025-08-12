// Collapsing menu with addEventListener
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle && siteNav){
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Dynamic year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();


// Fetch & render reviews (local JSON for offline reliability)
const reviewsEl = document.getElementById('reviews');
const moreBtn = document.getElementById('moreReviews');

let page = 0;
const PER_PAGE = 3;

async function loadReviews() {
  if (!reviewsEl) return;
  reviewsEl.setAttribute('aria-busy', 'true');

  const res = await fetch('reviews.json');
  const data = await res.json();

  const start = page * PER_PAGE;
  const slice = data.slice(start, start + PER_PAGE);

  slice.forEach(r => {
    const card = document.createElement('article');
    card.className = 'review';
    card.innerHTML = `
      <h3>${r.name} — ${r.city}</h3>
      <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p>${r.text}</p>
      <small>${r.date}</small>
    `;
    reviewsEl.appendChild(card);
  });

  page++;
  reviewsEl.setAttribute('aria-busy', 'false');


  // Hide "Load more" if no more pages
  if (start + PER_PAGE >= data.length && moreBtn) {
    moreBtn.style.display = 'none';
  }
}

moreBtn?.addEventListener('click', loadReviews);
loadReviews(); // initial load

    // Quote form: email validation + popup success
(function () {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const email = document.getElementById('email');
  const note = document.getElementById('formNote');
  const modal = document.getElementById('notifyModal');
  const modalClose = document.getElementById('modalClose');

  // Simple, reliable email check
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(val).trim());

  function showError(msg) {
    note.textContent = msg;
    note.classList.add('form-error');
    email.classList.add('is-invalid');
    email.setAttribute('aria-invalid', 'true');
    email.focus();
  }

  function clearError() {
    note.textContent = '';
    note.classList.remove('form-error');
    email.classList.remove('is-invalid');
    email.removeAttribute('aria-invalid');
  }

  function openModal() { modal.hidden = false; modalClose.focus(); }
  function closeModal() { modal.hidden = true; }

  // Close modal on button, overlay click, or Esc
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (!modal.hidden && e.key === 'Escape') closeModal(); });

  // Live validate when user edits the email field
  email?.addEventListener('input', clearError);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    // Built-in + custom validation
    if (!email.value || !isValidEmail(email.value) || !email.checkValidity()) {
      showError('Please enter a valid email address.');
      return;
    }

    // If you later wire this to a backend, do your fetch here.
    // For now we just show a confirmation popup.
    openModal();
    form.reset();
  });
})();
