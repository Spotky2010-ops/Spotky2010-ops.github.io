const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

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

document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  initFileTabs();
  initPowerMenu();
  setInterval(updateClock, 30000);
});
