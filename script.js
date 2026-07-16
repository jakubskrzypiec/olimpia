(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const toast = document.querySelector('[data-toast]');

  const setHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 28);
  };
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.classList.toggle('is-open', !open);
      menu.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }));
  }

  const heroSlides = [...document.querySelectorAll('.hero__slide')];
  const heroCurrent = document.querySelector('[data-hero-current]');
  let heroIndex = 0;
  if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => {
      heroSlides[heroIndex].classList.remove('is-active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('is-active');
      if (heroCurrent) heroCurrent.textContent = String(heroIndex + 1).padStart(2, '0');
    }, 3800);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -55px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const setupAccordion = (rootSelector, itemSelector, triggerSelector, closeOthers = false) => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    root.querySelectorAll(triggerSelector).forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest(itemSelector);
        if (!item) return;
        const isOpen = item.classList.contains('is-open');
        if (closeOthers) {
          root.querySelectorAll(`${itemSelector}.is-open`).forEach((openItem) => {
            if (openItem === item) return;
            openItem.classList.remove('is-open');
            openItem.querySelector(triggerSelector)?.setAttribute('aria-expanded', 'false');
          });
        }
        item.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  };

  setupAccordion('[data-rituals]', '.ritual-band', '.ritual-band__trigger', false);
  setupAccordion('[data-prices]', '.price-category', '.price-category__trigger', true);
  setupAccordion('[data-faq]', '.faq-item', 'button', true);

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const message = [
        'Dzień dobry,',
        '',
        `mam na imię ${data.get('name') || ''}.`,
        `Kontakt: ${data.get('contact') || ''}`,
        `Interesuje mnie: ${data.get('service') || ''}`,
        data.get('message') ? `Wiadomość: ${data.get('message')}` : '',
        '',
        'Proszę o informację w sprawie wizyty.'
      ].filter(Boolean).join('\n');

      try {
        await navigator.clipboard.writeText(message);
        showToast('Wiadomość została skopiowana. Otwieramy Facebook — wklej ją w rozmowie z Olimpią.');
      } catch (error) {
        showToast('Otwieramy profil Facebook. Treść formularza możesz skopiować ręcznie.');
      }
      window.setTimeout(() => {
        window.open('https://www.facebook.com/olimpia.beautyandmassage/', '_blank', 'noopener');
      }, 550);
    });
  }
})();
