import {/* drawKeypoints, */drawSkeleton } from './utils.js'
import { getLevel, getPicture, postVideo } from "./fetchUtils.js";

const createPoseDistanceFrom = async (keypointsA = []) => {
  const [avgXA, avgYA] = keypointsA
    .reduce(([sumX, sumY], kpA) => [sumX + kpA.x, sumY + kpA.y], [0, 0])
    .map((sum) => sum / keypointsA.length);

  return (keypointsB = []) => {
    const count = keypointsA.reduce((res, kpA) => {
      if (keypointsB.find((kpB) => kpA.name === kpB.name)) {
        return res + 1;
      }
      return res;
    }, 0);
    if (count < keypointsA.length / 2) {
      return 1;
    }
    const [avgXB, avgYB] = keypointsB
      .reduce(([sumX, sumY], kpB) => [sumX + kpB.x, sumY + kpB.y], [0, 0])
      .map((res) => res / keypointsB.length);

    return Math.sqrt(
      keypointsA.reduce((res, kpA) => {
        const kpB = keypointsB.find((kpB) => kpA.name === kpB.name);
        if (!kpB) {
          return res + 1; //1 è la distanza massima che si può raggiungere
        }
        const relativeDistanceXA = kpA.x - avgXA;
        const relativeDistanceXB = kpB.x - avgXB;
        const relativeDistanceYA = kpA.y - avgYA;
        const relativeDistanceYB = kpB.y - avgYB;
        const spaceDistance = Math.sqrt(
          Math.pow(relativeDistanceXA - relativeDistanceXB, 2) + Math.pow(relativeDistanceYA - relativeDistanceYB, 2)
        );
        return res + spaceDistance;
      }, 0) / keypointsA.length
    );
  };
};

export const poseInit = async (vid, img, vidCanvas, imgCanvas, scoreLbl, timelbl, level) => {
  const video = vid;
  const image = img;
  const videoCanvas = vidCanvas;
  const imageCanvas = imgCanvas;
  vidCanvas.width=video.width;
  vidCanvas.height=video.height;
  imageCanvas.width=image.width;
  imageCanvas.height=image.height;

  const vidCtx = videoCanvas.getContext("2d");
  vidCtx.translate(vidCanvas.width, 0);
  vidCtx.scale(-1, 1);

  const imgCtx = imageCanvas.getContext("2d");
  imgCtx.translate(imageCanvas.width, 0);
  imgCtx.scale(-1, 1);

  runPosenet(video, image, videoCanvas, imageCanvas, vidCtx, imgCtx, scoreLbl, timelbl, level);

}

const createImage = (img, src) =>
  new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = "../../" + src;
  });

export const runPosenet = async (video, img, canvas, imgCanvas, ctx, imgCtx, scoreLbl, timelbl, levelId) => {
  scoreLbl;
  const level = await getLevel(levelId);
  let round = 0;

  async function sendscore(time, guessed) {
    const user_id = JSON.parse(document.getElementById('user_id').textContent);
    const response = await axios.get('/frontend/setscore', {
      params: {
        "user_id": user_id,
        "time": time,
        "guessed": guessed
      }
    },)
  }
  const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
  //const userVideoList = [];
  const levelPictures = await getPicture(level[0].pk);
  var timeleft = 30 * levelPictures.length
  
  const nextRound = async () => {
    var picture = await levelPictures[round].fields.path;
    timelbl.innerHTML = Math.trunc(timeleft) + " s";
    await createImage(img, picture);
    const poses = await detector.estimatePoses(img, { flipHorizontal: true });//important: estimateSinglePose take on input only dom element. video is a reference to video tag inside dom tree
    const imageKPs = await normalizeKPs(poses, img.width, img.height);
    const distanceFromImg = await createPoseDistanceFrom(imageKPs);
    //detect(detector, img, imgCanvas, imgCtx)
    await drawCanvas(imageKPs, img, imgCanvas, imgCtx);
    document.getElementById("loading").style.display = "none";
    const gameLoop = setInterval(async () => {
      timelbl.innerHTML = Math.trunc(timeleft) + " s";
      const vidposes = await detector.estimatePoses(video, { flipHorizontal: true });//important: estimateSinglePose take on input only dom element. video is a reference to video tag inside dom tree
      const videoKPs = await normalizeKPs(vidposes, video.width, video.height);
      //detect(detector, video, canvas, ctx);
      await drawCanvas(videoKPs, video, canvas, ctx);
      //const filteredVideoKPs = videoKPs.filter((kp) => imageKPNames.includes(kp.name));

      const computedDistance = distanceFromImg(videoKPs);
      const computedDistancePercentage = Math.min(99, ((1 - computedDistance) / 0.8) * 100).toFixed(0);

      scoreLbl.value = computedDistancePercentage;
      console.log(computedDistancePercentage);

      if (computedDistancePercentage >= 0.6 * 100) {
        clearInterval(gameLoop)
        console.log("MATCH")
        round++;
        if (round < levelPictures.length && timeleft > 0) {
          await nextRound();
        } else {
          stopvideo()
          const time = (30 * levelPictures.length) - timeleft
          sendscore(time, round) 
        }
      }
      if (timeleft <= 0) {
        clearInterval(gameLoop);
        stopvideo()
        const time = (30 * levelPictures.length) - timeleft
        sendscore(time, round) 
      }
      timeleft -= 0.1;
    }, 100);
    return gameLoop;
  };
  return nextRound();
}

const normalizeKPs = async (poses, width, height) =>
  (poses?.[0]?.keypoints || [])
    .filter((kp) => kp.score > 0.3)
    .map(({ x, y, score, name }) => ({
      x: x / width,
      y: y / height,
      score,
      name,
    }));

const drawCanvas = async (pose, video, canvas, ctx) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSkeleton(pose, ctx, video);
}


const parts = []
var mediaRecorder;
window.onload = async function () {

  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(function (stream) {
    document.getElementById(('videoElement')).srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(100);
    mediaRecorder.ondataavailable = function (e) {
      parts.push(e.data);
    }
  });
}
function stopvideo() {
  mediaRecorder.stop();
  var blob = new Blob(parts, {
    'type': 'video/mp4'
  });
  var videoURL = URL.createObjectURL(blob);
  const end = document.getElementById('endContainer')
  const start = document.getElementById('gameContainer')
  const video2 = document.getElementById('videoElement2')
  video2.src = videoURL
  video2.play()
  start.style.display = "none"
  end.style.display = "block"
}

/* end game function */
getdata();

var table = document.getElementById("table");

function printTable(data) {
  for (var i = 0; i < data.length; i++) {
    var row = `<tr>
                                <td>${data[i][0]}</td>
                                <td>${data[i][1]}</td>
                                <td>${data[i][2]}</td>
                                <td>${data[i][3]}</td>
                            </tr>`;
    table.innerHTML += row;
  }
}

var carousel = document.getElementById("slideshow-container");
var slideIndex = 1;

export function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

export function showSlides(n) {
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}

async function showImageInfos(id){
  const PicuresList = await getPicture(id);
  //const levelListEl = document.getElementById("level-list");
  for (var i = 0; i < PicuresList.length; i++) {
    carousel.innerHTML += `
    <div class="mySlides fade">
    <img class="slideImg" src='../../${PicuresList[i].fields.path}' width="640"">
    <div class="text">${PicuresList[i].fields.description}</div>
    </div>
     `;
  }
  carousel.innerHTML+=`<a id="prev">❮</a><a id="next">❯</a>`;
  
  document.getElementsByClassName('slideImg').width=document.getElementById('videoElement').width
  document.getElementById("prev").onclick = function() {plusSlides(-1)};
  document.getElementById("next").onclick = function() {plusSlides(1)};
  showSlides(1)
}

async function getdata() {
  var response = await axios.get('http://localhost:8000/frontend/getscore');
  console.log(response.data);
  printTable(response.data);
  const params = new URLSearchParams(window.location.search)
  const levelId = params.get('id');
  await showImageInfos(levelId);
}