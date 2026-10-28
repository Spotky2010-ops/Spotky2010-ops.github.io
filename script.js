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

updateClock();
setInterval(updateClock, 30000);
