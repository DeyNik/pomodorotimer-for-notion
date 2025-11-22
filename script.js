// Global variables
let customFocusDuration = 25; // default
let timeLeft = customFocusDuration * 60; 
let timerInterval;
let currentInterval = 'pomodoro';
let backgroundColor = '#F1F1EF';
let fontColor = '#37352F';

// DOM elements
const timeLeftEl = document.getElementById('time-left');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroIntervalBtn = document.getElementById('pomodoro-interval-btn');
const shortBreakIntervalBtn = document.getElementById('short-break-interval-btn');
const longBreakIntervalBtn = document.getElementById('long-break-interval-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.querySelector('.close-btn');
const backgroundColorSelect = document.getElementById('background-color');
const fontColorSelect = document.getElementById('font-color');
const customFocusInput = document.getElementById('custom-focus');
const saveBtn = document.getElementById('save-btn');

// Load custom duration if saved
const savedCustomDuration = localStorage.getItem('customFocusDuration');
if (savedCustomDuration) {
  customFocusDuration = parseInt(savedCustomDuration, 10);
  customFocusInput.value = customFocusDuration;
  timeLeft = customFocusDuration * 60;
}

// Interval button listeners
pomodoroIntervalBtn.addEventListener('click', () => {
  currentInterval = 'pomodoro';
  timeLeft = customFocusDuration * 60;
  updateTimeLeftTextContent();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'short-break';
  timeLeft = 5 * 60;
  updateTimeLeftTextContent();
});

longBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'long-break';
  timeLeft = 10 * 60;
  updateTimeLeftTextContent();
});

// Start / Stop
startStopBtn.addEventListener('click', () => {
  if (startStopBtn.textContent === 'Start') {
    startTimer();
    startStopBtn.textContent = 'Stop';
  } else {
    stopTimer();
  }
});

// Reset
resetBtn.addEventListener('click', () => {
  stopTimer();

  if (currentInterval === 'pomodoro') {
    timeLeft = customFocusDuration * 60;
  } else if (currentInterval === 'short-break') {
    timeLeft = 5 * 60;
  } else {
    timeLeft = 10 * 60;
  }

  updateTimeLeftTextContent();
  startStopBtn.textContent = 'Start';
});

// Settings modal
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Save settings
saveBtn.addEventListener('click', () => {
  const newBackgroundColor = backgroundColorSelect.value;
  const newFontColor = fontColorSelect.value;

  // Save new colors
  localStorage.setItem('backgroundColor', newBackgroundColor);
  localStorage.setItem('fontColor', newFontColor);

  // Save custom focus duration
  const focusVal = customFocusInput.value;
  if (focusVal > 0) {
    customFocusDuration = parseInt(focusVal, 10);
    localStorage.setItem('customFocusDuration', customFocusDuration);
    
    if (currentInterval === 'pomodoro') {
      timeLeft = customFocusDuration * 60;
      updateTimeLeftTextContent();
    }
  }

  applyUserPreferences();
  settingsModal.style.display = 'none';
});

// Timer mechanics
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimeLeftTextContent();

    if (timeLeft === 0) {
      clearInterval(timerInterval);

      if (currentInterval === 'pomodoro') {
        timeLeft = 5 * 60;
        currentInterval = 'short-break';
        startTimer();
      } else if (currentInterval === 'short-break') {
        timeLeft = 10 * 60;
        currentInterval = 'long-break';
        startTimer();
      } else {
        timeLeft = customFocusDuration * 60;
        currentInterval = 'pomodoro';
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  startStopBtn.textContent = 'Start';
}

// Update UI
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Apply saved preferences
function applyUserPreferences() {
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedFontColor = localStorage.getItem('fontColor');

  if (savedBackgroundColor) backgroundColor = savedBackgroundColor;
  if (savedFontColor) fontColor = savedFontColor;

  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = fontColor;

  timeLeftEl.style.color = fontColor;

  const buttons = document.querySelectorAll('.interval-btn, #start-stop-btn, #reset-btn, #settings-btn');
  buttons.forEach(btn => {
    btn.style.color = fontColor;
    btn.style.backgroundColor = backgroundColor;
    btn.style.borderColor = fontColor;
  });
}

// Apply on load
applyUserPreferences();
updateTimeLeftTextContent();
