let lastSetTime = 0; // 紀錄使用者設定的總秒數
let timeLeft = 0;    // 當前倒數剩餘秒數
let timerInterval = null;
let isAudioUnlocked = false; 

const display = document.getElementById('display');
const beepShort = document.getElementById('beep-short');
const beepLong = document.getElementById('beep-long');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 解鎖音效
function unlockAudio() {
    if (isAudioUnlocked) return;
    beepShort.play().then(() => {
        beepShort.pause();
        beepShort.currentTime = 0;
        isAudioUnlocked = true;
    }).catch(e => console.log("Audio unlock interaction needed"));
}

// 核心：調整時間按鈕 (現在不會自動開始倒數)
function changeTime(seconds) {
    stopTimer(); // 調整時間時，先停止目前的倒數
    timeLeft = Math.max(0, timeLeft + seconds);
    lastSetTime = timeLeft; // 更新設定值
    updateDisplay();
}

// 核心：開始 / 重新開始按鈕
function restartTimer() {
    unlockAudio(); // 使用者點擊時解鎖音效權限
    stopTimer();   // 清除舊的計時器
    
    timeLeft = lastSetTime; // 回到最初設定的秒數
    updateDisplay();
    
    if (timeLeft > 0) {
        startTimer(); // 正式啟動
    }
}

function startTimer() {
    // 建立新的計時器
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();

            // 剩下 3, 2, 1 秒短提示音
            if (timeLeft <= 3 && timeLeft > 0) {
                playSound(beepShort);
            }

            // 時間到長提示音
            if (timeLeft === 0) {
                playSound(beepLong);
                stopTimer();
            }
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log("Playback blocked:", e));
}

updateDisplay();
