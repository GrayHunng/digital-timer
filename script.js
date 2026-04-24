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

// 解鎖音效 (關鍵：在使用者點擊按鈕時執行)
function unlockAudio() {
    if (isAudioUnlocked) return;
    
    // 透過播放一段靜音或重設音軌來獲取瀏覽器播放權限
    beepShort.play().then(() => {
        beepShort.pause();
        beepShort.currentTime = 0;
        beepLong.play().then(() => {
            beepLong.pause();
            beepLong.currentTime = 0;
            isAudioUnlocked = true;
        });
    }).catch(e => console.log("等待互動以解鎖音效"));
}

function startTimer() {
    if (timerInterval || timeLeft === 0) return;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();

            // 剩下 3, 2, 1 秒
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
    unlockAudio(); // 每次點擊都嘗試解鎖，直到成功
    timeLeft = Math.max(0, timeLeft + seconds);
    lastSetTime = timeLeft;
    updateDisplay();
    if (timeLeft > 0) startTimer();
}

function restartTimer() {
    unlockAudio();
    stopTimer();
    timeLeft = lastSetTime; 
    updateDisplay();
    if (timeLeft > 0) startTimer();
}

function playSound(audioElement) {
    audioElement.currentTime = 0; // 回到開頭
    audioElement.play().catch(e => console.log("播放被攔截:", e));
}

updateDisplay();
