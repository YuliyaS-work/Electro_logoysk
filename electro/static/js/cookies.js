document.addEventListener('DOMContentLoaded', () => {

  /* ── Сохранение согласия в cookie ── */
  function saveCookieConsent(consent) {
    const maxAge      = 2592000; // 30 дней
    const value       = consent ? 'true' : 'false';
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    const secureFlag  = isLocalhost ? '' : '; Secure';
    document.cookie   = `cookieConsent=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  }

  /* ── Нужно ли показывать баннер ── */
  function shouldShowBanner() {
    const cookieConsent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookieConsent='));
    if (!cookieConsent) return true;
    const value = cookieConsent.split('=')[1];
    return value !== 'true' && value !== 'false';
  }

  /* ── Скрыть баннер с анимацией ── */
  function dismissBanner(banner) {
    banner.classList.remove('is-visible');
    banner.classList.add('is-hiding');
    setTimeout(() => { banner.style.display = 'none'; }, 400);
  }

  /* ── Инициализация статичного баннера ── */
  const banner     = document.getElementById('cookie-banner');
  const btnAccept  = document.getElementById('cookie-accept');
  const btnDecline = document.getElementById('cookie-decline');

  if (!banner || !btnAccept || !btnDecline) return;

  if (shouldShowBanner()) {
    /* Показываем с задержкой */
    setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        banner.classList.add('is-visible');
      }));
    }, 800);

    btnAccept.addEventListener('click', () => {
      saveCookieConsent(true);
      dismissBanner(banner);
    });

    btnDecline.addEventListener('click', () => {
      saveCookieConsent(false);
      dismissBanner(banner);
    });

  } else {
    /* Согласие уже дано — скрываем сразу */
    banner.style.display = 'none';
  }

});