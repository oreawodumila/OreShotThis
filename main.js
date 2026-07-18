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

/* ===== DFW VALIDATION ===== */
const DFW_CITIES = [
  'dallas','fort worth','arlington','plano','garland','irving','grand prairie',
  'mesquite','frisco','mckinney','denton','carrollton','richardson','lewisville',
  'allen','flower mound','rowlett','north richland hills','mansfield','euless',
  'cedar hill','wylie','haltom city','bedford','keller','hurst','duncanville',
  'desoto','grapevine','waxahachie','rockwall','forney','weatherford','burleson',
  'cleburne','azle','saginaw','watauga','colleyville','southlake','coppell',
  'farmers branch','addison','universitypark','highland park','lancaster',
  'balch springs','sachse','murphy','sunnyvale','seagoville','hutchins',
  'wilmer','midlothian','ennis','kaufman','terrell','fate','royse city',
  'melissa','prosper','celina','little elm','the colony','corinth','lake dallas',
  'argyle','justin','roanoke','trophy club','westlake','collinsville','anna',
  'van alstyne','gunter','sherman', 'gainesville','decatur','mineral wells'
];

const DFW_COUNTIES = [
  'dallas county','tarrant county','collin county','denton county',
  'rockwall county','kaufman county','ellis county','johnson county',
  'parker county','wise county','hood county','hunt county'
];

function isInDFW(address) {
  const lower = address.toLowerCase();
  return DFW_CITIES.some(c => lower.includes(c)) ||
         DFW_COUNTIES.some(c => lower.includes(c));
}

/* ===== BOOKING FORM ===== */
const form      = document.getElementById('bookingForm');
const success   = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const addressInput = document.getElementById('address');
const addressError = document.getElementById('addressError');

if (addressInput) {
  addressInput.addEventListener('blur', () => {
    const val = addressInput.value.trim();
    if (val && !isInDFW(val)) {
      addressError.hidden = false;
      addressInput.classList.add('field-error');
    } else {
      addressError.hidden = true;
      addressInput.classList.remove('field-error');
    }
  });
  addressInput.addEventListener('input', () => {
    if (isInDFW(addressInput.value)) {
      addressError.hidden = true;
      addressInput.classList.remove('field-error');
    }
  });
}

function showSuccess() {
  form.style.display = 'none';
  success.style.display = 'block';
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (addressInput && !isInDFW(addressInput.value.trim())) {
      addressError.hidden = false;
      addressInput.classList.add('field-error');
      addressInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const btnText   = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    const data = new FormData(form);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeout);

      let json = null;
      try { json = await res.json(); } catch {}

      if (json?.errors?.length > 0) {
        showFormError(json.errors.map(err => err.message).join(', '));
        resetBtn();
      } else {
        showSuccess();
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        showSuccess();
      } else {
        showFormError('Network error. Please check your connection and try again.');
        resetBtn();
      }
    }
  });
}

function resetBtn() {
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  submitBtn.disabled = false;
  btnText.style.display = 'inline';
  btnLoader.style.display = 'none';
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
