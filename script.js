let timeLeft = 0; // 剩餘時間 (秒)
let timerInterval = null;

const display = document.getElementById('display');
const beepShort = document.getElementById('beep-short');
const beepLong = document.getElementById('beep-long');

// 格式化時間並更新顯示
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // padStart(2, '0') 確保顯示為 00:00 格式
    const formattedTime = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    display.textContent = formattedTime;
}

// 開始計時核心邏輯
function startTimer() {
    // 如果已經在計時，不需要重複啟動
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();

            // === 音效處理邏輯 ===

            // 1. 剩下 3, 2, 1 秒時發出短提示音 (在數字切換後立刻播放)
            if (timeLeft <= 3 && timeLeft > 0) {
                playSound(beepShort);
            }

            // 2. 時間到 (0秒)
            if (timeLeft === 0) {
                updateDisplay(); // 確保顯示 00:00
                playSound(beepLong);
                stopTimer();
            }
        } else {
            stopTimer();
        }
    }, 1000); // 每秒執行一次
}

// 停止計時
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// 調整時間 (+15s, -15s)
function changeTime(seconds) {
    // 調整時間，並使用 Math.max 確保時間不會小於 0
    timeLeft = Math.max(0, timeLeft + seconds);
    updateDisplay();
    
    if (timeLeft > 0) {
        startTimer(); // 如果有時間，自動開始倒數
    } else {
        stopTimer(); // 如果變成 0，停止計時
    }
}

// 重置時間
function resetTimer() {
    stopTimer();
    timeLeft = 0;
    updateDisplay();
}

// 處理音效播放 (解決行動裝置可能不讓連續播放的問題)
function playSound(audioElement) {
    // 重設播放進度到開頭，防止快速連續觸發時無聲
    audioElement.currentTime = 0;
    // 播放，並捕捉可能發生的錯誤 (例如瀏覽器攔截自動播放)
    audioElement.play().catch(error => {
        console.log("音效播放被攔截，通常需要使用者先點擊頁面:", error);
    });
}

// 初始化顯示
updateDisplay();
