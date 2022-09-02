import {/* drawKeypoints, */drawSkeleton } from './utils.js'
const createPoseDistanceFrom = (keypointsA = []) => {
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
  
export const poseInit = async (vid, img, vidCanvas, imgCanvas,scoreLbl) => {
    const video = vid;
    const image = img;
    const videoCanvas = vidCanvas;
    const imageCanvas = imgCanvas;

    const vidCtx = videoCanvas.getContext("2d");
    vidCtx.translate(vidCanvas.width, 0);
    vidCtx.scale(-1, 1);

    const imgCtx = imageCanvas.getContext("2d");
    imgCtx.translate(imageCanvas.width, 0);
    imgCtx.scale(-1, 1);
    runPosenet(video, image, videoCanvas, imageCanvas, vidCtx, imgCtx,scoreLbl);



    //detect(detector,image,imageCanvas,imgCtx);
}


export const runPosenet = async (video, img, canvas, imgCanvas, ctx, imgCtx,scoreLbl) => {
    scoreLbl;
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
    const poses = await detector.estimatePoses(img,{flipHorizontal:true});//important: estimateSinglePose take on input only dom element. video is a reference to video tag inside dom tree
    const imageKPs = normalizeKPs(poses, img.width, img.height);
    const distanceFromImg = createPoseDistanceFrom(imageKPs);
    detect(detector, img, imgCanvas, imgCtx)

    setInterval(async () => {
        const vidposes = await detector.estimatePoses(video,{flipHorizontal:true});//important: estimateSinglePose take on input only dom element. video is a reference to video tag inside dom tree
        const videoKPs = normalizeKPs(vidposes, video.width, video.height);
        detect(detector, video, canvas, ctx);
        //drawCanvas(videoKPs, video, canvas, ctx);
        //const filteredVideoKPs = videoKPs.filter((kp) => imageKPNames.includes(kp.name));

        const computedDistance = distanceFromImg(videoKPs);
        const computedDistancePercentage = Math.min(99, ((1 - computedDistance) / 0.7) * 100).toFixed(0);
        if (computedDistancePercentage != 0) {
            scoreLbl.innerHTML=computedDistancePercentage;
            console.log(computedDistancePercentage);
        }
    }, 100);
}

const detect = async (detector, media, canvasElement, ctx) => {
    if (media != null) {
        //const flipHorizontal = true;
        const poses = await detector.estimatePoses(media, {flipHorizontal :true});//important: estimateSinglePose take on input only dom element. video is a reference to video tag inside dom tree

        const mediaKPs = normalizeKPs(poses, media.width, media.height);

        drawCanvas(mediaKPs, media, canvasElement, ctx);

        //midle_point()
    }
}

const normalizeKPs = (poses, width, height) =>
    (poses?.[0]?.keypoints || [])
        .filter((kp) => kp.score > 0.3)
        .map(({ x, y, score, name }) => ({
            x: x / width,
            y: y / height,
            score,
            name,
        }));

const drawCanvas = (pose, video, canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSkeleton(pose, ctx, video);
}

function midle_point() {
    var p = import('./json/bacco.json')
    var json = p
    var x = 0, y = 0, count = 0
    json["keypoints"].forEach(element => {
        if (element["score"] > 0, 3) {
            x += element["position"]["x"]
            y += element["position"]["y"]
            count++
        }

    })
    x = x / count
    y = y / count
    console.log(x)
    console.log(y)
}

