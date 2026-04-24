let lastSetTime = 0; // 記住使用者最近一次設定的時間
let timeLeft = 0;
let timerInterval = null;

const display = document.getElementById('display');
const beepShort = document.getElementById('beep-short');
const beepLong = document.getElementById('beep-long');

// 格式化時間並更新顯示
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    display.textContent = formattedTime;
}

// 開始計時
function startTimer() {
    if (timerInterval) return;
    
    // 如果是 0，不開始
    if (timeLeft === 0) return;

    // 行動裝置優化：點擊後先強制載入音效，解決無聲問題
    preloadAudio();

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();

            // 剩下 3, 2, 1 秒時發出短提示音
            if (timeLeft <= 3 && timeLeft > 0) {
                playSound(beepShort);
            }

            // 時間到
            if (timeLeft === 0) {
                updateDisplay(); // 確保顯示 00:00
                playSound(beepLong);
                stopTimer();
            }
        }
    }, 1000);
}

// 停止計時
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// 調整時間 (+15s, -15s)
function changeTime(seconds) {
    timeLeft = Math.max(0, timeLeft + seconds);
    
    // 關鍵更改：將調整後的時間設定為「最後一次使用者設定的時間」
    lastSetTime = timeLeft;
    
    updateDisplay();
    if (timeLeft > 0) startTimer();
}

// 關鍵更改：新的 [重新開始] 邏輯
function restartTimer() {
    stopTimer(); // 停止目前的計時
    
    // 將時間設回上次設定的時間 (例如 30 秒)
    timeLeft = lastSetTime; 
    
    updateDisplay();
    if (timeLeft > 0) startTimer(); // 自動開始倒數
}

// 音效播放
function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(error => {
        console.log("音效被攔截:", error);
    });
}

// 預載入音效
function preloadAudio() {
    beepShort.load();
    beepLong.load();
}

// 初始化
updateDisplay();
