let totalSeconds = 10 * 60;
let remainingSeconds = totalSeconds;
let timerId = null;
let isRunning = false;
let warned = false;

const timeText = document.getElementById("timeText");
const minutesInput = document.getElementById("minutes");
const setBtn = document.getElementById("setBtn");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const warnBanner = document.getElementById("warnBanner");

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function updateDisplay() {
  timeText.textContent = formatTime(remainingSeconds);
}

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate([300, 200, 300, 200, 300]);
  }
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 500);
  } catch (e) {
    // 사운드 재생 실패해도 무시
  }
}

function showWarning() {
  warnBanner.classList.add("show");
  vibrate();
  playBeep();
}

function hideWarning() {
  warnBanner.classList.remove("show");
}

function tick() {
  if (!isRunning) return;

  if (remainingSeconds > 0) {
    remainingSeconds--;
    updateDisplay();

    if (remainingSeconds === 60 && !warned) {
      warned = true;
      showWarning();
    }
  } else {
    stopTimer();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  if (!timerId) {
    timerId = setInterval(tick, 1000);
  }
}

function stopTimer() {
  isRunning = false;
}

function resetTimer() {
  stopTimer();
  remainingSeconds = totalSeconds;
  warned = false;
  hideWarning();
  updateDisplay();
}

setBtn.addEventListener("click", () => {
  const m = parseInt(minutesInput.value, 10);
  if (!isNaN(m) && m > 0) {
    totalSeconds = m * 60;
    remainingSeconds = totalSeconds;
    warned = false;
    hideWarning();
    updateDisplay();
  }
});

startBtn.addEventListener("click", () => {
  startTimer();
});

pauseBtn.addEventListener("click", () => {
  stopTimer();
});

resetBtn.addEventListener("click", () => {
  resetTimer();
});

// 초기 표시
updateDisplay();
