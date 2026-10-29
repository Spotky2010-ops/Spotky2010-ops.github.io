const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

const THEME_STORAGE_KEY = 'window12-theme';
const ACCENT_STORAGE_KEY = 'window12-accent';
const WALLPAPER_STORAGE_KEY = 'window12-wallpaper';
const TRANSPARENCY_STORAGE_KEY = 'window12-transparency';
const TASKBAR_STORAGE_KEY = 'window12-taskbar';
const ACCESSIBILITY_STORAGE_KEY = 'window12-accessibility';

const accentLabels = {
  blue: 'Blue Glow',
  violet: 'Violet Pulse',
  green: 'Green Refresh',
  rose: 'Rose Glow',
  amber: 'Amber Gold'
};

function applyMotionProfile() {
  const reducedMotion = document.body.dataset.accessibility === 'reduced-motion';
  document.body.classList.toggle('reduced-motion', reducedMotion);
}

function updateClock() {
  if (!timeElement || !dateElement || !greetingElement) return;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = now.toLocaleDateString(undefined, { weekday: 'long' });
  const monthDay = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

  timeElement.textContent = `${hours}:${minutes}`;
  dateElement.textContent = `${day}, ${monthDay}`;

  const hour = now.getHours();

  if (hour < 12) {
    greetingElement.textContent = 'Good morning';
  } else if (hour < 18) {
    greetingElement.textContent = 'Good afternoon';
  } else {
    greetingElement.textContent = 'Good evening';
  }
}

function applyTheme(themeName) {
  const theme = themeName === 'light' ? 'light' : 'dark';
  document.body.dataset.theme = theme;

  const themeButtons = document.querySelectorAll('.theme-option');
  themeButtons.forEach((button) => {
    const isSelected = button.dataset.theme === theme;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyAccent(accentName) {
  const accent = accentName || 'blue';
  const validAccent = ['blue', 'violet', 'green', 'rose', 'amber'].includes(accent) ? accent : 'blue';
  document.body.dataset.accent = validAccent;

  const accentSwatches = document.querySelectorAll('.accent-swatch');
  accentSwatches.forEach((button) => {
    const isActive = button.dataset.accent === validAccent;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  const currentAccentLabel = document.getElementById('currentAccentLabel');
  if (currentAccentLabel) {
    currentAccentLabel.textContent = accentLabels[validAccent] || 'Blue Glow';
  }

  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, validAccent);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyWallpaper(wallpaperName) {
  const wallpaper = ['default', 'aurora', 'sunset'].includes(wallpaperName) ? wallpaperName : 'default';
  document.body.dataset.wallpaper = wallpaper;

  document.querySelectorAll('.wallpaper-option').forEach((button) => {
    const isActive = button.dataset.wallpaper === wallpaper;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  try {
    localStorage.setItem(WALLPAPER_STORAGE_KEY, wallpaper);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyTransparency(value) {
  const transparency = ['low', 'medium', 'high'].includes(value) ? value : 'medium';
  document.body.dataset.transparency = transparency;

  document.querySelectorAll('[data-transparency]').forEach((button) => {
    if (button.classList.contains('segment')) {
      const isActive = button.dataset.transparency === transparency;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    }
  });

  try {
    localStorage.setItem(TRANSPARENCY_STORAGE_KEY, transparency);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyTaskbar(mode) {
  const taskbarMode = ['normal', 'compact', 'autohide'].includes(mode) ? mode : 'normal';
  document.body.dataset.taskbar = taskbarMode;

  document.querySelectorAll('[data-taskbar]').forEach((button) => {
    if (button.classList.contains('segment')) {
      const isActive = button.dataset.taskbar === taskbarMode;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    }
  });

  try {
    localStorage.setItem(TASKBAR_STORAGE_KEY, taskbarMode);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyAccessibility(level) {
  const accessibility = ['standard', 'high-contrast', 'reduced-motion'].includes(level) ? level : 'standard';
  document.body.dataset.accessibility = accessibility;
  applyMotionProfile();

  document.querySelectorAll('[data-accessibility]').forEach((button) => {
    if (button.classList.contains('segment')) {
      const isActive = button.dataset.accessibility === accessibility;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    }
  });

  try {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, accessibility);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function initTheme() {
  const savedTheme = (() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  })();

  const savedAccent = (() => {
    try {
      return localStorage.getItem(ACCENT_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  })();

  const savedWallpaper = (() => {
    try {
      return localStorage.getItem(WALLPAPER_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  })();

  const savedTransparency = (() => {
    try {
      return localStorage.getItem(TRANSPARENCY_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  })();

  const savedTaskbar = (() => {
    try {
      return localStorage.getItem(TASKBAR_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  })();

  const savedAccessibility = (() => {
    try {
      return localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  })();

  applyTheme(savedTheme || 'dark');
  applyAccent(savedAccent || 'blue');
  applyWallpaper(savedWallpaper || 'default');
  applyTransparency(savedTransparency || 'medium');
  applyTaskbar(savedTaskbar || 'normal');
  applyAccessibility(savedAccessibility || 'standard');

  document.querySelectorAll('.theme-option').forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.theme));
  });

  document.querySelectorAll('.accent-swatch').forEach((button) => {
    button.addEventListener('click', () => applyAccent(button.dataset.accent));
  });

  document.querySelectorAll('.wallpaper-option').forEach((button) => {
    button.addEventListener('click', () => applyWallpaper(button.dataset.wallpaper));
  });

  document.querySelectorAll('[data-transparency]').forEach((button) => {
    if (button.classList.contains('segment')) {
      button.addEventListener('click', () => applyTransparency(button.dataset.transparency));
    }
  });

  document.querySelectorAll('[data-taskbar]').forEach((button) => {
    if (button.classList.contains('segment')) {
      button.addEventListener('click', () => applyTaskbar(button.dataset.taskbar));
    }
  });

  document.querySelectorAll('[data-accessibility]').forEach((button) => {
    if (button.classList.contains('segment')) {
      button.addEventListener('click', () => applyAccessibility(button.dataset.accessibility));
    }
  });
}

function initSettingsPanel() {
  const settingsTile = document.getElementById('settingsTile');
  const dockSettingsButton = document.getElementById('dockSettingsButton');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const closeSettings = document.getElementById('closeSettings');
  const settingsTabs = document.querySelectorAll('.settings-tab');
  const settingsPanes = document.querySelectorAll('.settings-pane');

  const openSettings = () => {
    if (!settingsOverlay) return;
    settingsOverlay.classList.add('is-open');
    settingsOverlay.setAttribute('aria-hidden', 'false');
  };

  const closeSettingsPanel = () => {
    if (!settingsOverlay) return;
    settingsOverlay.classList.remove('is-open');
    settingsOverlay.setAttribute('aria-hidden', 'true');
  };

  const setActiveSettingsTab = (tabName) => {
    settingsTabs.forEach((tab) => {
      const isActive = tab.dataset.settingsTab === tabName;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    settingsPanes.forEach((pane) => {
      const isActive = pane.dataset.pane === tabName;
      pane.classList.toggle('active', isActive);
    });
  };

  if (settingsTile) {
    settingsTile.addEventListener('click', openSettings);
  }

  if (dockSettingsButton) {
    dockSettingsButton.addEventListener('click', openSettings);
  }

  if (closeSettings) {
    closeSettings.addEventListener('click', closeSettingsPanel);
  }

  if (settingsOverlay) {
    settingsOverlay.addEventListener('click', (event) => {
      if (event.target === settingsOverlay) {
        closeSettingsPanel();
      }
    });
  }

  settingsTabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveSettingsTab(tab.dataset.settingsTab));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && settingsOverlay && settingsOverlay.classList.contains('is-open')) {
      closeSettingsPanel();
    }
  });

  setActiveSettingsTab('general');
}

function initFileTabs() {
  const tabs = document.querySelectorAll('.files-tab');
  const cards = document.querySelectorAll('.folder-card');

  if (!tabs.length || !cards.length) return;

  const setActiveTab = (tabName) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle('active', isActive);
      tab.classList.toggle('selected', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    cards.forEach((card) => {
      const category = card.dataset.category;
      const matches = tabName === 'all' || category === tabName;
      card.style.display = matches ? '' : 'none';
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });

  setActiveTab('all');
}

function initPowerMenu() {
  const powerButton = document.getElementById('powerButton');
  const powerOverlay = document.getElementById('powerOverlay');
  const closePowerMenu = document.getElementById('closePowerMenu');
  const confirmPowerAction = document.getElementById('confirmPowerAction');
  const blackoutScreen = document.getElementById('blackoutScreen');
  const powerOptions = document.querySelectorAll('.power-option');

  if (!powerButton && !powerOverlay && !confirmPowerAction && !blackoutScreen) {
    return;
  }

  let selectedPowerAction = 'shutdown';

  const setPowerAction = (action) => {
    selectedPowerAction = action;
    powerOptions.forEach((option) => {
      const isSelected = option.dataset.action === action;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });
  };

  const openPowerMenu = () => {
    if (!powerOverlay) return;
    powerOverlay.classList.add('is-open');
    powerOverlay.setAttribute('aria-hidden', 'false');
  };

  const closePowerMenuDialog = () => {
    if (!powerOverlay) return;
    powerOverlay.classList.remove('is-open');
    powerOverlay.setAttribute('aria-hidden', 'true');
  };

  const triggerPowerAction = () => {
    if (!blackoutScreen) return;

    const labelMap = {
      shutdown: 'Shutting down...',
      sleep: 'Sleeping...',
      restart: 'Restarting...'
    };

    const label = labelMap[selectedPowerAction] || 'Shutting down...';
    const blackoutText = blackoutScreen.querySelector('.shutdown-text');

    if (blackoutText) {
      blackoutText.textContent = label;
    }

    closePowerMenuDialog();
    blackoutScreen.classList.add('is-visible');
    blackoutScreen.setAttribute('aria-hidden', 'false');
  };

  if (powerButton) {
    powerButton.addEventListener('click', (event) => {
      event.preventDefault();
      openPowerMenu();
    });
  }

  if (closePowerMenu) {
    closePowerMenu.addEventListener('click', closePowerMenuDialog);
  }

  if (confirmPowerAction) {
    confirmPowerAction.addEventListener('click', triggerPowerAction);
  }

  if (powerOverlay) {
    powerOverlay.addEventListener('click', (event) => {
      if (event.target === powerOverlay) {
        closePowerMenuDialog();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && powerOverlay && powerOverlay.classList.contains('is-open')) {
      closePowerMenuDialog();
    }
  });

  powerOptions.forEach((option) => {
    option.addEventListener('click', () => setPowerAction(option.dataset.action));
  });

  setPowerAction(selectedPowerAction);
}

function initImageLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeButton = document.getElementById('lightboxClose');
  const photoItems = document.querySelectorAll('.thumb-photo');

  if (!lightbox || !lightboxImage || !photoItems.length) return;

  const openLightbox = (src) => {
    lightboxImage.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
  };

  photoItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item.src));
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateClock();
  initSettingsPanel();
  initFileTabs();
  initPowerMenu();
  initImageLightbox();
  setInterval(updateClock, 30000);
});
