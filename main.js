/* ═══════════════════════════════════════════════════
   PRESTIGE REALTY — main.js
   ═══════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   ⚙️  CONFIG — fill these in before going live
   ══════════════════════════════════════════ */
const CONFIG = {
  // ── EmailJS ──────────────────────────────
  // 1. Sign up free at https://www.emailjs.com
  // 2. Create a Service (Gmail/Outlook/etc) → copy Service ID
  // 3. Create an Email Template → copy Template ID
  // 4. Go to Account → copy your Public Key
  emailjs: {
    publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',   // e.g. 'user_abc123XYZ'
    serviceId:  'YOUR_SERVICE_ID',           // e.g. 'service_gmail'
    templateId: 'YOUR_TEMPLATE_ID',          // e.g. 'template_enquiry'
  },

  // ── WhatsApp ─────────────────────────────
  // Your WhatsApp number in international format, digits only
  // e.g. Australia +61 412 345 678 → '61412345678'
  whatsappNumber: 'YOUR_WHATSAPP_NUMBER',    // e.g. '61412345678'
};

/* ══════════════════════════════════════════
   PANEL REGISTRY
   ══════════════════════════════════════════ */
const PANELS = [
  { id: 'p-home',     label: 'Home' },
  { id: 'p-stats',   label: 'Stats' },
  { id: 'p-listings',label: 'Coming Soon' },
  { id: 'p-about',   label: 'About' },
  { id: 'p-team',    label: 'Team' },
  { id: 'p-contact', label: 'Contact' },
  { id: 'p-footer',  label: 'Footer' },
];

/* ══════════════════════════════════════════
   STATE
   ══════════════════════════════════════════ */
let currentPanel = 0;
let isSnapping   = false;

/* ══════════════════════════════════════════
   DOM REFS
   ══════════════════════════════════════════ */
const snapWrap   = document.getElementById('snap-wrap');
const mainNav    = document.getElementById('main-nav');
const progressEl = document.getElementById('progress-bar');
const dotNavEl   = document.getElementById('dot-nav');

/* ══════════════════════════════════════════
   EMAILJS INIT
   ══════════════════════════════════════════ */
emailjs.init(CONFIG.emailjs.publicKey);

/* ══════════════════════════════════════════
   BUILD DOT NAV
   ══════════════════════════════════════════ */
PANELS.forEach((p, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.title = p.label;
  dot.addEventListener('click', () => goToPanel(i));
  dotNavEl.appendChild(dot);
});

/* ══════════════════════════════════════════
   GO TO PANEL
   ══════════════════════════════════════════ */
function goToPanel(index, animate = true) {
  index = Math.max(0, Math.min(PANELS.length - 1, index));
  if (index === currentPanel && animate) return;

  isSnapping   = true;
  currentPanel = index;

  const target = document.getElementById(PANELS[index].id);
  if (!target) return;

  snapWrap.scrollTo({ top: target.offsetTop, behavior: animate ? 'smooth' : 'instant' });
  syncUI(index);

  clearTimeout(window._snapTimer);
  window._snapTimer = setTimeout(() => { isSnapping = false; }, 900);
}

/* ══════════════════════════════════════════
   SYNC UI
   ══════════════════════════════════════════ */
function syncUI(index) {
  document.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === index)
  );
  document.querySelectorAll('#main-nav [data-panel]').forEach(a =>
    a.classList.toggle('active', parseInt(a.dataset.panel) === index)
  );
  mainNav.classList.toggle('condensed', index > 0);
  const pct = PANELS.length > 1 ? (index / (PANELS.length - 1)) * 100 : 0;
  progressEl.style.width = pct + '%';
}

/* ══════════════════════════════════════════
   INTERSECTION OBSERVER — active panel
   ══════════════════════════════════════════ */
const panelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const idx = PANELS.findIndex(p => p.id === entry.target.id);
    if (idx !== -1 && idx !== currentPanel) {
      currentPanel = idx;
      syncUI(idx);
      revealPanel(entry.target);
    }
  });
}, { root: snapWrap, threshold: 0.55 });

PANELS.forEach(p => {
  const el = document.getElementById(p.id);
  if (el) panelObserver.observe(el);
});

/* ══════════════════════════════════════════
   KEYBOARD NAV
   ══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (isSnapping) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goToPanel(currentPanel + 1); }
  if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); goToPanel(currentPanel - 1); }
});

/* ══════════════════════════════════════════
   WHEEL — respect inner scrollers
   ══════════════════════════════════════════ */
snapWrap.addEventListener('wheel', e => {
  const inner = e.target.closest('.panel-inner');
  if (inner) {
    const atTop    = inner.scrollTop <= 0;
    const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 2;
    if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
  }
  if (isSnapping) { e.preventDefault(); return; }
  e.preventDefault();
  goToPanel(e.deltaY > 0 ? currentPanel + 1 : currentPanel - 1);
}, { passive: false });

/* ══════════════════════════════════════════
   TOUCH NAV
   ══════════════════════════════════════════ */
let touchStartY = 0;
snapWrap.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

snapWrap.addEventListener('touchend', e => {
  if (isSnapping) return;
  const delta = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(delta) < 40) return;
  const inner = e.target.closest('.panel-inner');
  if (inner) {
    const atTop    = inner.scrollTop <= 0;
    const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 2;
    if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) return;
  }
  goToPanel(delta > 0 ? currentPanel + 1 : currentPanel - 1);
}, { passive: true });

/* ══════════════════════════════════════════
   NAV + BUTTON CLICKS
   ══════════════════════════════════════════ */
document.querySelectorAll('[data-panel]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    goToPanel(parseInt(el.dataset.panel));
  });
});

/* ══════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      const r = entry.boundingClientRect;
      if (r.bottom < 0 || r.top > window.innerHeight) {
        entry.target.classList.remove('visible');
      }
    }
  });
}, { root: snapWrap, threshold: 0.08 });

function observeRevealEls(root = document) {
  root.querySelectorAll('.r-up, .r-left, .r-right, .r-scale, .divider-line').forEach(el => {
    revealObserver.observe(el);
  });
}
observeRevealEls();

function revealPanel(panel) {
  panel.querySelectorAll('.r-up, .r-left, .r-right, .r-scale, .divider-line').forEach(el => {
    el.classList.add('visible');
  });
}

/* ══════════════════════════════════════════
   HERO MOUSE PARALLAX
   ══════════════════════════════════════════ */
const heroPanel = document.getElementById('p-home');
heroPanel.addEventListener('mousemove', e => {
  const r  = heroPanel.getBoundingClientRect();
  const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
  const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
  document.getElementById('orb1').style.transform = `translate(${dx*22}px,${dy*22}px)`;
  document.getElementById('orb2').style.transform = `translate(${dx*-14}px,${dy*-14}px)`;
  document.getElementById('orb3').style.transform = `translate(${dx*16}px,${dy*10}px)`;
  document.querySelector('.hero-pattern').style.transform = `translate(${dx*9}px,${dy*9}px)`;
});

/* ══════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════ */
const cursorEl = document.getElementById('cursor');
const ringEl   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorEl.style.left = mx + 'px';
  cursorEl.style.top  = my + 'px';
});
(function tickCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ringEl.style.left = rx + 'px';
  ringEl.style.top  = ry + 'px';
  requestAnimationFrame(tickCursor);
})();

function attachCursorHover(root = document) {
  root.querySelectorAll(
    'a, button, .team-card, .about-stat, .cs-teaser-card, .dot, .stat-box'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
attachCursorHover();

/* ══════════════════════════════════════════
   WAITLIST — Coming Soon panel
   Sends via EmailJS (same service as contact)
   ══════════════════════════════════════════ */
window.joinWaitlist = async function () {
  const name  = document.getElementById('wl-name').value.trim();
  const email = document.getElementById('wl-email').value.trim();

  if (!name || !email) {
    alert('Please enter your name and email.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const btn = document.querySelector('.cs-btn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';

  try {
    await emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.templateId,
      {
        from_name:    name,
        from_email:   email,
        message:      `New waitlist signup from the Coming Soon page.\nName: ${name}\nEmail: ${email}`,
        subject:      '🏠 New Waitlist Signup — Prestige Realty',
      }
    );
    document.getElementById('cs-form').style.display    = 'none';
    document.getElementById('cs-success').style.display = 'block';
  } catch (err) {
    console.error('EmailJS error:', err);
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Notify Me';
    alert('Something went wrong. Please try again or contact us directly.');
  }
};

/* ══════════════════════════════════════════
   CONTACT FORM — Email + WhatsApp
   ══════════════════════════════════════════ */
function getFormData() {
  return {
    fname:    (document.getElementById('fname')?.value    || '').trim(),
    lname:    (document.getElementById('lname')?.value    || '').trim(),
    email:    (document.getElementById('email')?.value    || '').trim(),
    phone:    (document.getElementById('phone')?.value    || '').trim(),
    interest: (document.getElementById('interest')?.value || '').trim(),
    msg:      (document.getElementById('msg')?.value      || '').trim(),
  };
}

function validateForm(d) {
  if (!d.fname) { alert('Please enter your first name.'); return false; }
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    alert('Please enter a valid email address.'); return false;
  }
  return true;
}

window.submitForm = async function (method) {
  const d = getFormData();
  if (!validateForm(d)) return;

  // ── WhatsApp path ──
  if (method === 'whatsapp') {
    const text = encodeURIComponent(
      `Hello Prestige Realty! 👋\n\n` +
      `*Name:* ${d.fname} ${d.lname}\n` +
      `*Email:* ${d.email}\n` +
      `*Phone:* ${d.phone || 'Not provided'}\n` +
      `*Interested in:* ${d.interest}\n` +
      `*Message:* ${d.msg || 'No message'}`
    );
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${text}`, '_blank');
    showContactSuccess();
    return;
  }

  // ── Email path via EmailJS ──
  const btns = document.querySelectorAll('.form-btn');
  btns.forEach(b => { b.disabled = true; });
  document.querySelector('.form-btn span').textContent = 'Sending…';

  try {
    await emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.templateId,
      {
        from_name:  `${d.fname} ${d.lname}`,
        from_email: d.email,
        phone:      d.phone || 'Not provided',
        interest:   d.interest,
        message:    d.msg || 'No message provided',
        subject:    `New Enquiry — ${d.interest}`,
      }
    );
    showContactSuccess();
  } catch (err) {
    console.error('EmailJS error:', err);
    alert('Email could not be sent. Please try WhatsApp instead, or email us directly.');
  } finally {
    btns.forEach(b => { b.disabled = false; });
    document.querySelectorAll('.form-btn span').forEach((s, i) => {
      s.textContent = i === 0 ? '✉ Send via Email' : '💬 Send via WhatsApp';
    });
  }
};

function showContactSuccess() {
  const el = document.getElementById('form-success');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 6000);
}

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
syncUI(0);
setTimeout(() => revealPanel(heroPanel), 350);
