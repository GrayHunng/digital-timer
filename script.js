let lastSetTime = 0; 
let timeLeft = 0;
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

// 點擊任何按鈕時解鎖音效權限
function unlockAudio() {
    if (isAudioUnlocked) return;
    
    // 嘗試播放並立刻重置，獲取瀏覽器信任
    const p1 = beepShort.play();
    if (p1 !== undefined) {
        p1.then(() => {
            beepShort.pause();
            beepShort.currentTime = 0;
            isAudioUnlocked = true;
        }).catch(e => console.log("音效授權中..."));
    }
}

// 按下 開始/重新開始 按鈕時觸發
function handleStartRestart() {
    unlockAudio(); 
    stopTimer(); // 先停止現有的計時器
    
    if (lastSetTime > 0) {
        timeLeft = lastSetTime; // 回到最初設定的時間
        updateDisplay();
        startTimer(); // 啟動倒數
    }
}

function startTimer() {
    if (timerInterval) return; // 防止重複啟動
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();

            // 倒數 3, 2, 1 秒
            if (timeLeft <= 3 && timeLeft > 0) {
                playSound(beepShort);
            }

            // 時間到
            if (timeLeft === 0) {
                playSound(beepLong);
                stopTimer();
            }
        } else {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// 按下 +15s 或 -15s 時觸發
function changeTime(seconds) {
    unlockAudio();
    stopTimer(); // 調整時間時要先停止計時
    
    timeLeft = Math.max(0, timeLeft + seconds);
    lastSetTime = timeLeft; // 更新基準時間
    updateDisplay();
}

function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log("播放被攔截"));
}

updateDisplay();
