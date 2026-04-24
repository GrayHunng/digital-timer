let lastSetTime = 0; 
let timeLeft = 0;
let timerInterval = null;
let isAudioUnlocked = false; // 用於追蹤音效是否已解鎖

const display = document.getElementById('display');
const beepShort = document.getElementById('beep-short');
const beepLong = document.getElementById('beep-long');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 核心功能：解鎖音效 (在使用者點擊任何按鈕時觸發)
function unlockAudio() {
    if (isAudioUnlocked) return;

    // 播放一段靜音或極短的聲音來獲取權限
    beepShort.play().then(() => {
        beepShort.pause();
        beepShort.currentTime = 0;
        isAudioUnlocked = true;
        console.log("Audio Unlocked!");
    }).catch(e => console.log("Audio unlock failed:", e));
}

function startTimer() {
    if (timerInterval) return;
    if (timeLeft === 0) return;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();

            // 剩下 3, 2, 1 秒時
            if (timeLeft <= 3 && timeLeft > 0) {
                playSound(beepShort);
            }

            // 時間到
            if (timeLeft === 0) {
                playSound(beepLong);
                stopTimer();
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function changeTime(seconds) {
    unlockAudio(); // 使用者點擊時解鎖音效
    timeLeft = Math.max(0, timeLeft + seconds);
    lastSetTime = timeLeft;
    updateDisplay();
    if (timeLeft > 0) startTimer();
}

function restartTimer() {
    unlockAudio(); // 使用者點擊時解鎖音效
    stopTimer();
    timeLeft = lastSetTime; 
    updateDisplay();
    if (timeLeft > 0) startTimer();
}

function playSound(audioElement) {
    // 強制重置播放進度
    audioElement.pause();
    audioElement.currentTime = 0;
    
    // 使用 Promise 確保播放
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("播放失敗，嘗試再次解鎖:", error);
        });
    }
}

updateDisplay();
