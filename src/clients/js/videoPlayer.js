const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volmun");

let volumeValue = 0.5;
video.volume = volumeValue;



const handlePlay = () =>{
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Puase";
}

const handleMute = () =>{
    if(video.muted){
        video.muted = false;
    }   else{
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmuted" : "Muted";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolumnChange = (event) =>{
    const {target : {value}} = event
    if(video.muted){
        video.muted = false;
        muteBtn.innerText="Muted";
    }
    video.volume = value;
    volumeValue=value;
}

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumnChange);