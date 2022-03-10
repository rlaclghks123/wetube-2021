const video = document.querySelector("video");
const playBtn = document.getElementById("playBtn");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("muteBtn");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volmun");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");

const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const createdAtBtn = document.getElementById("createdAt");

let timeOutControl = null;
let controlsMouseMovementTimeOut = null;
let volumeValue = 0.5;
video.volume = volumeValue;



const handlePlay = () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMute = () => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-off";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumnChange = (event) => {
    const { target: { value } } = event
    if (video.muted) {
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-off"
    }
    volumeValue = value;
    video.volume = value;
    muteIcon.classList = video.volume === 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
}

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}

const handleTotalTime = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
}

const handleTimeLineChange = (event) => {
    const { target: { value } } = event
    video.currentTime = value;
}

const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
        document.exitFullscreen();
        fullScreenBtnIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtnIcon.classList = "fas fa-compress"
    }
};

const hideTimeOut = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (timeOutControl) {
        clearTimeout(timeOutControl);
        timeOutControl = null;
    }
    if (controlsMouseMovementTimeOut) {
        clearTimeout(controlsMouseMovementTimeOut);
        controlsMouseMovementTimeOut = null;
    }
    videoControls.classList.add("showing");
    controlsMouseMovementTimeOut = setTimeout(hideTimeOut, 3000);
}

const handleMouseLeave = () => {
    timeOutControl = setTimeout(hideTimeOut, 3000);
};

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, { method: "POST" });
};



playBtn.addEventListener("click", handlePlay);
video.addEventListener("click", handlePlay);
video.addEventListener("keypress", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumnChange);
video.addEventListener("loadedmetadata", handleTotalTime);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeLine.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);