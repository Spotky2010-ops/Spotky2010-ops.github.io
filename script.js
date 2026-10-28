const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

function updateClock() {
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

const filesToggle = document.querySelector('.files-toggle');
const filesWindow = document.getElementById('files-window');

if (filesToggle && filesWindow) {
  const setFilesWindowOpen = (isOpen) => {
    filesWindow.classList.toggle('is-open', isOpen);
    filesToggle.setAttribute('aria-expanded', String(isOpen));
  };

  filesToggle.addEventListener('click', () => {
    const isOpen = !filesWindow.classList.contains('is-open');
    setFilesWindowOpen(isOpen);
  });
}

const powerButton = document.getElementById('powerButton');
const powerOverlay = document.getElementById('powerOverlay');
const closePowerMenu = document.getElementById('closePowerMenu');
const confirmPowerAction = document.getElementById('confirmPowerAction');
const blackoutScreen = document.getElementById('blackoutScreen');
const powerOptions = document.querySelectorAll('.power-option');

let selectedPowerAction = 'shutdown';

function setPowerAction(action) {
  selectedPowerAction = action;
  powerOptions.forEach((option) => {
    option.classList.toggle('selected', option.dataset.action === action);
  });
}

function openPowerMenu() {
  if (!powerOverlay) return;
  powerOverlay.classList.add('is-open');
  powerOverlay.setAttribute('aria-hidden', 'false');
}

function closePowerMenuDialog() {
  if (!powerOverlay) return;
  powerOverlay.classList.remove('is-open');
  powerOverlay.setAttribute('aria-hidden', 'true');
}

function triggerPowerAction() {
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
}

if (powerButton) {
  powerButton.addEventListener('click', openPowerMenu);
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
updateClock();
setInterval(updateClock, 30000);
