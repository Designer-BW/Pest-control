/* Star Pest Control | prototype interactions (vanilla JS) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Preloader */
  const hidePreloader = () => $('#preloader')?.classList.add('is-done');
  window.addEventListener('load', () => setTimeout(hidePreloader, 300));
  setTimeout(hidePreloader, 3000); // safety net

  /* Prototype: navbar & CTA links are display-only */
  $$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* Toast */
  const toast = $('#toast');
  let toastTimer;
  window.showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  };

  /* Sticky header + back-to-top */
  const header = $('#siteHeader');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-stuck', y > 60);
    toTop.classList.toggle('show', y > window.innerHeight * 0.8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* Scroll reveal */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealIO.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealIO.observe(el));

  /* Counters */
  const animateCount = (el) => {
    const target = +el.dataset.target;
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countIO.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  $$('.counter').forEach(el => countIO.observe(el));

  /* Progress bars */
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.width + '%';
      barIO.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  $$('.progress-item__bar').forEach(el => barIO.observe(el));

  /* Sector tabs */
  const tabs = $$('.sector-tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    $$('.sector-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    $('#tab-' + tab.dataset.tab).classList.add('active');
  }));

  /* Close mobile menu after tapping a link */
  $$('#mainNav .nav-link').forEach(link => link.addEventListener('click', () => {
    const nav = $('#mainNav');
    if (nav.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  }));

  /* Quote form (prototype: validate, then confirm locally) */
  const form = $('#quoteForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(field => {
      const valid = field.checkValidity();
      field.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) { showToast('Please fill in the highlighted fields.'); return; }
    const name = $('#qName').value.trim().split(' ')[0];
    showToast(`Thanks ${name}! A Star technician will call you shortly. (prototype)`);
    form.reset();
  });
  form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));

  /* Year */
  $('#year').textContent = new Date().getFullYear();
})();
