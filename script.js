(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const open = !menu?.classList.contains('is-open');
    menu?.classList.toggle('is-open', open);
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const heroTitles = [...document.querySelectorAll('.hero__title')];
  if (heroTitles.length > 1 && !reducedMotion) {
    let current = 0;
    window.setInterval(() => {
      heroTitles[current].classList.remove('is-active');
      current = (current + 1) % heroTitles.length;
      window.setTimeout(() => heroTitles[current].classList.add('is-active'), 140);
    }, 3800);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 5) * 45, 180)}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  document.querySelectorAll('.offer-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.offer-item');
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      const icon = trigger.querySelector('.offer-icon');
      if (icon) icon.textContent = open ? '−' : '+';
    });
  });

  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      const icon = button.querySelector('i');
      if (icon) icon.textContent = open ? '−' : '+';
    });
  });

  const parallaxAreas = document.querySelectorAll('[data-parallax-area]');
  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    parallaxAreas.forEach(area => {
      const layers = [...area.querySelectorAll('[data-parallax]')];
      let raf = 0;
      area.addEventListener('pointermove', event => {
        const rect = area.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          layers.forEach(layer => {
            const depth = Number(layer.dataset.parallax || 0);
            layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
          });
        });
      });
      area.addEventListener('pointerleave', () => {
        layers.forEach(layer => { layer.style.transform = ''; });
      });
    });
  }

  const toast = document.querySelector('[data-toast]');
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const message = [
      'Dzień dobry, chciałabym zapytać o wizytę w Olimpia Beauty & Massage.',
      '',
      `Imię: ${data.get('name') || '-'}`,
      `Telefon: ${data.get('phone') || '-'}`,
      `Rytuał: ${data.get('service') || '-'}`,
      `Wiadomość: ${data.get('message') || '-'}`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(message);
      showToast('Treść zapytania skopiowana. Otwieramy Messenger…');
    } catch (_) {
      showToast('Otwieramy Messenger. Skopiuj treść zapytania z formularza.');
    }

    window.setTimeout(() => {
      window.open('https://m.me/olimpia.beautyandmassage', '_blank', 'noopener');
    }, 500);
  });

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
