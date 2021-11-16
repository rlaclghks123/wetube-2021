const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");


let stream;
let recorder;


const handleDownload =() =>{

}

const handleStop =() =>{
    startBtn.innerText = "Download Record";
    startBtn.removeEventListener("click",handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
}

const handleStart =() => {
    startBtn.innerText = "Stop Record";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) =>{
    const videoFile = URL.createObjectURL(event.data);   
    video.srcObject = null;
    video.src= videoFile;
    video.loop = true;
    video.play();
    }
}

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {width : 200, height:200},
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);