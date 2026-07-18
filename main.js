/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===== MOBILE NAV ===== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== SCROLL REVEAL ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ===== FOOTER YEAR ===== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== BOOKING FORM ===== */
const form      = document.getElementById('bookingForm');
const success   = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText   = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoader.hidden = false;

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      let json = null;
      try { json = await res.json(); } catch {}

      const hasErrors = json?.errors?.length > 0;

      if (!hasErrors && res.status < 500) {
        form.hidden = true;
        success.hidden = false;
      } else {
        const msg = json?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
        showFormError(msg);
        resetBtn();
      }
    } catch {
      showFormError('Network error. Please check your connection and try again.');
      resetBtn();
    }
  });
}

function resetBtn() {
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = false;
  btnText.hidden = false;
  btnLoader.hidden = true;
}

function showFormError(msg) {
  let err = form.querySelector('.form-error-msg');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error-msg';
    err.style.cssText = 'color:#e05555;font-size:0.85rem;margin-top:-8px;';
    form.appendChild(err);
  }
  err.textContent = msg;
}

/* ===== SMOOTH ACTIVE NAV HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchor = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchor.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
