const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volmun");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


let timeOutControl = null;
let controlsMouseMovementTimeOut = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlay = () => {
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMute =() => {
    if(video.muted){
        video.muted=false;
    }else{
        video.muted =true;
    }
    muteBtn.innerText = video.muted ? "Unmuted" : "Muted" ;
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumnChange =(event) =>{
    const {target :{value}} =event
    if(video.muted){
        video.muted=false;
        muteBtn.innerText = "Mute"
    }
    volumeValue=value;
    video.value=value;

}

const formatTime = (seconds) =>{
    return new Date(seconds* 1000).toISOString().substr(14,5);
}

const handleTotalTime = () => {
    totalTime.innerText= formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
}

const handleTimeUpdate = () =>{
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
}

const handleTimeLineChange =(event) =>{
const {target : {value}}=event
video.currentTime = value;
}

const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if(fullScreen){
        document.exitFullscreen();
        fullScreenBtn.innerText = "Full Screen";
    }else{
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText="Exit Full Screen"
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(timeOutControl){
        clearTimeout(timeOutControl);
        timeOutControl=null;
    }
    
    if(controlsMouseMovementTimeOut){
        clearTimeout(controlsMouseMovementTimeOut);
        controlsMouseMovementTimeOut=null;
    }
    videoControls.classList.add("showing");
    controlsMouseMovementTimeOut=setTimeout(hideControls,3000);
}

const handleMouseLeave = () => {
    timeOutControl=setTimeout(hideControls,3000);
}


playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumnChange);
video.addEventListener("loadedmetadata", handleTotalTime);
video.addEventListener("timeupdate", handleTimeUpdate)
timeLine.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);