const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

const THEME_STORAGE_KEY = 'window12-theme';
const ACCENT_STORAGE_KEY = 'window12-accent';
const WALLPAPER_STORAGE_KEY = 'window12-wallpaper';
const TRANSPARENCY_STORAGE_KEY = 'window12-transparency';
const TASKBAR_STORAGE_KEY = 'window12-taskbar';
const ACCESSIBILITY_STORAGE_KEY = 'window12-accessibility';
const FONT_STORAGE_KEY = 'window12-font';
const TEXT_SIZE_STORAGE_KEY = 'window12-text-size';
const WINDOW_SCALE_STORAGE_KEY = 'window12-window-scale';
const WINDOW_STYLE_STORAGE_KEY = 'window12-window-style';

const accentLabels = {
  blue: 'Blue Glow',
  violet: 'Violet Pulse',
  green: 'Green Refresh',
  rose: 'Rose Glow',
  amber: 'Amber Gold',
  aqua: 'Aqua Drift',
  coral: 'Coral Sunset',
  mint: 'Mint Pop',
  plum: 'Plum Night',
  gold: 'Gold Leaf'
};

const validThemes = ['dark', 'light', 'midnight'];
const validWallpapers = ['default', 'aurora', 'sunset'];
const validAccents = ['blue', 'violet', 'green', 'rose', 'amber', 'aqua', 'coral', 'mint', 'plum', 'gold'];
const validTextSizes = ['small', 'medium', 'large'];
const validWindowScales = ['100', '110', '125', '135'];
const validWindowStyles = ['glass', 'classic', 'minimal'];

function normalizeTabName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, ' ')
    .replace(/[^a-z0-9 ]+/g, '');
}

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
  } else if (hour < 15) {
    greetingElement.textContent = 'Good lunch';
  } else if (hour < 17) {
    greetingElement.textContent = 'Good afternoon';
  } else if (hour < 19) {
    greetingElement.textContent = 'Good evening';
  } else {
    greetingElement.textContent = 'Good Night';
  }
}

function syncSelectedState(buttons, selectedValue, keyName) {
  buttons.forEach((button) => {
    const isSelected = button.dataset[keyName] === selectedValue;
    button.classList.toggle('selected', isSelected);
    button.classList.toggle('active', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
    button.setAttribute('aria-selected', String(isSelected));
  });
}

function applyTheme(themeName) {
  const theme = validThemes.includes(themeName) ? themeName : 'dark';
  document.body.dataset.theme = theme;

  const themeButtons = document.querySelectorAll('.theme-option');
  themeButtons.forEach((button) => {
    const isSelected = button.dataset.theme === theme;
    button.classList.toggle('is-selected', isSelected);
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
    button.setAttribute('aria-selected', String(isSelected));
  });

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyAccent(accentName) {
  const accent = validAccents.includes(accentName) ? accentName : 'blue';
  document.body.dataset.accent = accent;

  const accentSwatches = document.querySelectorAll('.accent-swatch');
  accentSwatches.forEach((button) => {
    const isActive = button.dataset.accent === accent;
    button.classList.toggle('active', isActive);
    button.classList.toggle('selected', isActive);
    button.setAttribute('aria-pressed', String(isActive));
    button.setAttribute('aria-selected', String(isActive));
  });

  const currentAccentLabel = document.getElementById('currentAccentLabel');
  if (currentAccentLabel) {
    currentAccentLabel.textContent = accentLabels[accent] || 'Blue Glow';
  }

  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, accent);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyFont(fontName) {
  const font = [
    'default', 'gotham', 'fredoka', 'fredoka-one', 'adobe-clean', 'montserrat', 'poppins', 'quicksand',
    'dm-sans', 'lato', 'nunito', 'raleway', 'ubuntu', 'oswald', 'playfair-display', 'orbitron',
    'comfortaa', 'space-grotesk', 'libre-baskerville'
  ].includes(fontName) ? fontName : 'default';

  document.body.dataset.font = font;

  const fontButtons = document.querySelectorAll('.font-option');
  fontButtons.forEach((button) => {
    const isSelected = button.dataset.font === font;
    button.classList.toggle('is-selected', isSelected);
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
    button.setAttribute('aria-selected', String(isSelected));
  });

  const fontMap = {
    default: '"Segoe UI", "Inter", sans-serif',
    gotham: '"Gotham", "Segoe UI", sans-serif',
    fredoka: '"Fredoka", "Segoe UI", sans-serif',
    'fredoka-one': '"Fredoka One", "Fredoka", "Segoe UI", sans-serif',
    'adobe-clean': '"Adobe Clean", "Segoe UI", sans-serif',
    montserrat: '"Montserrat", "Segoe UI", sans-serif',
    poppins: '"Poppins", "Segoe UI", sans-serif',
    quicksand: '"Quicksand", "Segoe UI", sans-serif',
    'dm-sans': '"DM Sans", "Segoe UI", sans-serif',
    lato: '"Lato", "Segoe UI", sans-serif',
    nunito: '"Nunito", "Segoe UI", sans-serif',
    raleway: '"Raleway", "Segoe UI", sans-serif',
    ubuntu: '"Ubuntu", "Segoe UI", sans-serif',
    oswald: '"Oswald", "Segoe UI", sans-serif',
    'playfair-display': '"Playfair Display", "Georgia", serif',
    orbitron: '"Orbitron", "Segoe UI", sans-serif',
    comfortaa: '"Comfortaa", "Segoe UI", sans-serif',
    'space-grotesk': '"Space Grotesk", "Segoe UI", sans-serif',
    'libre-baskerville': '"Libre Baskerville", "Georgia", serif'
  };

  document.documentElement.style.setProperty('--font-ui', fontMap[font] || fontMap.default);

  try {
    localStorage.setItem(FONT_STORAGE_KEY, font);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyWallpaper(wallpaperName) {
  const wallpaper = validWallpapers.includes(wallpaperName) ? wallpaperName : 'default';
  document.body.dataset.wallpaper = wallpaper;

  document.querySelectorAll('.wallpaper-option').forEach((button) => {
    const isActive = button.dataset.wallpaper === wallpaper;
    button.classList.toggle('active', isActive);
    button.classList.toggle('selected', isActive);
    button.setAttribute('aria-pressed', String(isActive));
    button.setAttribute('aria-selected', String(isActive));
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
      button.classList.toggle('selected', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-selected', String(isActive));
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
      button.classList.toggle('selected', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-selected', String(isActive));
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
      button.classList.toggle('selected', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-selected', String(isActive));
    }
  });

  try {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, accessibility);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyTextSize(size) {
  const textSize = validTextSizes.includes(size) ? size : 'medium';
  document.body.dataset.textSize = textSize;

  document.querySelectorAll('[data-text-size]').forEach((button) => {
    if (button.classList.contains('segment')) {
      const isActive = button.dataset.textSize === textSize;
      button.classList.toggle('active', isActive);
      button.classList.toggle('selected', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-selected', String(isActive));
    }
  });

  try {
    localStorage.setItem(TEXT_SIZE_STORAGE_KEY, textSize);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyWindowScale(scale) {
  const windowScale = validWindowScales.includes(String(scale)) ? String(scale) : '100';
  document.body.dataset.windowScale = windowScale;

  document.querySelectorAll('[data-window-scale]').forEach((button) => {
    if (button.classList.contains('segment')) {
      const isActive = button.dataset.windowScale === windowScale;
      button.classList.toggle('active', isActive);
      button.classList.toggle('selected', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-selected', String(isActive));
    }
  });

  try {
    localStorage.setItem(WINDOW_SCALE_STORAGE_KEY, windowScale);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function applyWindowStyle(style) {
  const windowStyle = validWindowStyles.includes(style) ? style : 'glass';
  document.body.dataset.windowStyle = windowStyle;

  document.querySelectorAll('[data-window-style]').forEach((button) => {
    if (button.classList.contains('segment')) {
      const isActive = button.dataset.windowStyle === windowStyle;
      button.classList.toggle('active', isActive);
      button.classList.toggle('selected', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-selected', String(isActive));
    }
  });

  try {
    localStorage.setItem(WINDOW_STYLE_STORAGE_KEY, windowStyle);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function initTheme() {
  const savedTheme = (() => {
    try { return localStorage.getItem(THEME_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedAccent = (() => {
    try { return localStorage.getItem(ACCENT_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedWallpaper = (() => {
    try { return localStorage.getItem(WALLPAPER_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedTransparency = (() => {
    try { return localStorage.getItem(TRANSPARENCY_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedTaskbar = (() => {
    try { return localStorage.getItem(TASKBAR_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedAccessibility = (() => {
    try { return localStorage.getItem(ACCESSIBILITY_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedFont = (() => {
    try { return localStorage.getItem(FONT_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedTextSize = (() => {
    try { return localStorage.getItem(TEXT_SIZE_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedWindowScale = (() => {
    try { return localStorage.getItem(WINDOW_SCALE_STORAGE_KEY); } catch (error) { return null; }
  })();

  const savedWindowStyle = (() => {
    try { return localStorage.getItem(WINDOW_STYLE_STORAGE_KEY); } catch (error) { return null; }
  })();

  applyTheme(savedTheme || 'dark');
  applyAccent(savedAccent || 'blue');
  applyFont(savedFont || 'default');
  applyWallpaper(savedWallpaper || 'default');
  applyTransparency(savedTransparency || 'medium');
  applyTaskbar(savedTaskbar || 'normal');
  applyAccessibility(savedAccessibility || 'standard');
  applyTextSize(savedTextSize || 'medium');
  applyWindowScale(savedWindowScale || '100');
  applyWindowStyle(savedWindowStyle || 'glass');

  document.querySelectorAll('.theme-option').forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.theme));
  });

  document.querySelectorAll('.accent-swatch').forEach((button) => {
    button.addEventListener('click', () => applyAccent(button.dataset.accent));
  });

  document.querySelectorAll('.font-option').forEach((button) => {
    button.addEventListener('click', () => applyFont(button.dataset.font));
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

  document.querySelectorAll('[data-text-size]').forEach((button) => {
    if (button.classList.contains('segment')) {
      button.addEventListener('click', () => applyTextSize(button.dataset.textSize));
    }
  });

  document.querySelectorAll('[data-window-scale]').forEach((button) => {
    if (button.classList.contains('segment')) {
      button.addEventListener('click', () => applyWindowScale(button.dataset.windowScale));
    }
  });

  document.querySelectorAll('[data-window-style]').forEach((button) => {
    if (button.classList.contains('segment')) {
      button.addEventListener('click', () => applyWindowStyle(button.dataset.windowStyle));
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
    settingsTabs.forEach((tab, index) => {
      const isActive = tab.dataset.settingsTab === tabName;
      tab.classList.toggle('active', isActive);
      tab.classList.toggle('selected', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      tab.dataset.index = String(index);
    });

    settingsPanes.forEach((pane) => {
      const isActive = pane.dataset.pane === tabName;
      pane.classList.toggle('active', isActive);
      pane.hidden = !isActive;
      pane.setAttribute('aria-hidden', String(!isActive));
    });
  };

  const moveSettingsTabFocus = (currentIndex, direction) => {
    const visibleTabs = Array.from(settingsTabs);
    if (!visibleTabs.length) return;
    const nextIndex = (currentIndex + direction + visibleTabs.length) % visibleTabs.length;
    const nextTab = visibleTabs[nextIndex];
    if (nextTab) {
      setActiveSettingsTab(nextTab.dataset.settingsTab);
      nextTab.focus();
    }
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

  settingsTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActiveSettingsTab(tab.dataset.settingsTab));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveSettingsTabFocus(index, 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveSettingsTabFocus(index, -1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        const firstTab = settingsTabs[0];
        if (firstTab) {
          setActiveSettingsTab(firstTab.dataset.settingsTab);
          firstTab.focus();
        }
      }
      if (event.key === 'End') {
        event.preventDefault();
        const lastTab = settingsTabs[settingsTabs.length - 1];
        if (lastTab) {
          setActiveSettingsTab(lastTab.dataset.settingsTab);
          lastTab.focus();
        }
      }
    });
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
  const filesGallery = document.getElementById('filesGallery');

  if (!tabs.length || !cards.length || !filesGallery) return;

  const style = document.createElement('style');
  style.textContent = `
    #filesGallery.files-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      overflow-y: auto;
      margin: 0;
      padding: 24px;
      border: 0;
      border-radius: 0;
      background: rgba(2, 7, 15, 0.62);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    #filesGallery.files-overlay.is-open { display: block; }
    #filesGallery .files-dialog-panel {
      width: min(1100px, 100%);
      max-height: calc(100vh - 48px);
      overflow-y: auto;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid var(--stroke);
      border-radius: var(--window-radius);
      background: var(--panel-strong);
      box-shadow: 0 24px 64px var(--shadow);
      color: var(--text);
    }
    #filesGallery .files-dialog-header { position: sticky; top: -20px; z-index: 1; padding: 4px 0 12px; background: var(--panel-strong); }
    #filesGallery .files-dialog-close { width: 36px; height: 36px; display: grid; place-items: center; margin-left: auto; font-size: 1.3rem; }
    #filesGallery .thumb-photo { cursor: zoom-in; }
    @media (max-width: 640px) {
      #filesGallery.files-overlay { padding: 10px; }
      #filesGallery .files-dialog-panel { max-height: calc(100vh - 20px); padding: 14px; }
      #filesGallery .files-dialog-header { top: -14px; }
    }
  `;
  document.head.append(style);

  const panel = document.createElement('div');
  panel.className = 'files-dialog-panel';
  filesGallery.append(panel);
  while (filesGallery.firstChild !== panel) {
    panel.prepend(filesGallery.firstChild);
  }

  filesGallery.classList.add('files-overlay');
  filesGallery.setAttribute('role', 'dialog');
  filesGallery.setAttribute('aria-modal', 'true');
  filesGallery.setAttribute('aria-hidden', 'true');
  filesGallery.setAttribute('tabindex', '-1');
  filesGallery.setAttribute('aria-label', 'Files and photo folders');

  const sectionHeader = filesGallery.querySelector('.section-header');
  if (sectionHeader) {
    sectionHeader.classList.add('files-dialog-header');
    const closeButton = document.createElement('button');
    closeButton.className = 'settings-close files-dialog-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close files panel');
    closeButton.textContent = '×';
    sectionHeader.append(closeButton);
  }

  const closeButton = filesGallery.querySelector('.files-dialog-close');
  const openButtons = document.querySelectorAll('[data-open-tab]');
  const explorerButton = document.querySelector('.dock-item[aria-label="Explorer"]');
  const originalBodyOverflow = document.body.style.overflow;
  let lastOpener = null;

  const setActiveTab = (tabName) => {
    const activeTabName = normalizeTabName(tabName);

    tabs.forEach((tab, index) => {
      const isActive = normalizeTabName(tab.dataset.tab) === activeTabName;
      tab.classList.toggle('active', isActive);
      tab.classList.toggle('selected', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      tab.dataset.index = String(index);
    });

    cards.forEach((card) => {
      const category = normalizeTabName(card.dataset.category);
      const matches = activeTabName === 'all' || category === activeTabName;
      card.style.display = matches ? '' : 'none';
    });
  };

  const openFilesPanel = (tabName = 'all', opener = null) => {
    lastOpener = opener;
    setActiveTab(tabName);
    filesGallery.classList.add('is-open');
    filesGallery.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  };

  const closeFilesPanel = () => {
    filesGallery.classList.remove('is-open');
    filesGallery.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = originalBodyOverflow;
    lastOpener?.focus();
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', () => openFilesPanel(button.dataset.openTab, button));
  });

  if (explorerButton) {
    explorerButton.addEventListener('click', () => openFilesPanel('all', explorerButton));
  }

  closeButton?.addEventListener('click', closeFilesPanel);

  filesGallery.addEventListener('click', (event) => {
    if (event.target === filesGallery) closeFilesPanel();
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        const nextTab = tabs[nextIndex];
        setActiveTab(nextTab.dataset.tab);
        nextTab.focus();
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && filesGallery.classList.contains('is-open')) {
      closeFilesPanel();
    }
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
