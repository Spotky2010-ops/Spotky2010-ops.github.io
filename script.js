const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const timeElement = $('#time');
const dateElement = $('#date');
const greetingElement = $('#greeting');

function normalizeTabName(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[\s_]+/g, ' ').replace(/[^a-z0-9 ]+/g, '');
}

function updateClock() {
  if (!timeElement || !dateElement || !greetingElement) return;
  const now = new Date();
  timeElement.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  dateElement.textContent = `${now.toLocaleDateString(undefined, { weekday: 'long' })}, ${now.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`;
  const hour = now.getHours();
  if (hour < 12) greetingElement.textContent = 'Good morning';
  else if (hour < 15) greetingElement.textContent = 'Good lunch';
  else if (hour < 17) greetingElement.textContent = 'Good afternoon';
  else if (hour < 19) greetingElement.textContent = 'Good evening';
  else greetingElement.textContent = 'Good Night';
}

function initPreferences() {
  const preferences = [
    ['theme', 'window12-theme', ['dark', 'light', 'midnight'], 'dark', '.theme-option', 'data-theme'],
    ['accent', 'window12-accent', ['blue', 'violet', 'green', 'rose', 'amber', 'aqua', 'coral', 'mint', 'plum', 'gold'], 'blue', '.accent-swatch', 'data-accent'],
    ['wallpaper', 'window12-wallpaper', ['default', 'aurora', 'sunset'], 'default', '.wallpaper-option', 'data-wallpaper'],
    ['transparency', 'window12-transparency', ['low', 'medium', 'high'], 'medium', '[data-transparency].segment', 'data-transparency'],
    ['taskbar', 'window12-taskbar', ['normal', 'compact', 'autohide'], 'normal', '[data-taskbar].segment', 'data-taskbar'],
    ['accessibility', 'window12-accessibility', ['standard', 'high-contrast', 'reduced-motion'], 'standard', '[data-accessibility].segment', 'data-accessibility'],
    ['textSize', 'window12-text-size', ['small', 'medium', 'large'], 'medium', '[data-text-size].segment', 'data-text-size'],
    ['windowScale', 'window12-window-scale', ['100', '110', '125', '135'], '100', '[data-window-scale].segment', 'data-window-scale'],
    ['windowStyle', 'window12-window-style', ['glass', 'classic', 'minimal'], 'glass', '[data-window-style].segment', 'data-window-style']
  ];

  preferences.forEach(([datasetKey, storageKey, validValues, fallback, selector, dataKey]) => {
    let saved;
    try { saved = localStorage.getItem(storageKey); } catch (error) { saved = null; }
    const apply = (value) => {
      const selected = validValues.includes(value) ? value : fallback;
      document.body.dataset[datasetKey] = selected;
      $$(selector).forEach((button) => {
        const active = button.dataset[dataKey] === selected;
        button.classList.toggle('active', active);
        button.classList.toggle('selected', active);
        button.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', String(active));
        button.setAttribute('aria-selected', String(active));
      });
      try { localStorage.setItem(storageKey, selected); } catch (error) { /* Storage may be disabled. */ }
    };
    apply(saved || fallback);
    $$(selector).forEach((button) => button.addEventListener('click', () => apply(button.dataset[dataKey])));
  });

  const fontNames = {
    default: '"Segoe UI", "Inter", sans-serif', gotham: '"Gotham", "Segoe UI", sans-serif',
    alegreya: '"Alegreya", Georgia, serif', comfortaa: '"Comfortaa", sans-serif',
    'dm-sans': '"DM Sans", sans-serif', 'exo-2': '"Exo 2", sans-serif', fredoka: '"Fredoka", sans-serif',
    'fredoka-one': '"Fredoka One", sans-serif', 'libre-baskerville': '"Libre Baskerville", Georgia, serif',
    lato: '"Lato", sans-serif', merriweather: '"Merriweather", Georgia, serif', montserrat: '"Montserrat", sans-serif',
    nunito: '"Nunito", sans-serif', orbitron: '"Orbitron", sans-serif', oswald: '"Oswald", sans-serif',
    'playfair-display': '"Playfair Display", Georgia, serif', poppins: '"Poppins", sans-serif',
    quicksand: '"Quicksand", sans-serif', raleway: '"Raleway", sans-serif',
    'space-grotesk': '"Space Grotesk", sans-serif', ubuntu: '"Ubuntu", sans-serif', 'work-sans': '"Work Sans", sans-serif'
  };
  const fontButtons = $$('.font-option');
  let savedFont;
  try { savedFont = localStorage.getItem('window12-font'); } catch (error) { savedFont = null; }
  const applyFont = (font) => {
    const selected = Object.hasOwn(fontNames, font) ? font : 'default';
    document.body.dataset.font = selected;
    document.documentElement.style.setProperty('--font-ui', fontNames[selected]);
    fontButtons.forEach((button) => {
      const active = button.dataset.font === selected;
      button.classList.toggle('is-selected', active);
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('window12-font', selected); } catch (error) { /* Storage may be disabled. */ }
  };
  applyFont(savedFont || 'default');
  fontButtons.forEach((button) => button.addEventListener('click', () => applyFont(button.dataset.font)));
}

function initSettingsPanel() {
  const overlay = $('#settingsOverlay');
  if (!overlay) return;
  const closeButton = $('#closeSettings');
  const settingsTabs = $$('.settings-tab');
  const panes = $$('.settings-pane');
  const open = () => { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); closeButton?.focus(); };
  const close = () => { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); $('#settingsTile')?.focus(); };
  $('#settingsTile')?.addEventListener('click', open);
  $('#dockSettingsButton')?.addEventListener('click', open);
  closeButton?.addEventListener('click', close);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
  const activate = (name) => {
    settingsTabs.forEach((tab) => {
      const active = tab.dataset.settingsTab === name;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panes.forEach((pane) => {
      const active = pane.dataset.pane === name;
      pane.classList.toggle('active', active);
      pane.hidden = !active;
      pane.setAttribute('aria-hidden', String(!active));
    });
  };
  settingsTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.settingsTab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % settingsTabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + settingsTabs.length) % settingsTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = settingsTabs.length - 1;
      if (next !== undefined) { event.preventDefault(); settingsTabs[next].click(); settingsTabs[next].focus(); }
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
  activate('general');
}

function initFilePanel() {
  const gallery = $('#filesGallery');
  const tabs = $$('.files-tab');
  const cards = $$('.folder-card');
  if (!gallery || !tabs.length || !cards.length) return;

  const panelStyles = document.createElement('style');
  panelStyles.textContent = `
    #filesGallery.files-overlay { position:fixed; inset:0; z-index:1000; display:none; overflow-y:auto; margin:0; padding:24px; border:0; border-radius:0; background:rgba(2,7,15,.66); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); }
    #filesGallery.files-overlay.is-open { display:block; }
    #filesGallery .files-dialog-panel { width:min(1100px,100%); max-height:calc(100vh - 48px); overflow-y:auto; margin:0 auto; padding:20px; border:1px solid var(--stroke); border-radius:var(--window-radius); background:var(--panel-strong); box-shadow:0 24px 64px var(--shadow); color:var(--text); }
    #filesGallery .files-dialog-header { position:sticky; top:-20px; z-index:2; padding:4px 0 12px; background:var(--panel-strong); }
    #filesGallery .files-dialog-close { width:36px; height:36px; display:grid; place-items:center; margin-left:auto; font-size:1.3rem; }
    #filesGallery .files-dialog-heading { display:flex; align-items:center; gap:12px; }
    #filesGallery .files-dialog-heading .widget-label { margin:0; }
    #filesGallery .thumb-photo { cursor:zoom-in; }
    #lightbox { z-index:1100; }
    @media(max-width:640px) { #filesGallery.files-overlay{padding:10px} #filesGallery .files-dialog-panel{max-height:calc(100vh - 20px);padding:14px} #filesGallery .files-dialog-header{top:-14px} }
  `;
  document.head.append(panelStyles);

  const panel = document.createElement('div');
  panel.className = 'files-dialog-panel';
  gallery.append(panel);
  while (gallery.firstChild !== panel) panel.prepend(gallery.firstChild);
  gallery.classList.add('files-overlay');
  gallery.setAttribute('role', 'dialog');
  gallery.setAttribute('aria-modal', 'true');
  gallery.setAttribute('aria-hidden', 'true');
  gallery.setAttribute('aria-label', 'Files and photo folders');
  gallery.tabIndex = -1;

  const header = $('.section-header', gallery);
  const title = $('.widget-label', gallery);
  if (header && title) {
    const heading = document.createElement('div');
    heading.className = 'files-dialog-heading';
    title.replaceWith(heading);
    heading.append(title);
    header.classList.add('files-dialog-header');
    const closeButton = document.createElement('button');
    closeButton.className = 'settings-close files-dialog-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close files panel');
    closeButton.textContent = '×';
    header.append(closeButton);
  }
  const closeButton = $('.files-dialog-close', gallery);
  const openTriggers = $$('[data-open-tab]');
  const explorer = $('.dock-item[aria-label="Explorer"]');
  let lastOpener = null;

  const activateTab = (name) => {
    const activeName = normalizeTabName(name);
    tabs.forEach((tab, index) => {
      const active = normalizeTabName(tab.dataset.tab) === activeName;
      tab.classList.toggle('active', active);
      tab.classList.toggle('selected', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.dataset.index = String(index);
    });
    cards.forEach((card) => {
      const category = normalizeTabName(card.dataset.category);
      card.hidden = activeName !== 'all' && category !== activeName;
    });
  };
  const open = (tabName, opener) => {
    lastOpener = opener || null;
    activateTab(tabName || 'all');
    gallery.classList.add('is-open');
    gallery.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  };
  const close = () => {
    gallery.classList.remove('is-open');
    gallery.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastOpener?.focus();
  };

  openTriggers.forEach((button) => button.addEventListener('click', () => open(button.dataset.openTab, button)));
  explorer?.addEventListener('click', () => open('all', explorer));
  closeButton?.addEventListener('click', close);
  gallery.addEventListener('click', (event) => { if (event.target === gallery) close(); });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next].dataset.tab); tabs[next].focus(); }
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && gallery.classList.contains('is-open') && !$('#lightbox')?.classList.contains('is-open')) close();
  });
  activateTab('all');
}

function initImageLightbox() {
  const lightbox = $('#lightbox');
  const image = $('#lightboxImage');
  if (!lightbox || !image) return;
  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    image.removeAttribute('src');
  };
  $$('.thumb-photo').forEach((photo) => photo.addEventListener('click', () => {
    image.src = photo.currentSrc || photo.src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    $('#lightboxClose')?.focus();
  }));
  $('#lightboxClose')?.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close(); });
}

function initPowerMenu() {
  const button = $('#powerButton');
  const overlay = $('#powerOverlay');
  const closeButton = $('#closePowerMenu');
  const confirm = $('#confirmPowerAction');
  const blackout = $('#blackoutScreen');
  if (!overlay) return;
  let selectedAction = 'shutdown';
  const close = () => { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); };
  button?.addEventListener('click', (event) => { event.preventDefault(); overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); });
  closeButton?.addEventListener('click', close);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
  $$('.power-option').forEach((option) => option.addEventListener('click', () => {
    selectedAction = option.dataset.action;
    $$('.power-option').forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
  }));
  confirm?.addEventListener('click', () => {
    if (!blackout) return;
    const labels = { shutdown: 'Shutting down...', sleep: 'Sleeping...', restart: 'Restarting...' };
    const label = $('.shutdown-text', blackout);
    if (label) label.textContent = labels[selectedAction] || labels.shutdown;
    close();
    blackout.classList.add('is-visible');
    blackout.setAttribute('aria-hidden', 'false');
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && overlay.classList.contains('is-open')) close(); });
}

document.addEventListener('DOMContentLoaded', () => {
  initPreferences();
  updateClock();
  initSettingsPanel();
  initFilePanel();
  initPowerMenu();
  initImageLightbox();
  window.setInterval(updateClock, 30000);
});
