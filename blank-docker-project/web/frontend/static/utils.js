const color = 'aqua';
const boundingBoxColor = 'red';
const lineWidth = 2;
/*
function toTuple({ y, x }) {
  return [y, x];
}
*/
const drawPoint = ({ x, y, r, ctx,width,height}) => {
  ctx.beginPath();
  ctx.arc(x * width, y * height, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};
const drawSegment = ({ pointA, pointB, ctx,width,height}) => {
  if (pointA && pointB) {
    ctx.beginPath();
    ctx.moveTo(pointA.x * width, pointA.y * height);
    ctx.lineTo(pointB.x * width, pointB.y * height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
};

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, /*minConfidence,*/ctx,src, scale = 0.5) {
  const width=src.width
  const height=src.height

  const adjacentKeyPoints = [
    ["nose", "left_eye"],
    ["nose", "right_eye"],
    ["left_eye", "left_ear"],
    ["right_eye", "right_ear"],
    ["left_shoulder", "right_shoulder"],
    ["left_shoulder", "left_elbow"],
    ["left_elbow", "left_wrist"],
    ["right_shoulder", "right_elbow"],
    ["right_elbow", "right_wrist"],
    ["left_shoulder", "left_hip"],
    ["right_shoulder", "right_hip"],
    ["left_hip", "right_hip"],
    ["left_hip", "left_knee"],
    ["left_knee", "left_ankle"],
    ["right_hip", "right_knee"],
    ["right_knee", "right_ankle"],
  ];
  
  keypoints.forEach(({ x, y }) => {
    drawPoint({ x, y, r: 6,ctx,width,height});
  });

  adjacentKeyPoints.forEach(([first, second]) => {
    drawSegment({
      pointA: keypoints.find(({ name }) => name === first),
      pointB: keypoints.find(({ name }) => name === second),
      ctx,
      width,
      height
    });
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
/*
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}*/