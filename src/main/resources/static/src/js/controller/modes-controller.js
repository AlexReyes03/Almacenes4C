(() => {
  'use strict';

  const getStoredTheme = () => localStorage.getItem('theme');
  const setStoredTheme = theme => localStorage.setItem('theme', theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = theme => {
    const htmlElement = document.documentElement;

    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      updateSweetAlertTheme('dark');
    } else {
      htmlElement.setAttribute('data-bs-theme', theme);
      updateSweetAlertTheme(theme);
    }
  };

  const updateSweetAlertTheme = theme => {
    const bodyClassList = document.body.classList;

    // Eliminar clases de temas previos
    bodyClassList.remove('swal-light', 'swal-dark');

    if (theme === 'dark') {
      bodyClassList.add('swal-dark');
    } else if (theme === 'light') {
      bodyClassList.add('swal-light');
    }
  };

  // Función para ocultar el botón de cambio de tema
  const hideThemeSwitcher = () => {
    const themeSwitcher = document.querySelector('.bd-mode-toggle');
    if (themeSwitcher) {
      themeSwitcher.style.display = 'none';
    }
  };

  // Función para mostrar el botón de cambio de tema
  const showThemeSwitcher = () => {
    const themeSwitcher = document.querySelector('.bd-mode-toggle');
    if (themeSwitcher) {
      themeSwitcher.style.display = 'block';
    }
  };

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme');

    if (!themeSwitcher) {
      return;
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text');
    const activeThemeIcon = document.querySelector('.theme-icon-active use');
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active');
      element.setAttribute('aria-pressed', 'false');
    });

    btnToActive.classList.add('active');
    btnToActive.setAttribute('aria-pressed', 'true');
    activeThemeIcon.setAttribute('href', svgOfActiveBtn);
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel);

    if (focus) {
      themeSwitcher.focus();
    }
  };

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme();
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme());
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    showActiveTheme(preferredTheme);

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value');
          setStoredTheme(theme);
          setTheme(theme);
          showActiveTheme(theme, true);
        });
      });
  });

  // Interceptar apertura y cierre de los SweetAlerts
  window.addEventListener('swal:open', hideThemeSwitcher);
  window.addEventListener('swal:close', showThemeSwitcher);
})();

(() => {
  const getStoredTheme = () => localStorage.getItem('theme');
  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyThemeImmediately = theme => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-bs-theme', theme);
  };

  const preferredTheme = getPreferredTheme();
  applyThemeImmediately(preferredTheme);

  // Asegurar que el contenido del cuerpo esté oculto antes del renderizado
  document.documentElement.style.visibility = 'hidden';
  window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.visibility = '';
  });
})();