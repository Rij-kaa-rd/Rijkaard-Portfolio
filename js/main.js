/* Portfolio JS — Carousel, Filter, Smooth Scroll, Bilingual Switcher */

document.addEventListener('DOMContentLoaded', () => {

  // ===== BILINGUAL LANGUAGE SWITCHER =====
  const langToggleBtn = document.getElementById('langToggleBtn');
  const optId = document.getElementById('langOptId');
  const optEn = document.getElementById('langOptEn');

  // Load saved preference or default to ID
  const savedLang = localStorage.getItem('portfolio_lang') || 'id';
  setLanguage(savedLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const currentLang = document.body.classList.contains('lang-en') ? 'en' : 'id';
      const newLang = currentLang === 'id' ? 'en' : 'id';
      setLanguage(newLang);
    });
  }

  function setLanguage(lang) {
    if (lang === 'en') {
      document.body.classList.add('lang-en');
      if (optId) optId.classList.remove('active');
      if (optEn) optEn.classList.add('active');
      localStorage.setItem('portfolio_lang', 'en');
    } else {
      document.body.classList.remove('lang-en');
      if (optId) optId.classList.add('active');
      if (optEn) optEn.classList.remove('active');
      localStorage.setItem('portfolio_lang', 'id');
    }
  }

  // ===== CAROUSEL =====
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const slides = wrapper.querySelectorAll('.carousel-slide');
    const prevBtn = wrapper.querySelector('.carousel-prev');
    const nextBtn = wrapper.querySelector('.carousel-next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    let current = 0;
    const total = slides.length;

    // Build dots
    if (dotsContainer) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    wrapper.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    });

    // Mouse drag support
    wrapper.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
      e.preventDefault();
    });

    wrapper.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    });
  });

  // ===== FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectEntries = document.querySelectorAll('.project-entry');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectEntries.forEach(entry => {
        const cats = entry.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) {
          entry.style.display = '';
          entry.style.opacity = '1';
        } else {
          entry.style.opacity = '0';
          setTimeout(() => { entry.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== ACTIVE NAV =====
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset + 120;
    sections.forEach(sec => {
      const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (!link) return;
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
});
