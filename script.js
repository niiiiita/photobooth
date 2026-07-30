const video = document.getElementById("camera");
const button = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const gallery = document.getElementById("gallery");
const downloadBtn = document.getElementById("downloadBtn");
const FRAME = "frame/gown.png";

let stream = null;
let photos = [];

// เปิดกล้องทันทีเมื่อเข้าเว็บ
async function startCamera() {
    stream = await navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "user",
        width: { ideal: 1080 },
        height: { ideal: 1440 }
    }
});

    video.srcObject = stream;
}

startCamera();

// เมื่อกดปุ่ม
button.addEventListener("click", async () => {

    photos = [];
    gallery.innerHTML = "";
    downloadBtn.style.display = "none"; // ซ่อนปุ่มก่อนเริ่มถ่าย

    for(let i=1;i<=4;i++){
        await countdownAndShoot();
    }

    downloadBtn.style.display = "inline-block"; // แสดงเมื่อถ่ายครบ

});

function takePhoto(){


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

  const vw = video.videoWidth;
const vh = video.videoHeight;

// อัตราส่วนของช่องในเฟรม
const targetRatio = 520 / 360;

let sx = 0;
let sy = 0;
let sw = vw;
let sh = vh;

const videoRatio = vw / vh;

if (videoRatio > targetRatio) {

    // รูปกว้างเกิน → ตัดซ้ายขวา
    sw = vh * targetRatio;
    sx = (vw - sw) / 2;

} else {

    // รูปสูงเกิน → ตัดบนล่าง
    sh = vw / targetRatio;
    sy = (vh - sh) / 2;

}

ctx.drawImage(
    video,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    canvas.width,
    canvas.height
);

    const image = canvas.toDataURL("image/png");
    photos.push(image);

    photo.src = image;
    photo.style.display = "block";
    
    const img = document.createElement("img");
    img.src = image;
    
    gallery.appendChild(img);

    console.log(photos);
    console.log("จำนวนรูป:", photos.length);
}

    function countdownAndShoot(){

    return new Promise((resolve)=>{

        let number = 3;

        countdown.textContent = number;

        const timer = setInterval(()=>{

            number--;

            if(number > 0){

                countdown.textContent = number;

            }

            else if(number === 0){

                countdown.textContent = "📸";

            }

            else{

                clearInterval(timer);

                countdown.textContent = "";

                takePhoto();

                resolve();

            }

        },1000);

    });

}
function createStrip(){
    console.log("Download clicked");

    const stripCanvas = document.createElement("canvas");
    const ctx = stripCanvas.getContext("2d");

    const photoWidth = 520;
    const photoHeight = 360;

    const leftX = 30;
    const rightX = 630;

    const yPos = [
    200,
    600,
    1000,
    1400
];

    const gapY = 30;       // ระยะห่างระหว่างรูป

        stripCanvas.width = 1200;
        stripCanvas.height = 1800;

    // สีพื้นหลังตาม Theme
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(0,0,stripCanvas.width,stripCanvas.height);

    let loaded = 0;

    photos.forEach((src,index)=>{

        const img = new Image();

        img.onload = ()=>{

            const y = yPos[index];

// วาดฝั่งซ้าย
ctx.drawImage(
    img,
    leftX,
    y,
    photoWidth,
    photoHeight
);

// วาดฝั่งขวา (ใช้รูปเดิม)
ctx.drawImage(
    img,
    rightX,
    y,
    photoWidth,
    photoHeight
);

            loaded++;

            if(loaded===photos.length){
                const frame = new Image();

frame.onload = () => {

    ctx.drawImage(
        frame,
        0,
        0,
        stripCanvas.width,
        stripCanvas.height
    );

    const link = document.createElement("a");

    link.download = "photostrip.png";

    link.href = stripCanvas.toDataURL("image/png");

    link.click();

};

frame.src = FRAME;
            }

        }

        img.src=src;

    });

}

downloadBtn.addEventListener("click", createStrip);