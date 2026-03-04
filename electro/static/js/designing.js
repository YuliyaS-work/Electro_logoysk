/* designing.js */

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ── ACTIVE TAB ON SCROLL ──
const sections = document.querySelectorAll('.des-section');
const tabs = document.querySelectorAll('.des-tab');

const tabObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      tabs.forEach(tab => {
        tab.classList.remove('des-tab--active');
        if (tab.getAttribute('href') === `#${id}`) {
          tab.classList.add('des-tab--active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => tabObserver.observe(s));

// ── SMOOTH SCROLL FOR TABS ──
tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(tab.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});